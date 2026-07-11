'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useSwarmStore } from '../store/useSwarmStore';
import { Award, Flame, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function AIExplainCard() {
  const phase = useSwarmStore((s) => s.phase);
  const consensusResult = useSwarmStore((s) => s.consensusResult);

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
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.96 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-6 left-[325px] z-[200] w-[340px] max-w-[calc(100vw-2rem)] p-4 sm:p-5 rounded-2xl border border-white/[0.12] shadow-[0_20px_60px_rgba(0,0,0,0.95)] backdrop-blur-3xl bg-[#050b14]/96 font-mono text-white pointer-events-auto"
        >
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-white font-sans">
                {consensusResult.volunteerName ?? 'Gaia Sentinel'} Selected
              </span>
            </div>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-white/[0.08] text-zinc-300 border border-white/[0.1] uppercase font-mono">
              P2P Selected
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col gap-0.5">
              <span className="text-[10px] text-zinc-400 uppercase font-sans">Fuel Reserve</span>
              <span className="font-bold text-white font-mono">91%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col gap-0.5">
              <span className="text-[10px] text-zinc-400 uppercase font-sans">Mission Priority</span>
              <span className="font-bold text-zinc-300 font-mono">Low</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col gap-0.5">
              <span className="text-[10px] text-zinc-400 uppercase font-sans">Required Burn</span>
              <span className="font-bold text-amber-400 font-mono">0.42 m/s</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col gap-0.5">
              <span className="text-[10px] text-zinc-400 uppercase font-sans">Confidence</span>
              <span className="font-bold text-white font-mono">{consensusResult.confidence ?? 98}%</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-start gap-2 text-xs text-zinc-300 font-sans">
            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-400 uppercase font-bold">Autonomous Decision:</span>
              <span className="text-white leading-tight">Lowest mission impact across local neighborhood mesh.</span>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-white/[0.08] flex items-center justify-between text-[10px] text-zinc-500 font-mono">
            <span>Distributed Swarm Mesh</span>
            <span className="text-blue-400 font-bold">● Auto-Dismissing</span>
          </div>
        </motion.div>
      )}

      {/* State 2: Small Floating Trajectory Adjustment Card during Maneuver */}
      {isBurnStep && (
        <motion.div
          key="maneuver-card"
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.96 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-6 left-[325px] z-[200] w-[320px] max-w-[calc(100vw-2rem)] p-4 sm:p-5 rounded-2xl border border-amber-500/40 shadow-[0_20px_60px_rgba(0,0,0,0.95)] backdrop-blur-3xl bg-[#050b14]/96 font-mono text-white pointer-events-auto"
        >
          <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2.5 mb-3">
            <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 font-sans">
              Trajectory Adjustment Burn
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-zinc-400 uppercase font-sans text-[11px]">ΔV Vector</span>
              <strong className="text-white text-sm font-bold font-mono">0.42 m/s</strong>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-zinc-400 uppercase font-sans text-[11px]">Burn Duration</span>
              <strong className="text-amber-400 text-sm font-bold font-mono">2.1 sec</strong>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-zinc-400 uppercase font-sans text-[11px]">Orbit Correction</span>
              <strong className="text-white text-sm font-bold font-mono">+0.18°</strong>
            </div>
          </div>

          <div className="mt-3.5 pt-2.5 border-t border-white/[0.08] text-center text-[10px] text-amber-400 animate-pulse font-bold tracking-wider uppercase font-mono">
            🔥 EXECUTING EVASION BURN...
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
