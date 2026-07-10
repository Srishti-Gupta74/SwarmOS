'use client';

import { useSwarmStore } from '../store/useSwarmStore';
import { Brain, Network, MessageSquare, Clock, Cpu, ShieldAlert } from 'lucide-react';

export default function SwarmIntelligenceHUD() {
  const messages = useSwarmStore((s) => s.messages);
  const autonomousDecisionsToday = useSwarmStore((s) => s.autonomousDecisionsToday);
  const consensusResult = useSwarmStore((s) => s.consensusResult);
  const phase = useSwarmStore((s) => s.phase);

  const totalMessages = 28 + Math.max(0, messages.length - 2);
  const consensusTime = consensusResult?.consensusDuration ?? 0.82;

  return (
    <div className="glass-subtle rounded-xl p-3 border border-cyan-500/20 shadow-xl backdrop-blur-md bg-[#080d14]/90 w-[240px] pointer-events-auto">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
        <div className="flex items-center gap-1.5">
          <Brain className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-bold text-white tracking-wider uppercase font-mono">
            Swarm Intelligence
          </span>
        </div>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold uppercase">
          P2P Active
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between p-1.5 rounded bg-white/5">
          <span className="text-[11px] text-gray-400 flex items-center gap-1.5">
            <Network className="w-3.5 h-3.5 text-cyan-400" /> Nearby Nodes
          </span>
          <span className="font-extrabold text-cyan-300">6 Peers</span>
        </div>

        <div className="flex items-center justify-between p-1.5 rounded bg-white/5">
          <span className="text-[11px] text-gray-400 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-blue-400" /> Messages Exchanged
          </span>
          <span className="font-extrabold text-white">{totalMessages}</span>
        </div>

        <div className="flex items-center justify-between p-1.5 rounded bg-white/5">
          <span className="text-[11px] text-gray-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> Consensus Time
          </span>
          <span className="font-extrabold text-amber-400">{consensusTime} sec</span>
        </div>

        <div className="flex items-center justify-between p-1.5 rounded bg-white/5">
          <span className="text-[11px] text-gray-400 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" /> Autonomous Decisions
          </span>
          <span className="font-extrabold text-emerald-400">{autonomousDecisionsToday}</span>
        </div>

        <div className="flex items-center justify-between p-1.5 rounded bg-red-500/10 border border-red-500/20">
          <span className="text-[11px] text-red-300 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" /> Human Commands
          </span>
          <span className="font-extrabold text-red-400">0 (100% AI)</span>
        </div>
      </div>
    </div>
  );
}
