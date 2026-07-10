'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, CheckCircle2, ShieldCheck, Cpu, Flame, Sparkles } from 'lucide-react';

interface MissionCompleteProps {
  onRestart?: () => void;
}

export default function MissionComplete({ onRestart }: MissionCompleteProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // phase 0: immediate modal mount
    // phase 1: stats grid (0.6s)
    // phase 2: narrative highlights (1.4s)
    // phase 3: closing quote & restart button (2.4s)
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1400),
      setTimeout(() => setPhase(3), 2400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const stats = [
    { label: 'Consensus Time', value: '0.81s', icon: Cpu, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
    { label: 'Fuel Saved', value: '31%', icon: Flame, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Human Intervention', value: '0', icon: ShieldCheck, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Orbital Status', value: 'RESTORED', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#030711]/70 backdrop-blur-md pointer-events-auto"
    >
      {/* Apple Vision Pro + Tesla Mission Control Premium Glass Modal */}
      <motion.div
        initial={{ scale: 0.92, y: 25, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-2xl bg-[#080e1a]/95 backdrop-blur-3xl border border-cyan-500/30 rounded-3xl p-7 md:p-9 shadow-[0_0_80px_rgba(0,229,255,0.22)] font-mono text-white overflow-hidden flex flex-col items-center text-center"
      >
        {/* Subtle top ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-emerald-500/15 via-cyan-500/10 to-transparent blur-2xl pointer-events-none" />

        {/* Status Header */}
        <div className="relative z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-xs font-extrabold uppercase tracking-widest mb-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Mission Status: Nominal</span>
        </div>

        {/* Hero Title */}
        <h1 className="relative z-10 text-4xl md:text-5xl font-sans font-extrabold tracking-tight text-white mb-6 drop-shadow-[0_4px_20px_rgba(16,185,129,0.4)]">
          Collision <span className="text-emerald-400">Avoided</span>
        </h1>

        {/* Phase 1: 4-Stat Grid */}
        {phase >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mb-7"
          >
            {stats.map((stat, idx) => {
              const IconComp = stat.icon;
              return (
                <div
                  key={stat.label}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border ${stat.bg} backdrop-blur-lg transition-all`}
                >
                  <IconComp className={`w-5 h-5 ${stat.color} mb-1.5`} />
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">
                    {stat.label}
                  </span>
                  <span className={`text-lg font-black tracking-tight ${stat.color}`}>
                    {stat.value}
                  </span>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Phase 2: Clean Narrative Box */}
        {phase >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-5 mb-7 text-left space-y-3 shadow-inner"
          >
            <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-cyan-300 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Distributed Swarm Intelligence Proof</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm">
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-1.5 shadow-[0_0_6px_var(--emerald)]" />
                <p className="text-gray-300 leading-relaxed">
                  <strong className="text-white">Today:</strong> 12 satellites cooperated autonomously over P2P laser links.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-1.5 shadow-[0_0_6px_var(--cyan)]" />
                <p className="text-gray-300 leading-relaxed">
                  <strong className="text-white">Tomorrow:</strong> 2,842,198 nodes will coordinate without a central bottleneck.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1.5 shadow-[0_0_6px_var(--amber)]" />
                <p className="text-gray-300 leading-relaxed">
                  <strong className="text-white">Zero Commands:</strong> No Mission Control intervention. No headquarters required.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0 mt-1.5 shadow-[0_0_6px_var(--purple)]" />
                <p className="text-gray-300 leading-relaxed">
                  <strong className="text-white">Collective AI:</strong> The intelligence belongs entirely to the swarm group.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Phase 3: Closing Quote & Action Buttons */}
        {phase >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-white/10"
          >
            <div className="text-left">
              <p className="text-sm md:text-base font-sans font-bold italic text-gray-200">
                &ldquo;The future won&apos;t be controlled. It will cooperate.&rdquo;
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-mono font-black text-white tracking-widest uppercase">SwarmOS</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-extrabold border border-cyan-500/30">2055</span>
              </div>
            </div>

            {onRestart && (
              <button
                onClick={onRestart}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold font-mono tracking-wider uppercase shadow-[0_0_25px_rgba(0,229,255,0.4)] hover:shadow-[0_0_35px_rgba(0,229,255,0.6)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restart Demo</span>
              </button>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
