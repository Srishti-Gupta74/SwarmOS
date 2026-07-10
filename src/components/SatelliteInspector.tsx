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
  ShieldAlert,
  Send,
  Sparkles,
  Navigation
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
      content: `${satName} transmitting high-frequency P2P diagnostic ping across local neighborhood. Latency: 12ms.`,
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
      content: `⚡ Diagnostic thruster pulse executed on ${satName} (ΔV: 0.05 m/s). Vector holding nominal.`,
      type: 'ALERT',
      isDanger: false,
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        key={sat.id}
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-6 right-6 z-[300] w-[360px] max-w-[calc(100vw-2rem)] p-5 rounded-3xl border border-cyan-500/35 shadow-[0_12px_45px_rgba(0,0,0,0.8)] backdrop-blur-3xl bg-[#060c18]/92 font-mono text-white overflow-hidden pointer-events-auto"
      >
        {/* Ambient header glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-24 bg-gradient-to-b from-cyan-500/20 via-transparent to-transparent pointer-events-none" />

        {/* Header Bar */}
        <div className="relative z-10 flex items-center justify-between pb-3.5 mb-3.5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(0,229,255,0.2)]">
              {satIcon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-sans font-extrabold tracking-tight text-white leading-none">
                  {satName}
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_var(--emerald)]" />
              </div>
              <p className="text-[11px] text-cyan-300 font-bold mt-1 uppercase tracking-wider">
                {satMission}
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedId(null)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Vector & Physics Grid */}
        <div className="relative z-10 grid grid-cols-2 gap-2.5 mb-4">
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-0.5">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Navigation className="w-3 h-3 text-cyan-400" /> Orbital Vel
            </span>
            <span className="text-sm font-black text-cyan-300">7.64 km/s</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-0.5">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-400" /> Altitude
            </span>
            <span className="text-sm font-black text-emerald-300">1,240 km</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-0.5">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Radio className="w-3 h-3 text-purple-400" /> P2P Mesh Ping
            </span>
            <span className="text-sm font-black text-purple-300">14 ms (Active)</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-0.5">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" /> Array Output
            </span>
            <span className="text-sm font-black text-amber-300">2,450 W</span>
          </div>
        </div>

        {/* Fuel Progress Bar */}
        <div className="relative z-10 p-3 rounded-2xl bg-white/5 border border-white/10 mb-4">
          <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
            <span className="text-gray-400 uppercase flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> Propellant Reserve
            </span>
            <span className={sat.fuelPercent > 50 ? 'text-emerald-400' : sat.fuelPercent > 25 ? 'text-amber-400' : 'text-red-400'}>
              {Math.round(sat.fuelPercent)}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-black/50 overflow-hidden border border-white/10">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                sat.fuelPercent > 50
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-[0_0_10px_var(--emerald)]'
                  : sat.fuelPercent > 25
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                  : 'bg-gradient-to-r from-red-600 to-pink-500'
              }`}
              style={{ width: `${Math.round(sat.fuelPercent)}%` }}
            />
          </div>
        </div>

        {/* Interactive Command Buttons */}
        <div className="relative z-10 space-y-2">
          <button
            onClick={handleBroadcastPing}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/35 text-cyan-300 font-bold text-xs uppercase tracking-wider transition-all transform active:scale-98 shadow-[0_0_15px_rgba(0,229,255,0.15)] hover:shadow-[0_0_20px_rgba(0,229,255,0.25)]"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Broadcast P2P Ping</span>
          </button>

          <button
            onClick={handleDiagnosticBurn}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 text-amber-300 font-bold text-xs uppercase tracking-wider transition-all transform active:scale-98 shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:shadow-[0_0_20px_rgba(245,158,11,0.25)]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Execute Evasion Pulse Test</span>
          </button>
        </div>

        <div className="relative z-10 mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-400">
          <span>SwarmOS Spatial Telemetry</span>
          <span className="text-cyan-400 font-bold">● Live Sync</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
