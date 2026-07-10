'use client';

// ═══════════════════════════════════════════════════════════════
// SwarmOS — Cinematic Orbital Visualization
// React Three Fiber + drei — Full 3D Scene
// ═══════════════════════════════════════════════════════════════

import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Line, Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useSwarmStore } from '../../store/useSwarmStore';
import { calculateSatellitePosition } from '../../engine/swarmEngine';

// ─────────────────────────────────────────────
// Earth — Core globe with layered atmosphere
// ─────────────────────────────────────────────
function Earth() {
  const earthRef = useRef<THREE.Mesh>(null!);
  const cloudsRef = useRef<THREE.Mesh>(null!);
  const isPaused = useSwarmStore(s => s.isPaused);

  const [colorMap, normalMap, specularMap, cloudsMap, lightsMap] = useTexture([
    '/textures/planets/earth_atmos_2048.jpg',
    '/textures/planets/earth_normal_2048.jpg',
    '/textures/planets/earth_specular_2048.jpg',
    '/textures/planets/earth_clouds_1024.png',
    '/textures/planets/earth_lights_2048.png',
  ]);

  useFrame(() => {
    if (!isPaused) {
      if (earthRef.current) earthRef.current.rotation.y += 0.0006;
      if (cloudsRef.current) cloudsRef.current.rotation.y += 0.00085;
    }
  });

  return (
    <group>
      {/* Core planet */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1.6, 64, 64]} />
        <meshPhongMaterial
          map={colorMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.85, 0.85)}
          specularMap={specularMap}
          specular={new THREE.Color('#333333')}
          shininess={25}
          emissiveMap={lightsMap}
          emissive={new THREE.Color('#ffddaa')}
          emissiveIntensity={0.65}
        />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.625, 64, 64]} />
        <meshPhongMaterial
          map={cloudsMap}
          transparent
          opacity={0.8}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner atmosphere rim glow */}
      <mesh>
        <sphereGeometry args={[1.7, 64, 64]} />
        <meshBasicMaterial
          color="#3388ff"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer atmosphere halo */}
      <mesh>
        <sphereGeometry args={[1.82, 64, 64]} />
        <meshBasicMaterial
          color="#00aaff"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────
// Satellite Node — Individual orbiting agent
// ─────────────────────────────────────────────
interface SatelliteNodeProps {
  index: number;
}

function SatelliteNode({ index }: SatelliteNodeProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const emissiveRef = useRef(0);
  const setHoveredId = useSwarmStore(s => s.setHoveredSatelliteId);
  const setSelectedId = useSwarmStore(s => s.setSelectedSatelliteId);
  const hoveredId = useSwarmStore(s => s.hoveredSatelliteId);
  const selectedId = useSwarmStore(s => s.selectedSatelliteId);

  useFrame(({ clock }) => {
    const sat = useSwarmStore.getState().satellites[index];
    if (!sat || !groupRef.current || !meshRef.current) return;

    // Set position from store
    groupRef.current.position.set(sat.position.x, sat.position.y, sat.position.z);

    const isHovered = useSwarmStore.getState().hoveredSatelliteId === sat.config.id;
    const isSelected = useSwarmStore.getState().selectedSatelliteId === sat.config.id;

    // Scale slightly when hovered/selected
    const targetScale = isHovered || isSelected ? 1.35 : 1.0;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);

    // Handle emissive pulsing for collision / maneuvering states
    const t = clock.getElapsedTime();
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;

    if (sat.isCollisionTarget) {
      emissiveRef.current = 0.4 + Math.sin(t * 6) * 0.4;
      mat.color.set('#ff3355');
      mat.emissive.set('#ff3355');
      mat.emissiveIntensity = emissiveRef.current;
    } else if (sat.isManeuvering) {
      emissiveRef.current = 0.3 + Math.sin(t * 8) * 0.3;
      mat.color.set('#00ffff');
      mat.emissive.set('#00ffff');
      mat.emissiveIntensity = emissiveRef.current;
    } else if (isHovered || isSelected) {
      mat.color.set(sat.config.color);
      mat.emissive.set(sat.config.color);
      mat.emissiveIntensity = 0.45;
    } else {
      mat.color.set(sat.config.color);
      mat.emissive.set('#000000');
      mat.emissiveIntensity = 0;
    }
  });

  const satConfig = useSwarmStore((s) => s.satellites[index]?.config);

  return (
    <group ref={groupRef}>
      {/* Visible Satellite Mesh */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.07, 24, 24]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>

      {/* Outer Glow / Ring when hovered or selected */}
      {(hoveredId === satConfig?.id || selectedId === satConfig?.id) && (
        <mesh>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshBasicMaterial
            color={satConfig?.color || '#00e5ff'}
            transparent
            opacity={0.3}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* Invisible Hover Hit Sphere for larger interaction target area */}
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          const sat = useSwarmStore.getState().satellites[index];
          if (sat) {
            setHoveredId(sat.config.id);
          }
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          const sat = useSwarmStore.getState().satellites[index];
          if (sat && useSwarmStore.getState().hoveredSatelliteId === sat.config.id) {
            setHoveredId(null);
          }
          document.body.style.cursor = 'auto';
        }}
        onClick={(e) => {
          e.stopPropagation();
          const sat = useSwarmStore.getState().satellites[index];
          if (sat) {
            setSelectedId(sat.config.id);
          }
        }}
      >
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────
// Orbital Trail — Elliptical path line
// ─────────────────────────────────────────────
interface OrbitalTrailProps {
  index: number;
}

function OrbitalTrail({ index }: OrbitalTrailProps) {
  const sat = useSwarmStore(s => s.satellites[index]);
  const activeCollision = useSwarmStore(s => s.activeCollision);

  const points = useMemo(() => {
    if (!sat) return [];
    const pts: [number, number, number][] = [];
    const segments = 120;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const pos = calculateSatellitePosition(sat.config, angle + sat.orbitPhaseOffset);
      pts.push([pos.x, pos.y, pos.z]);
    }
    return pts;
  }, [sat?.config, sat?.orbitPhaseOffset]);

  if (!sat || points.length === 0) return null;

  const isInCollision =
    activeCollision &&
    (activeCollision.sat1Id === sat.config.id ||
     activeCollision.sat2Id === sat.config.id ||
     activeCollision.satellite1Id === sat.config.id ||
     activeCollision.satellite2Id === sat.config.id ||
     activeCollision.satelliteA === sat.config.id ||
     activeCollision.satelliteB === sat.config.id ||
     sat.isCollisionTarget);

  return (
    <Line
      points={points}
      color={isInCollision ? '#f59e0b' : sat.config.color}
      lineWidth={isInCollision ? 1.5 : 0.6}
      transparent
      opacity={isInCollision ? 0.5 : activeCollision ? 0.12 : 0.22}
    />
  );
}

// ─────────────────────────────────────────────
// Communication Lines — Inter-satellite P2P links
// Only visible when relevant (during active anomalies / decision mode)
// ─────────────────────────────────────────────
function CommLines() {
  const messages = useSwarmStore(s => s.messages);
  const satellites = useSwarmStore(s => s.satellites);
  const phase = useSwarmStore(s => s.phase);

  const lines = useMemo(() => {
    // Return empty if in normal operations or after resolution
    if (phase === 'NORMAL_OPS' || phase === 'STORY' || phase === 'DASHBOARD_INIT' || phase === 'CARGO_LAUNCH' || phase === 'COLLISION_AVOIDED') {
      return [];
    }

    const recent = messages.slice(-4);
    const links: {
      from: [number, number, number];
      to: [number, number, number];
      color: string;
    }[] = [];

    recent.forEach((msg) => {
      const senderSat = satellites.find(s => s.config.id === (msg.fromId || msg.from));
      if (!senderSat) return;
      const fromPos: [number, number, number] = [senderSat.position.x, senderSat.position.y, senderSat.position.z];

      if (msg.toId === 'all' || msg.to === 'all' || msg.toName === 'Fleet') {
        // Link only to the single closest peer to keep visual layout clean and deliberate
        let closestSat: any = null;
        let minDist = Infinity;
        satellites.forEach((sat) => {
          if (sat.config.id === senderSat.config.id) return;
          const dist = Math.hypot(sat.position.x - senderSat.position.x, sat.position.y - senderSat.position.y, sat.position.z - senderSat.position.z);
          if (dist < minDist && dist <= 2.8) {
            minDist = dist;
            closestSat = sat;
          }
        });
        if (closestSat) {
          links.push({
            from: fromPos,
            to: [closestSat.position.x, closestSat.position.y, closestSat.position.z],
            color: '#00e5ff',
          });
        }
      } else {
        const receiverSat = satellites.find(s => s.config.id === (msg.toId || msg.to));
        if (receiverSat) {
          links.push({
            from: fromPos,
            to: [receiverSat.position.x, receiverSat.position.y, receiverSat.position.z],
            color: '#00e5ff',
          });
        }
      }
    });
    return links;
  }, [messages, satellites, phase]);

  if (lines.length === 0) {
    return null;
  }

  return (
    <group>
      {lines.map((line, i) => (
        <Line
          key={`comm-line-${i}`}
          points={[line.from, line.to]}
          color={line.color}
          lineWidth={1.0}
          transparent
          opacity={0.38}
        />
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────
// Collision Danger Zone — Removed unlabelled floating sphere to eliminate visual confusion
// ─────────────────────────────────────────────
function CollisionZone() {
  return null;
}

// ─────────────────────────────────────────────
// Thruster Effects — Point light flicker
// ─────────────────────────────────────────────
function ThrusterEffects() {
  const satellites = useSwarmStore(s => s.satellites);
  const lightsRef = useRef<Map<string, THREE.PointLight>>(new Map());

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const sats = useSwarmStore.getState().satellites;

    sats.forEach((sat) => {
      const light = lightsRef.current.get(sat.config.id);
      if (!light) return;

      if (sat.thrusterActive) {
        light.visible = true;
        light.position.set(sat.position.x, sat.position.y, sat.position.z);
        light.intensity = 1.5 + Math.sin(t * 20 + Math.random() * 0.5) * 1.0;
      } else {
        light.visible = false;
      }
    });
  });

  return (
    <group>
      {satellites.map((sat) => (
        <pointLight
          key={`thruster-${sat.config.id}`}
          ref={(el) => {
            if (el) lightsRef.current.set(sat.config.id, el);
          }}
          color="#88ffff"
          intensity={0}
          distance={1.5}
          decay={2}
          visible={false}
        />
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────
// Satellite Label — Clean, minimal glassmorphism label (No giant red billboards)
// ─────────────────────────────────────────────
interface SatelliteLabelProps {
  index: number;
}

function SatelliteLabel({ index }: SatelliteLabelProps) {
  const sat = useSwarmStore(s => s.satellites[index]);
  const selectedId = useSwarmStore(s => s.selectedSatelliteId);
  const hoveredId = useSwarmStore(s => s.hoveredSatelliteId);
  const activeCollision = useSwarmStore(s => s.activeCollision);
  const setSelectedId = useSwarmStore(s => s.setSelectedSatelliteId);

  if (!sat) return null;

  // Determine visibility: show cleanly if selected, hovered, or involved in active collision
  const isSelected = selectedId === sat.config.id;
  const isHovered = hoveredId === sat.config.id;
  const isInCollision =
    activeCollision &&
    (activeCollision.satelliteA === sat.config.id ||
      activeCollision.satelliteB === sat.config.id ||
      activeCollision.sat1Id === sat.config.id ||
      activeCollision.sat2Id === sat.config.id ||
      activeCollision.satellite1Id === sat.config.id ||
      activeCollision.satellite2Id === sat.config.id ||
      sat.isCollisionTarget);

  if (!isSelected && !isHovered && !isInCollision) return null;

  return (
    <Html
      position={[sat.position.x, sat.position.y + 0.18, sat.position.z]}
      center
      distanceFactor={9}
      style={{ pointerEvents: 'none', zIndex: isSelected || isHovered || isInCollision ? 100 : 10 }}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          setSelectedId(sat.config.id);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '4px 9px',
          background: isInCollision
            ? 'rgba(25, 10, 18, 0.88)'
            : 'rgba(8, 14, 28, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: isInCollision
            ? '1px solid rgba(245, 158, 11, 0.45)'
            : '1px solid rgba(0, 229, 255, 0.35)',
          borderRadius: '20px',
          fontFamily: "'Outfit', sans-serif",
          fontSize: '11px',
          color: isInCollision ? '#fcd34d' : '#e0f2fe',
          whiteSpace: 'nowrap',
          letterSpacing: '0.02em',
          userSelect: 'none',
          pointerEvents: 'auto',
          cursor: 'pointer',
          boxShadow: isInCollision
            ? '0 4px 14px rgba(245, 158, 11, 0.22)'
            : isSelected || isHovered
            ? '0 0 16px rgba(0, 229, 255, 0.35)'
            : '0 0 8px rgba(50, 120, 255, 0.15)',
          transition: 'all 0.2s ease',
        }}
      >
        <span style={{ fontSize: '11px' }}>{sat.config.icon}</span>
        <span style={{ fontWeight: 600 }}>{sat.config.name}</span>
        {isInCollision && (
          <span style={{
            fontSize: '9px',
            fontWeight: 700,
            textTransform: 'uppercase',
            background: 'rgba(245, 158, 11, 0.2)',
            color: '#fbbf24',
            padding: '1px 6px',
            borderRadius: '10px',
            marginLeft: '2px'
          }}>
            {sat.config.id === 'gaia' ? 'Deviated • Candidate' : 'Target Vector'}
          </span>
        )}
      </div>
    </Html>
  );
}

// ─────────────────────────────────────────────
// Scene Contents — Composed inside Canvas
// ─────────────────────────────────────────────
function SceneContents() {
  const satellites = useSwarmStore(s => s.satellites);
  const isPaused = useSwarmStore(s => s.isPaused);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.1} />
      <directionalLight
        position={[5, 3, 5]}
        intensity={1.5}
        color="#ffffff"
        castShadow={false}
      />

      {/* Controls */}
      <OrbitControls
        enableZoom
        enablePan
        autoRotate={!isPaused}
        autoRotateSpeed={0.3}
        dampingFactor={0.05}
        enableDamping
        minDistance={4}
        maxDistance={20}
      />

      {/* Starfield */}
      <Stars
        radius={100}
        depth={50}
        count={3000}
        factor={4}
        saturation={0.2}
        fade
        speed={isPaused ? 0 : 0.3}
      />

      {/* Earth */}
      <Earth />

      {/* Orbital Trails */}
      {satellites.map((_, i) => (
        <OrbitalTrail key={`trail-${i}`} index={i} />
      ))}

      {/* Satellite Nodes */}
      {satellites.map((_, i) => (
        <SatelliteNode key={`sat-${i}`} index={i} />
      ))}

      {/* Communication Links */}
      <CommLines />

      {/* Collision Danger Zone */}
      <CollisionZone />

      {/* Thruster Effects */}
      <ThrusterEffects />

      {/* Satellite Labels */}
      {satellites.map((_, i) => (
        <SatelliteLabel key={`label-${i}`} index={i} />
      ))}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// OrbitalScene — Root Canvas export
// ═══════════════════════════════════════════════════════════════
export default function OrbitalScene() {
  return (
    <Canvas
      camera={{ position: [0, 3, 10], fov: 50 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      dpr={[1, 2]}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#000008',
      }}
    >
      <color attach="background" args={['#000008']} />
      <fog attach="fog" args={['#000008', 15, 35]} />
      <Suspense fallback={null}>
        <SceneContents />
      </Suspense>
    </Canvas>
  );
}
