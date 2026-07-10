'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useSwarmStore } from '../store/useSwarmStore';
import { Award, Flame, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function AIExplainCard() {
  const phase = useSwarmStore((s) => s.phase);
  const consensusResult = useSwarmStore((s) => s.consensusResult);

  // Apple Vision Pro / Tesla Mission Control principle:
  // ONLY show when relevant (CONSENSUS / VOLUNTEER / THRUSTER_BURN).
  // Immediately return null once resolved (COLLISION_AVOIDED / NORMAL_OPS) to keep screen calm.
  const isDecisionStep = phase === 'CONSENSUS' || phase === 'VOLUNTEER';
  const isBurnStep = phase === 'THRUSTER_BURN';

  if (!isDecisionStep && !isBurnStep) return null;
  if (!consensusResult) return null;

  return (
    <AnimatePresence mode="wait">
      {/* State 1: Temporary Explainability Card during Volunteer / Consensus */}
      {isDecisionStep && (
        <motion.div
          key="explain-card"
          initial={{ opacity: 0, y: 30, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.94 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-6 left-6 z-[200] w-[340px] max-w-[calc(100vw-2rem)] p-4 rounded-2xl border border-white/15 shadow-[0_10px_40px_rgba(0,0,0,0.7)] backdrop-blur-2xl bg-[#0a0f18]/90 font-mono text-white"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                {consensusResult.volunteerName ?? 'Gaia Sentinel'} Selected
              </span>
            </div>
            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
              P2P Selected
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            <div className="p-2 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-0.5">
              <span className="text-[10px] text-gray-400 uppercase">Fuel Reserve</span>
              <span className="font-extrabold text-emerald-400">91%</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-0.5">
              <span className="text-[10px] text-gray-400 uppercase">Mission Priority</span>
              <span className="font-extrabold text-cyan-300">Low</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-0.5">
              <span className="text-[10px] text-gray-400 uppercase">Required Burn</span>
              <span className="font-extrabold text-amber-300">0.42 m/s</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-0.5">
              <span className="text-[10px] text-gray-400 uppercase">Confidence</span>
              <span className="font-extrabold text-emerald-400">{consensusResult.confidence ?? 98}%</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2 text-xs text-gray-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase font-bold">Reason:</span>
              <span className="text-white leading-tight">Lowest mission impact across local neighborhood.</span>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-400">
            <span>Distributed Swarm Decision</span>
            <span className="text-cyan-400 font-bold">● Auto-dismissing</span>
          </div>
        </motion.div>
      )}

      {/* State 2: Small Floating Trajectory Adjustment Card during Maneuver */}
      {isBurnStep && (
        <motion.div
          key="maneuver-card"
          initial={{ opacity: 0, y: 30, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.94 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-6 left-6 z-[200] w-[300px] max-w-[calc(100vw-2rem)] p-4 rounded-2xl border border-amber-500/40 shadow-[0_10px_40px_rgba(245,158,11,0.2)] backdrop-blur-2xl bg-[#0a0f18]/95 font-mono text-white"
        >
          <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-3">
            <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Trajectory Adjustment
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
              <span className="text-gray-400 uppercase text-[11px]">ΔV</span>
              <strong className="text-white text-sm font-extrabold">0.42 m/s</strong>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
              <span className="text-gray-400 uppercase text-[11px]">Burn Duration</span>
              <strong className="text-amber-400 text-sm font-extrabold">2.1 sec</strong>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
              <span className="text-gray-400 uppercase text-[11px]">Orbit Shift</span>
              <strong className="text-emerald-400 text-sm font-extrabold">+0.18°</strong>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-white/10 text-center text-[10px] text-amber-400/80 animate-pulse font-bold">
            🔥 EXECUTING EVASION BURN...
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
