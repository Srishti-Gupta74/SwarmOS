'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwarmStore } from '../store/useSwarmStore';
import {
  Satellite,
  Activity,
  Zap,
  Radio,
  X,
  Flame,
  Navigation,
  Send,
  Terminal,
  Cpu
} from 'lucide-react';

export default function SatelliteInspector() {
  const selectedId = useSwarmStore((s) => s.selectedSatelliteId);
  const setSelectedId = useSwarmStore((s) => s.setSelectedSatelliteId);
  const satellites = useSwarmStore((s) => s.satellites);
  const addMessage = useSwarmStore((s) => s.addMessage);

  const sat = satellites.find((s) => s.id === selectedId);

  if (!selectedId || !sat) return null;

  const satId = sat.id || sat.config?.id || 'gaia';
  const satName = sat.name || sat.config?.name || 'Gaia Sentinel';
  const satMission = sat.mission || sat.config?.mission || 'Autonomous Node';
  const satIcon = sat.icon || sat.config?.icon || '🛰';

  const handleBroadcastPing = () => {
    addMessage({
      fromId: satId,
      fromName: satName,
      toId: 'all',
      toName: 'Local Mesh',
      content: `[DIAGNOSTIC_PING] ${satName} optical laser handshake complete with 11 neighborhood nodes. Round-trip ISL latency: 14.2ms.`,
      type: 'DIRECT',
      isDanger: false,
    });
  };

  const handleDiagnosticBurn = () => {
    addMessage({
      fromId: satId,
      fromName: satName,
      toId: 'all',
      toName: 'Local Mesh',
      content: `[THRUSTER_TEST] ${satName} fired cold-gas diagnostic attitude pulse (ΔV: 0.04 m/s). Kinetic trajectory vector holding 100% nominal.`,
      type: 'ALERT',
      isDanger: false,
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        key={sat.id}
        initial={{ opacity: 0, scale: 0.96, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-6 right-[360px] z-[300] w-[360px] max-w-[calc(100vw-2rem)] p-5 rounded-2xl border border-white/[0.1] shadow-[0_20px_70px_rgba(0,0,0,0.95)] backdrop-blur-3xl bg-[#050b14]/96 font-mono text-white overflow-hidden pointer-events-auto"
      >
        {/* Top subtle silver/blue reflection */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-20 bg-gradient-to-b from-blue-500/10 to-transparent blur-2xl pointer-events-none" />

        {/* ── Inspector Header Bar ── */}
        <div className="relative z-10 flex items-center justify-between pb-3.5 mb-3.5 border-b border-white/[0.08]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.12] flex items-center justify-center text-xl shrink-0">
              {satIcon}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-sans font-black tracking-tight text-white truncate">
                  {satName}
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              </div>
              <p className="text-[10px] text-zinc-400 font-bold mt-0.5 uppercase tracking-wider font-mono truncate">
                {satMission}
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedId(null)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Precision Engineering Grid (Monochromatic & Serious) ── */}
        <div className="relative z-10 grid grid-cols-2 gap-2 mb-4 text-xs">
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col gap-0.5">
            <span className="text-[9px] text-zinc-400 uppercase tracking-wider flex items-center gap-1 font-sans">
              <Navigation className="w-3 h-3 text-zinc-400" /> Velocity
            </span>
            <span className="text-sm font-bold text-white">7.64 <span className="text-[10px] text-zinc-400 font-normal">km/s</span></span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col gap-0.5">
            <span className="text-[9px] text-zinc-400 uppercase tracking-wider flex items-center gap-1 font-sans">
              <Activity className="w-3 h-3 text-zinc-400" /> Orbital Alt
            </span>
            <span className="text-sm font-bold text-white">1,240 <span className="text-[10px] text-zinc-400 font-normal">km</span></span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col gap-0.5">
            <span className="text-[9px] text-zinc-400 uppercase tracking-wider flex items-center gap-1 font-sans">
              <Radio className="w-3 h-3 text-zinc-400" /> Optical Ping
            </span>
            <span className="text-sm font-bold text-white">14.2 <span className="text-[10px] text-zinc-400 font-normal">ms</span></span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col gap-0.5">
            <span className="text-[9px] text-zinc-400 uppercase tracking-wider flex items-center gap-1 font-sans">
              <Zap className="w-3 h-3 text-zinc-400" /> Laser Output
            </span>
            <span className="text-sm font-bold text-white">2,450 <span className="text-[10px] text-zinc-400 font-normal">W</span></span>
          </div>
        </div>

        {/* ── Hydrazine Propellant Reserve Gauge ── */}
        <div className="relative z-10 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-4 font-mono">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-zinc-400 uppercase font-sans font-bold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-zinc-400" /> Hydrazine Reserve
            </span>
            <span
              className={`font-bold ${
                sat.fuelPercent > 50
                  ? 'text-white'
                  : sat.fuelPercent > 25
                  ? 'text-amber-400'
                  : 'text-red-400'
              }`}
            >
              {Math.round(sat.fuelPercent)}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-black/60 overflow-hidden border border-white/10">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                sat.fuelPercent > 50
                  ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)]'
                  : sat.fuelPercent > 25
                  ? 'bg-amber-400'
                  : 'bg-red-500'
              }`}
              style={{ width: `${Math.round(sat.fuelPercent)}%` }}
            />
          </div>
        </div>

        {/* ── Action Workbench Buttons (Cohesive Monochromatic / Blue Accent) ── */}
        <div className="relative z-10 space-y-2">
          <button
            onClick={handleBroadcastPing}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.12] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer font-sans"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse text-blue-400" />
            <span>Transmit P2P Optical Ping</span>
          </button>

          <button
            onClick={handleDiagnosticBurn}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] text-zinc-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer font-sans"
          >
            <Zap className="w-3.5 h-3.5 text-zinc-400" />
            <span>Test Evasion Thruster Pulse</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
