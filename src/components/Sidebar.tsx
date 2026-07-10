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
  Cloud,
  Bomb,
  Sun,
  Trash2,
  Cpu,
  User,
} from 'lucide-react';
import { useSwarmStore } from '../store/useSwarmStore';

const SCENARIOS = [
  { name: 'Normal Traffic', icon: Satellite, color: 'var(--cyan)' },
  { name: 'Heavy Traffic', icon: Activity, color: 'var(--amber)' },
  { name: 'Satellite Failure', icon: Bomb, color: 'var(--red)' },
  { name: 'Solar Storm', icon: Sun, color: 'var(--amber)' },
  { name: 'Space Debris', icon: Trash2, color: 'var(--red)' },
] as const;

export default function Sidebar() {
  const satellites = useSwarmStore((s) => s.satellites);
  const activeCollision = useSwarmStore((s) => s.activeCollision);
  const triggerScenario = useSwarmStore((s) => s.triggerScenario);
  const messages = useSwarmStore((s) => s.messages);
  const hoveredId = useSwarmStore((s) => s.hoveredSatelliteId);
  const selectedId = useSwarmStore((s) => s.selectedSatelliteId);
  const setHoveredId = useSwarmStore((s) => s.setHoveredSatelliteId);
  const setSelectedId = useSwarmStore((s) => s.setSelectedSatelliteId);

  const activeNegotiations = messages.filter(
    (m) => m.type === 'CONSENSUS' || (m.type as string).toLowerCase() === 'consensus'
  ).length;

  const getHealthColor = (sat: (typeof satellites)[0]) => {
    if (
      activeCollision &&
      (activeCollision.satellite1Id === sat.id || activeCollision.satellite2Id === sat.id || activeCollision.sat1Id === sat.id || activeCollision.sat2Id === sat.id)
    ) {
      return 'bg-[var(--red)] animate-pulse-danger';
    }
    if (sat.fuelPercent > 60) return 'bg-[var(--emerald)]';
    if (sat.fuelPercent > 30) return 'bg-[var(--amber)]';
    return 'bg-[var(--red)]';
  };

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="glass w-[280px] h-full flex flex-col overflow-hidden shrink-0"
      style={{ borderRight: '1px solid var(--border-glass)' }}
    >
      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--cyan)] to-[var(--blue)] flex items-center justify-center">
          <Cpu className="w-4 h-4 text-white" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight" style={{ fontFamily: 'var(--font-sans)' }}>
            Swarm<span className="text-[var(--cyan)]">OS</span>
          </span>
          <span className="badge badge-cyan text-[0.55rem] py-0.5 px-1.5">v2055.1</span>
        </div>
      </div>

      {/* ── Fleet Overview ── */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        <div className="flex items-center gap-2 mb-2 px-1">
          <Satellite className="w-3.5 h-3.5 text-[var(--text-dim)]" />
          <span
            className="text-[0.65rem] font-semibold tracking-[0.12em] uppercase text-[var(--text-dim)]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            Fleet Overview
          </span>
          <span className="text-[0.6rem] text-[var(--text-dim)] ml-auto" style={{ fontFamily: 'var(--font-mono)' }}>
            {satellites.length}
          </span>
        </div>

        <div className="space-y-0.5">
          {satellites.map((sat, i) => {
            const isColliding =
              activeCollision &&
              (activeCollision.satellite1Id === sat.id || activeCollision.satellite2Id === sat.id || activeCollision.sat1Id === sat.id || activeCollision.sat2Id === sat.id);
            const isHovered = hoveredId === sat.id;
            const isSelected = selectedId === sat.id;

            return (
              <motion.div
                key={sat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
                onMouseEnter={() => setHoveredId(sat.id || null)}
                onMouseLeave={() => {
                  if (useSwarmStore.getState().hoveredSatelliteId === sat.id) {
                    setHoveredId(null);
                  }
                }}
                onClick={() => setSelectedId(sat.id || null)}
                className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer group
                  ${isColliding ? 'bg-[var(--red)]/10 border border-[var(--red)]/30' : isSelected || isHovered ? 'bg-[var(--cyan)]/15 border border-[var(--cyan)]/40 shadow-[0_0_12px_rgba(0,229,255,0.15)]' : 'hover:bg-white/[0.03]'}`}
              >
                <span className="text-sm shrink-0">{sat.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[var(--text-primary)] truncate leading-tight">
                    {sat.name}
                  </p>
                  <p className="text-[0.6rem] text-[var(--text-dim)] truncate leading-tight">
                    {sat.mission}
                  </p>
                </div>
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${getHealthColor(sat)}`}
                  style={
                    isColliding
                      ? { boxShadow: '0 0 8px rgba(255, 51, 85, 0.6)' }
                      : {}
                  }
                />
              </motion.div>
            );
          })}
        </div>

        {/* ── Collision Alert ── */}
        {activeCollision && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="glass-danger rounded-xl p-3 mt-3 border border-[var(--red)]/60 shadow-[0_0_20px_rgba(255,51,85,0.25)]"
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-[var(--red)] animate-bounce" />
              <span
                className="text-[0.65rem] font-bold tracking-[0.1em] uppercase text-[var(--red)]"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Collision Prediction Module
              </span>
            </div>
            <div className="flex flex-col gap-1 text-xs text-white mb-2">
              <div className="flex items-center justify-between font-semibold bg-white/5 px-2 py-1 rounded">
                <span>🛰 Gaia Sentinel</span>
                <span className="text-[0.6rem] text-amber-300">Score: 0.94</span>
              </div>
              <div className="flex items-center justify-center text-[var(--red)] text-[0.65rem] font-bold">
                ✕ 5 KM DANGER RADIUS BREACH ✕
              </div>
              <div className="flex items-center justify-between font-semibold bg-white/5 px-2 py-1 rounded">
                <span>📦 Hermes Cargo</span>
                <span className="text-[0.6rem] text-[var(--red)]">Score: 0.18</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1 mt-2 pt-2 border-t border-white/10 text-center font-mono">
              <div className="bg-black/40 p-1 rounded">
                <span className="text-[9px] text-gray-400 block uppercase">Distance</span>
                <strong className="text-xs font-black text-amber-300">4.8 km</strong>
              </div>
              <div className="bg-black/40 p-1 rounded">
                <span className="text-[9px] text-gray-400 block uppercase">Time</span>
                <strong className="text-xs font-black text-cyan-300">17 sec</strong>
              </div>
              <div className="bg-black/40 p-1 rounded">
                <span className="text-[9px] text-gray-400 block uppercase">Risk</span>
                <strong className="text-xs font-black text-red-400">92%</strong>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Mission Intelligence ── */}
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2.5 px-1">
            <Brain className="w-3.5 h-3.5 text-[var(--text-dim)]" />
            <span
              className="text-[0.65rem] font-semibold tracking-[0.12em] uppercase text-[var(--text-dim)]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Mission Intelligence
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Network Stability', value: '99.2%', icon: Shield, color: 'var(--emerald)' },
              { label: 'Consensus Latency', value: '0.8 sec', icon: Gauge, color: 'var(--cyan)' },
              { label: 'Active Negotiations', value: String(activeNegotiations), icon: Activity, color: 'var(--purple)' },
              { label: 'Avg Fuel Cost', value: '1.3%', icon: Zap, color: 'var(--amber)' },
              { label: 'Auto Decisions', value: '184.9M', icon: Brain, color: 'var(--cyan)' },
              { label: 'Human Intervention', value: '0', icon: User, color: 'var(--emerald)' },
            ].map((metric) => (
              <div
                key={metric.label}
                className="glass-subtle rounded-lg p-2.5 flex flex-col gap-1"
              >
                <div className="flex items-center gap-1.5">
                  <metric.icon className="w-3 h-3" style={{ color: metric.color }} />
                  <span
                    className="text-[0.55rem] text-[var(--text-dim)] uppercase tracking-wider leading-tight"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {metric.label}
                  </span>
                </div>
                <span
                  className="text-sm font-bold"
                  style={{ color: metric.color, fontFamily: 'var(--font-mono)' }}
                >
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Orbital Scenarios ── */}
        <div className="mt-4 mb-2">
          <div className="flex items-center gap-2 mb-2.5 px-1">
            <Cloud className="w-3.5 h-3.5 text-[var(--text-dim)]" />
            <span
              className="text-[0.65rem] font-semibold tracking-[0.12em] uppercase text-[var(--text-dim)]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Orbital Scenarios
            </span>
          </div>

          <div className="space-y-1">
            {SCENARIOS.map((scenario) => (
              <button
                key={scenario.name}
                onClick={() => triggerScenario(scenario.name)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg glass-subtle
                  text-xs font-medium text-[var(--text-secondary)]
                  hover:text-[var(--text-primary)] hover:border-[rgba(80,140,255,0.25)]
                  transition-all duration-200 group text-left"
              >
                <scenario.icon
                  className="w-3.5 h-3.5 transition-colors duration-200"
                  style={{ color: 'var(--text-dim)' }}
                />
                <span className="group-hover:text-white transition-colors">{scenario.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
