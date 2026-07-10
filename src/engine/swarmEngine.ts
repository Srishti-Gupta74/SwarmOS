// ═══════════════════════════════════════════════════════════
// SwarmOS — Swarm Simulation Engine (Pure Logic, No React)
// Orbital mechanics, collision detection, P2P consensus
// ═══════════════════════════════════════════════════════════

import type { SatelliteConfig } from '../data/satellites';

// ─── Constants ──────────────────────────────────────────────
const SAFETY_THRESHOLD = 0.8; // units — below this, collision risk exists

// ─── Type Exports ───────────────────────────────────────────

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type SimPhase =
  | 'STORY'
  | 'DASHBOARD_INIT'
  | 'NORMAL_OPS'
  | 'CARGO_LAUNCH'
  | 'SOLAR_STORM'
  | 'COLLISION_DETECTED'
  | 'COMMUNICATION'
  | 'CONSENSUS'
  | 'CONSEQUENCE'
  | 'VOLUNTEER'
  | 'THRUSTER_BURN'
  | 'COLLISION_AVOIDED'
  | 'MISSION_COMPLETE';

export interface SatelliteState {
  id?: string;
  name?: string;
  icon?: string;
  mission?: string;
  color?: string;
  type?: string;
  config: SatelliteConfig;
  position: { x: number; y: number; z: number };
  fuelPercent: number;
  status: string;
  isActive: boolean;
  isDrifting: boolean;
  isCollisionTarget: boolean;
  isManeuvering: boolean;
  thrusterActive: boolean;
  orbitPhaseOffset: number; // added during maneuver
}

export interface CollisionEvent {
  sat1Id: string;
  sat2Id: string;
  satellite1Id?: string;
  satellite2Id?: string;
  satelliteA?: string;
  satelliteB?: string;
  distance: number;
  risk: RiskLevel;
  riskLevel?: RiskLevel;
}

export interface CommMessage {
  id: string;
  timestamp: number;
  fromId: string;
  from?: string;
  fromName: string;
  toId: string;
  to?: string;
  toName: string;
  senderName?: string;
  senderIcon?: string;
  receiverName?: string;
  content: string;
  type: 'BROADCAST' | 'DIRECT' | 'ALERT' | 'CONSENSUS' | 'SYSTEM';
  isDanger: boolean;
}

export interface ConsensusResult {
  volunteerId: string;
  volunteerName: string;
  volunteerIcon?: string;
  fuelReserve?: number;
  missionPriority?: string;
  distanceToHazard?: number;
  confidence?: number;
  fuelLoss?: number;
  reason: string[];
  reasons?: string[];
  participants: { id: string; name: string; canManeuver: boolean; reason: string }[];
  consensusDuration: number;
  fuelCost: number;
  confidencePercent: number;
}

// ─── Orbital Mechanics ──────────────────────────────────────

/**
 * Calculate satellite position using simple circular orbital mechanics.
 * The orbit is a tilted circle around the origin.
 *
 * @param config      Satellite configuration with orbital parameters
 * @param elapsedTime Elapsed simulation time in seconds
 * @returns           {x, y, z} position in world-space
 */
export function calculateSatellitePosition(
  config: SatelliteConfig,
  elapsedTime: number,
): { x: number; y: number; z: number } {
  const angle = config.orbitPhase + config.orbitSpeed * elapsedTime;
  const inclRad = (config.orbitInclination * Math.PI) / 180;
  const r = config.orbitRadius;

  // Flat-circle position in the orbit plane
  const xFlat = r * Math.cos(angle);
  const yFlat = r * Math.sin(angle);

  // Tilt the orbit plane around the X-axis by the inclination angle
  const x = xFlat;
  const y = yFlat * Math.cos(inclRad);
  const z = yFlat * Math.sin(inclRad);

  return { x, y, z };
}

// ─── Collision Detection ────────────────────────────────────

function distanceBetween(
  a: { x: number; y: number; z: number },
  b: { x: number; y: number; z: number },
): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function riskFromDistance(distance: number): RiskLevel {
  if (distance < 0.2) return 'CRITICAL';
  if (distance < 0.4) return 'HIGH';
  if (distance < 0.6) return 'MEDIUM';
  return 'LOW';
}

/**
 * Check distances between all satellite pairs.
 * Pairs closer than SAFETY_THRESHOLD are returned as collision events.
 */
export function detectCollisions(satellites: SatelliteState[]): CollisionEvent[] {
  const events: CollisionEvent[] = [];

  for (let i = 0; i < satellites.length; i++) {
    for (let j = i + 1; j < satellites.length; j++) {
      const a = satellites[i];
      const b = satellites[j];
      const dist = distanceBetween(a.position, b.position);

      if (dist < SAFETY_THRESHOLD) {
        events.push({
          sat1Id: a.config.id,
          sat2Id: b.config.id,
          satellite1Id: (a.id || a.config.id),
          satellite2Id: (b.id || b.config.id),
          satelliteA: (a.id || a.config.id),
          satelliteB: (b.id || b.config.id),
          distance: parseFloat(dist.toFixed(4)),
          risk: riskFromDistance(dist),
          riskLevel: riskFromDistance(dist),
        });
      }
    }
  }

  return events;
}

// ─── Communication Helpers ──────────────────────────────────

/**
 * Find all satellites within communication range of a given satellite.
 */
export function findNearbySatellites(
  satId: string,
  allSats: SatelliteState[],
  range: number,
): SatelliteState[] {
  const origin = allSats.find((s) => s.config.id === satId);
  if (!origin) return [];

  return allSats.filter((s) => {
    if (s.config.id === satId) return false;
    return distanceBetween(origin.position, s.position) <= range;
  });
}

// ─── P2P Consensus Algorithm ────────────────────────────────

const PRIORITY_SCORES: Record<Priority, number> = {
  CRITICAL: 100,
  HIGH: 75,
  MEDIUM: 50,
  LOW: 25,
};

function evaluateCanManeuver(sat: SatelliteState): { canManeuver: boolean; reason: string } {
  if (sat.fuelPercent < 10) return { canManeuver: false, reason: 'Fuel critically low' };
  if (sat.config.thrusterCapacity < 20) return { canManeuver: false, reason: 'Thruster capacity insufficient' };
  if (sat.config.missionPriority === 'CRITICAL')
    return { canManeuver: false, reason: 'Mission-critical — cannot break station' };
  if (sat.isDrifting) return { canManeuver: false, reason: 'Already drifting — unstable trajectory' };
  return { canManeuver: true, reason: 'Operational — available for maneuver' };
}

function consensusScore(sat: SatelliteState): number {
  const priorityScore = PRIORITY_SCORES[sat.config.missionPriority];
  return (
    sat.fuelPercent * 0.3 +
    (100 - priorityScore) * 0.4 +
    sat.config.thrusterCapacity * 0.3
  );
}

/**
 * P2P consensus: given two satellites on a collision course, gather
 * nearby satellites, score them, and determine which one volunteers
 * to maneuver out of the way.
 */
export function runConsensus(
  collisionPair: [string, string],
  allSats: SatelliteState[],
): ConsensusResult {
  // 1. Gather nearby satellites (union of both collision members' neighborhoods)
  const nearbyA = findNearbySatellites(collisionPair[0], allSats, 3.0);
  const nearbyB = findNearbySatellites(collisionPair[1], allSats, 3.0);

  const participantMap = new Map<string, SatelliteState>();
  // Always include the two collision satellites
  for (const sat of allSats) {
    if (collisionPair.includes(sat.config.id)) {
      participantMap.set(sat.config.id, sat);
    }
  }
  for (const sat of [...nearbyA, ...nearbyB]) {
    participantMap.set(sat.config.id, sat);
  }

  const participants = Array.from(participantMap.values());

  // 2. Evaluate each participant
  const evaluations = participants.map((sat) => {
    const { canManeuver, reason } = evaluateCanManeuver(sat);
    return {
      id: sat.config.id,
      name: sat.config.name,
      canManeuver,
      reason,
      score: canManeuver ? consensusScore(sat) : -1,
    };
  });

  // 3. The satellite with the HIGHEST score volunteers
  const candidates = evaluations.filter((e) => e.canManeuver);
  candidates.sort((a, b) => b.score - a.score);

  const volunteer = candidates[0] ?? evaluations[0]; // fallback (should not happen)
  const volunteerSat = participantMap.get(volunteer.id)!;

  // 4. Build reason list
  const reasons: string[] = [];
  const pScore = PRIORITY_SCORES[volunteerSat.config.missionPriority];
  reasons.push(`Mission priority: ${volunteerSat.config.missionPriority} (score ${pScore})`);
  reasons.push(`Fuel reserves: ${volunteerSat.fuelPercent}%`);
  reasons.push(`Thruster capacity: ${volunteerSat.config.thrusterCapacity}%`);
  reasons.push(`Consensus score: ${volunteer.score.toFixed(1)} (highest among peers)`);

  // 5. Random consensus duration between 0.5 and 1.5 seconds
  const consensusDuration = parseFloat((0.5 + Math.random()).toFixed(2));

  // Estimated fuel cost for the maneuver (1-4%)
  const fuelCost = parseFloat((1 + Math.random() * 3).toFixed(1));

  // Confidence based on how many peers participated
  const confidencePercent = Math.min(99, 80 + participants.length * 2);

  return {
    volunteerId: volunteer.id,
    volunteerName: volunteerSat.config.name,
    volunteerIcon: volunteerSat.config.icon,
    fuelReserve: volunteerSat.fuelPercent,
    missionPriority: volunteerSat.config.missionPriority,
    distanceToHazard: 142,
    confidence: confidencePercent,
    fuelLoss: fuelCost,
    reason: reasons,
    reasons: reasons,
    participants: evaluations.map((e) => ({
      id: e.id,
      name: e.name,
      canManeuver: e.canManeuver,
      reason: e.reason,
    })),
    consensusDuration,
    fuelCost,
    confidencePercent,
  };
}

// ─── Consequence Calculation ────────────────────────────────

/**
 * Return the static consequence data for the "what if nobody moves" card.
 */
export function calculateConsequences(): {
  debrisFragments: number;
  endangeredSatellites: number;
  projectedLosses: string;
  communicationBlackout: string;
  affectedRegions: string;
} {
  return {
    debrisFragments: 427,
    endangeredSatellites: 19,
    projectedLosses: '$4.3 Billion',
    communicationBlackout: '12 minutes',
    affectedRegions: 'North Atlantic, Western Europe',
  };
}

// ─── Maneuver Calculation ───────────────────────────────────

/**
 * Calculate the avoidance maneuver parameters for a satellite
 * to dodge a collision with another satellite.
 */
export function calculateManeuver(
  sat: SatelliteState,
  targetSat: SatelliteState,
): {
  deltaV: number;
  fuelCost: number;
  newOrbitPhaseOffset: number;
  estimatedTime: number;
} {
  const dist = distanceBetween(sat.position, targetSat.position);

  // Delta-V proportional to how close and how fast they are
  const deltaV = parseFloat((0.5 + (SAFETY_THRESHOLD - Math.min(dist, SAFETY_THRESHOLD)) * 2).toFixed(3));

  // Fuel cost: 1-4% depending on maneuver intensity
  const fuelCost = parseFloat((1 + deltaV * 2).toFixed(1));

  // Phase offset to shift the satellite's orbit enough to clear the collision
  const newOrbitPhaseOffset = parseFloat((0.15 + Math.random() * 0.1).toFixed(3));

  // Estimated burn time in seconds
  const estimatedTime = parseFloat((3 + Math.random() * 2).toFixed(1));

  return { deltaV, fuelCost, newOrbitPhaseOffset, estimatedTime };
}
