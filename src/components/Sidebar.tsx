'use client';

import { motion } from 'framer-motion';
import {
  Satellite,
  AlertTriangle,
  Activity,
  Zap,
  Gauge,
  Brain,
  Shield,
  Sun,
  Trash2,
  Cpu,
  User,
  Radio,
  Sliders,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { useSwarmStore } from '../store/useSwarmStore';

const SCENARIOS = [
  { name: 'Normal Traffic', icon: Satellite, badge: 'NOMINAL' },
  { name: 'Heavy Traffic', icon: Activity, badge: 'DENSE ORBIT' },
  { name: 'Satellite Failure', icon: AlertTriangle, badge: 'NODE LOSS' },
  { name: 'Solar Storm', icon: Sun, badge: 'CME-2055' },
  { name: 'Space Debris', icon: Trash2, badge: 'KESSLER' },
] as const;

export default function Sidebar() {
  const satellites = useSwarmStore((s) => s.satellites);
  const activeCollision = useSwarmStore((s) => s.activeCollision);
  const triggerScenario = useSwarmStore((s) => s.triggerScenario);
  const hoveredId = useSwarmStore((s) => s.hoveredSatelliteId);
  const selectedId = useSwarmStore((s) => s.selectedSatelliteId);
  const setHoveredId = useSwarmStore((s) => s.setHoveredSatelliteId);
  const setSelectedId = useSwarmStore((s) => s.setSelectedSatelliteId);

  return (
    <aside
      className="w-[310px] h-full flex flex-col overflow-hidden shrink-0 bg-[#040914]/95 backdrop-blur-3xl border-r border-white/[0.08] font-mono text-white select-none"
    >
      {/* ── Sleek Minimalist Header ── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-white/[0.01]">
        <div className="flex items-center gap-2.5">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-white font-sans">
            Constellation Grid
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-300 border border-white/[0.1]">
          12 NODES
        </span>
      </div>

      {/* ── Constellation List (Open & Breathable) ── */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 custom-scrollbar">
        {satellites.map((sat) => {
          const isColliding =
            activeCollision &&
            (activeCollision.satellite1Id === sat.id ||
              activeCollision.satellite2Id === sat.id ||
              activeCollision.sat1Id === sat.id ||
              activeCollision.sat2Id === sat.id);
          const isHovered = hoveredId === sat.id;
          const isSelected = selectedId === sat.id;

          return (
            <div
              key={sat.id}
              onMouseEnter={() => setHoveredId(sat.id || null)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setSelectedId(sat.id || null)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                isColliding
                  ? 'bg-red-500/15 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                  : isSelected || isHovered
                  ? 'bg-white/[0.06] border border-white/20'
                  : 'bg-transparent border border-transparent hover:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-base shrink-0">{sat.icon || '🛰'}</span>
                <div className="min-w-0 flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold font-sans text-white truncate">
                      {sat.name}
                    </span>
                    {isColliding && (
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-500 truncate">
                    {sat.mission || 'LEO Constellation'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-bold text-zinc-600">PROP</span>
                  <span
                    className={`text-xs font-bold ${
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
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white transition-colors" />
              </div>
            </div>
          );
        })}

        {/* ── Active Collision Quorum (Minimalist Timeline Indicator) ── */}
        {activeCollision && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-red-500/[0.08] border-l-[3px] border-l-red-500 border-t border-r border-b border-red-500/20 my-3 space-y-2.5 font-mono"
          >
            <div className="flex items-center justify-between pb-2 border-b border-red-500/20 text-red-300 text-xs font-bold uppercase tracking-wider font-mono">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                <span>DSC Vector Check</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-200">
                &lt; 5.0 KM
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-white/[0.05]">
                <span className="font-bold text-white">🛰 Gaia Sentinel</span>
                <span className="text-cyan-300 font-mono font-bold">Score: 0.94 (Burn)</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="font-bold text-white">📦 Hermes Cargo</span>
                <span className="text-zinc-400 font-mono font-bold">Score: 0.18 (Lock)</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1 pt-1 text-center divide-x divide-white/[0.08]">
              <div className="px-1">
                <span className="text-[9px] text-zinc-500 block uppercase">Dist</span>
                <span className="text-xs font-bold text-white">4.8 km</span>
              </div>
              <div className="px-1">
                <span className="text-[9px] text-zinc-500 block uppercase">T-Minus</span>
                <span className="text-xs font-bold text-red-400 animate-pulse">17s</span>
              </div>
              <div className="px-1">
                <span className="text-[9px] text-zinc-500 block uppercase">Mesh</span>
                <span className="text-xs font-bold text-cyan-300">9/12 P2P</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* ── System Scenario Workbench (Open & Breathable) ── */}
      <div className="p-4 border-t border-white/[0.08] bg-[#020611]/90 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold font-sans uppercase tracking-wider text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Tactical Overrides</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-600">SIM LAB</span>
        </div>

        <div className="grid grid-cols-1 gap-1">
          {SCENARIOS.map((sc) => {
            const IconComp = sc.icon;
            return (
              <button
                key={sc.name}
                onClick={() => triggerScenario(sc.name)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/20 hover:bg-white/[0.05] text-zinc-300 hover:text-white transition-all text-xs font-mono group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <IconComp className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="font-sans font-medium">{sc.name}</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.05] text-zinc-400 group-hover:text-white border border-white/5 font-mono">
                  {sc.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
