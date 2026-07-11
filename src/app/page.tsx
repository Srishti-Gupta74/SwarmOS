'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useSwarmStore } from '../store/useSwarmStore';
import StoryMode from '../components/StoryMode';
import Sidebar from '../components/Sidebar';
import AIFeed from '../components/AIFeed';
import TopHUD from '../components/TopHUD';
import AIExplainCard from '../components/AIExplainCard';
import ConsequenceCard from '../components/ConsequenceCard';
import MissionComplete from '../components/MissionComplete';
import TimeControls from '../components/TimeControls';
import SwarmDecisionTimeline from '../components/SwarmDecisionTimeline';
import SatelliteInspector from '../components/SatelliteInspector';

// Dynamic import for R3F to avoid SSR issues
const OrbitalScene = dynamic(
  () => import('../components/three/OrbitalScene'),
  { ssr: false }
);

export default function Home() {
  const [showStory, setShowStory] = useState(true);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const phase = useSwarmStore((s) => s.phase);
  const isPaused = useSwarmStore((s) => s.isPaused);
  const simSpeed = useSwarmStore((s) => s.simSpeed);
  const showRedAlert = useSwarmStore((s) => s.showRedAlert);
  const initSatellites = useSwarmStore((s) => s.initSatellites);
  const updatePositions = useSwarmStore((s) => s.updatePositions);
  const tick = useSwarmStore((s) => s.tick);
  const startTimeline = useSwarmStore((s) => s.startTimeline);

  // Initialize satellites on mount
  useEffect(() => {
    initSatellites();
  }, [initSatellites]);

  // Main simulation loop
  const gameLoop = useCallback(
    (time: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = time;
      }

      const rawDt = (time - lastTimeRef.current) / 1000; // seconds
      lastTimeRef.current = time;

      if (!isPaused && !showStory && phase !== 'STORY' && phase !== 'MISSION_COMPLETE') {
        const dt = rawDt * simSpeed;
        tick(dt);
        const elapsed = useSwarmStore.getState().elapsedTime;
        updatePositions(elapsed);
      }

      animFrameRef.current = requestAnimationFrame(gameLoop);
    },
    [isPaused, showStory, phase, simSpeed, tick, updatePositions]
  );

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [gameLoop]);

  // Spacebar to pause/resume
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target === document.body || (e.target as HTMLElement)?.tagName !== 'INPUT')) {
        e.preventDefault();
        useSwarmStore.getState().togglePause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle story completion
  const handleStoryComplete = useCallback(() => {
    setShowStory(false);
    startTimeline();
  }, [startTimeline]);

  // Handle simulation restart (`Restart Simulation`)
  const handleRestart = useCallback(() => {
    initSatellites();
    useSwarmStore.setState({
      phase: 'STORY',
      elapsedTime: 0,
      nextTimelineStepIndex: 0,
      messages: [],
      activeCollision: null,
      consensusResult: null,
      showConsequences: false,
      showExplainCard: false,
      showRedAlert: false,
      selectedSatelliteId: null,
      hoveredSatelliteId: null,
      timelineStarted: false,
      autonomousDecisionsToday: 184921334,
      messagesPerSec: 0,
      networkHealth: 99.2,
    });
    setShowStory(true);
    lastTimeRef.current = 0;
  }, [initSatellites]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#030616]">
      {/* Story Mode Overlay */}
      {showStory && <StoryMode onComplete={handleStoryComplete} />}

      {/* Mission Complete Overlay (`Restart Simulation`) */}
      {phase === 'MISSION_COMPLETE' && <MissionComplete onRestart={handleRestart} />}

      {/* Red Alert Overlay */}
      {showRedAlert && <div className="red-alert-overlay" />}

      {/* Top HUD */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <TopHUD />
      </div>

      {/* Left Sidebar */}
      <div className="absolute top-[56px] left-0 bottom-0 z-20 w-[310px]">
        <Sidebar />
      </div>

      {/* Right Panel - AI Feed */}
      <div className="absolute top-[56px] right-0 bottom-0 z-20 w-[340px]">
        <AIFeed />
      </div>

      {/* Center - 3D Viewport */}
      <div className="absolute inset-0 z-10">
        <OrbitalScene />
      </div>

      {/* Floating Precision Cards (Each has internal `fixed` positioning with 100% collision-free layout) */}
      <AIExplainCard />
      <ConsequenceCard />
      <SwarmDecisionTimeline />
      <SatelliteInspector />

      {/* Time Controls (bottom-center) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
        <TimeControls />
      </div>
    </div>
  );
}
