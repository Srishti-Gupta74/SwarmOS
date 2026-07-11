'use client';

import { useSwarmStore } from '../store/useSwarmStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Radio, Network, Brain, Award, Flame } from 'lucide-react';

export default function SwarmDecisionTimeline() {
  const phase = useSwarmStore((s) => s.phase);

  const isAnomalyActive =
    phase === 'COLLISION_DETECTED' ||
    phase === 'COMMUNICATION' ||
    phase === 'CONSENSUS' ||
    phase === 'VOLUNTEER' ||
    phase === 'THRUSTER_BURN';

  if (!isAnomalyActive) return null;

  const steps = [
    { id: 'COLLISION_DETECTED', label: 'Collision Predicted', sub: 'T-17s • Dist: 4.8 km', icon: Radio, color: 'text-amber-300 font-bold', border: 'border-amber-500/40', bg: 'bg-amber-500/15' },
    { id: 'COMMUNICATION', label: 'P2P Telemetry Exchange', sub: 'Nearby nodes syncing', icon: Network, color: 'text-blue-300 font-bold', border: 'border-blue-500/40', bg: 'bg-blue-500/15' },
    { id: 'CONSENSUS', label: 'Consensus In Progress', sub: 'Evaluating 6 candidates', icon: Brain, color: 'text-white font-bold', border: 'border-white/30', bg: 'bg-white/10' },
    { id: 'VOLUNTEER', label: 'Gaia Sentinel Selected', sub: 'Score: 0.94 vs Hermes 0.18', icon: Award, color: 'text-blue-300 font-bold', border: 'border-blue-500/40', bg: 'bg-blue-500/15' },
    { id: 'THRUSTER_BURN', label: 'Thrusters Firing', sub: 'ΔV 0.42 m/s • Burn 2.1s', icon: Flame, color: 'text-white font-black', border: 'border-white/40', bg: 'bg-white/15' },
  ];

  let activeIndex = 0;
  if (phase === 'COMMUNICATION') activeIndex = 1;
  else if (phase === 'CONSENSUS') activeIndex = 2;
  else if (phase === 'VOLUNTEER') activeIndex = 3;
  else if (phase === 'THRUSTER_BURN') activeIndex = 4;

  const current = steps[activeIndex];
  const Icon = current.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -15, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.96 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed top-[66px] left-1/2 -translate-x-1/2 z-[300] flex flex-col items-center pointer-events-auto max-w-[calc(100vw-2rem)]"
      >
        {/* Carbon Obsidian & Arctic White Floating Capsule */}
        <div className="px-5 py-2.5 rounded-full border border-white/[0.12] shadow-[0_15px_40px_rgba(0,0,0,0.85)] backdrop-blur-2xl bg-[#050b14]/96 flex items-center gap-4 font-mono text-white">
          <div className="flex items-center gap-2 pr-3 border-r border-white/[0.08]">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest text-zinc-300 uppercase flex items-center gap-1.5 font-sans">
              <Cpu className="w-3.5 h-3.5 text-blue-400" /> Autonomous Mesh
            </span>
          </div>

          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2.5"
          >
            <div className={`p-1.5 rounded-full ${current.bg} ${current.border} border shrink-0`}>
              <Icon className={`w-3.5 h-3.5 ${current.color}`} />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold font-sans uppercase tracking-wide text-white leading-tight">
                {current.label}
              </span>
              <span className={`text-[10px] font-mono ${current.color} leading-none mt-0.5`}>
                {current.sub}
              </span>
            </div>
          </motion.div>

          {/* Clean Monochrome Step Indicators */}
          <div className="flex items-center gap-1.5 pl-3 border-l border-white/[0.08]">
            {steps.map((s, idx) => (
              <div
                key={s.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === activeIndex
                    ? 'w-4 bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]'
                    : idx < activeIndex
                    ? 'w-1.5 bg-blue-400'
                    : 'w-1.5 bg-white/[0.12]'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
