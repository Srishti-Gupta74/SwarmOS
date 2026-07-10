'use client';

import { useSwarmStore } from '../store/useSwarmStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Radio, Network, Brain, Award, Flame, CheckCircle2 } from 'lucide-react';

export default function SwarmDecisionTimeline() {
  const phase = useSwarmStore((s) => s.phase);

  // Apple Vision Pro / Tesla Mission Control principle:
  // Return null when in normal ops or after anomaly resolution so the UI breathes and stays clean.
  const isAnomalyActive =
    phase === 'COLLISION_DETECTED' ||
    phase === 'COMMUNICATION' ||
    phase === 'CONSENSUS' ||
    phase === 'VOLUNTEER' ||
    phase === 'THRUSTER_BURN';

  if (!isAnomalyActive) return null;

  const steps = [
    { id: 'COLLISION_DETECTED', label: 'Collision Predicted', sub: 'T-17s | Dist: 4.8 km', icon: Radio, color: 'text-red-400', border: 'border-red-500/40', bg: 'bg-red-500/15' },
    { id: 'COMMUNICATION', label: 'P2P Telemetry Exchange', sub: 'Nearby nodes syncing', icon: Network, color: 'text-cyan-400', border: 'border-cyan-500/40', bg: 'bg-cyan-500/15' },
    { id: 'CONSENSUS', label: 'Consensus In Progress', sub: 'Evaluating 6 candidates', icon: Brain, color: 'text-purple-400', border: 'border-purple-500/40', bg: 'bg-purple-500/15' },
    { id: 'VOLUNTEER', label: 'Gaia Sentinel Selected', sub: 'Score: 0.94 vs Hermes 0.18', icon: Award, color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-500/15' },
    { id: 'THRUSTER_BURN', label: 'Thrusters Firing', sub: 'ΔV 0.42 m/s | Burn 2.1s', icon: Flame, color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-500/20' },
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
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -15, scale: 0.95 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-2 pointer-events-auto"
      >
        {/* Apple Vision Pro Glass Floating Capsule */}
        <div className="glass px-5 py-2.5 rounded-full border border-white/15 shadow-[0_0_30px_rgba(0,0,0,0.65)] backdrop-blur-xl bg-[#080d14]/85 flex items-center gap-4">
          <div className="flex items-center gap-2 pr-3 border-r border-white/10">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_var(--cyan)]" />
            <span className="text-[10px] font-mono font-extrabold tracking-widest text-gray-300 uppercase flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" /> P2P Swarm Mode
            </span>
          </div>

          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2.5"
          >
            <div className={`p-1.5 rounded-full ${current.bg} ${current.border} border`}>
              <Icon className={`w-4 h-4 ${current.color} ${activeIndex === 4 ? 'animate-bounce' : ''}`} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-white leading-tight">
                {current.label}
              </span>
              <span className={`text-[10px] font-mono ${current.color} leading-none mt-0.5`}>
                {current.sub}
              </span>
            </div>
          </motion.div>

          {/* Mini step dots */}
          <div className="flex items-center gap-1.5 pl-3 border-l border-white/10">
            {steps.map((s, idx) => (
              <div
                key={s.id}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  idx === activeIndex
                    ? 'w-3 bg-cyan-400 shadow-[0_0_6px_var(--cyan)]'
                    : idx < activeIndex
                    ? 'bg-emerald-400'
                    : 'bg-white/15'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
