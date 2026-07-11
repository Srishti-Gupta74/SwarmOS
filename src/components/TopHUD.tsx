'use client';

import { useState, useEffect } from 'react';
import { Globe, Cpu, Radio, Activity, ShieldCheck, Clock } from 'lucide-react';
import { useSwarmStore } from '../store/useSwarmStore';

function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

export default function TopHUD() {
  const autonomousDecisions = useSwarmStore((s) => s.autonomousDecisionsToday || (s as any).autonomousDecisions || 184921334);
  const messagesPerSec = useSwarmStore((s) => s.messagesPerSec);
  const activeCollision = useSwarmStore((s) => s.activeCollision);

  const [utcTime, setUtcTime] = useState('--:--:--');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setUtcTime(now.toISOString().slice(11, 19));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      className="w-full h-14 shrink-0 flex items-center justify-between px-5 z-50 relative bg-[#050b14]/95 backdrop-blur-2xl border-b border-white/[0.08] font-mono text-white select-none"
    >
      {/* ── Left: Command Deck Identification & UTC Clock ── */}
      <div className="flex items-center gap-5 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.12] flex items-center justify-center text-white">
            <Globe className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-widest uppercase text-white font-sans">
                SWARM<span className="text-blue-400">OS</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/[0.08] text-zinc-300 border border-white/[0.1] font-mono">
                v2055.1
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">
              Autonomous LEO Constellation
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-zinc-300 font-mono">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-bold text-white">{utcTime} UTC</span>
          <span className="text-zinc-600">•</span>
          <span className="text-[11px] text-zinc-400 uppercase">Sector: Orbital Zero</span>
        </div>
      </div>

      {/* ── Center: Clean Status Indicator (No Double-Stacked Overlapping Pills!) ── */}
      <div className="hidden md:flex items-center justify-center">
        {activeCollision ? (
          <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider font-mono">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>MESH ANOMALY DETECTED • AUTONOMOUS EVASION IN PROGRESS</span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-zinc-300 text-xs font-bold uppercase tracking-widest font-mono">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span>MESH STATUS: 14MS OPTICAL ISL • ALL NODES NOMINAL</span>
          </div>
        )}
      </div>

      {/* ── Right: Cohesive Monochrome Metrics ── */}
      <div className="flex items-center gap-5 lg:gap-6 shrink-0 text-xs font-mono">
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider flex items-center gap-1">
            <Cpu className="w-3 h-3 text-zinc-400" /> Active Nodes
          </span>
          <span className="text-sm font-bold text-white">12 Constellation</span>
        </div>

        <div className="h-6 w-[1px] bg-white/[0.08]" />

        <div className="flex flex-col items-end">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider flex items-center gap-1">
            <Radio className="w-3 h-3 text-zinc-400" /> Swarm Latency
          </span>
          <span className="text-sm font-bold text-white">14.2 <span className="text-[10px] text-zinc-400 font-normal">ms</span></span>
        </div>

        <div className="h-6 w-[1px] bg-white/[0.08] hidden xl:block" />

        <div className="hidden xl:flex flex-col items-end">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-zinc-400" /> Auto-Evasions
          </span>
          <span className="text-sm font-bold text-white">
            {formatNumber(autonomousDecisions)}
          </span>
        </div>

        <div className="h-6 w-[1px] bg-white/[0.08]" />

        <div className="flex flex-col items-end">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider flex items-center gap-1">
            <Activity className="w-3 h-3 text-zinc-400" /> Throughput
          </span>
          <span className="text-sm font-bold text-white">
            {formatNumber(messagesPerSec)} <span className="text-[10px] font-normal text-zinc-400">Msg/s</span>
          </span>
        </div>
      </div>
    </header>
  );
}
