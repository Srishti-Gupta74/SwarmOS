'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Bomb, Satellite, DollarSign, Wifi, MapPin } from 'lucide-react';
import { useSwarmStore } from '../store/useSwarmStore';

const CONSEQUENCES = [
  {
    icon: Bomb,
    label: 'Collision Impact',
    value: 'KINETIC STRIKE',
    color: 'text-red-400 font-bold',
    badge: 'CRITICAL',
  },
  {
    icon: Bomb,
    label: 'Debris Generated',
    value: '427 fragments',
    color: 'text-amber-400',
  },
  {
    icon: Satellite,
    label: 'Nodes Endangered',
    value: '19 satellites',
    color: 'text-amber-400',
  },
  {
    icon: DollarSign,
    label: 'Projected Asset Losses',
    value: '$4.3 Billion',
    color: 'text-white font-black',
  },
  {
    icon: Wifi,
    label: 'Communication Blackout',
    value: '12 min duration',
    color: 'text-red-400',
  },
  {
    icon: MapPin,
    label: 'Affected Surface Sectors',
    value: 'North Atlantic / EU',
    color: 'text-zinc-300',
  },
];

export default function ConsequenceCard() {
  const showConsequences = useSwarmStore((s) => s.showConsequences);

  return (
    <AnimatePresence>
      {showConsequences && (
        <motion.div
          initial={{ opacity: 0, y: -15, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.96 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed top-[72px] left-[325px] z-[200] w-[340px] max-w-[calc(100vw-2rem)] p-4 sm:p-5 rounded-2xl border border-red-500/35 shadow-[0_20px_60px_rgba(0,0,0,0.95)] backdrop-blur-3xl bg-[#050b14]/96 font-mono text-white overflow-hidden pointer-events-auto"
        >
          {/* Subtle Top Red Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-14 bg-gradient-to-b from-red-500/15 to-transparent blur-xl pointer-events-none" />

          {/* Clean Minimalist Header */}
          <div className="relative z-10 flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-red-500/15 text-red-400 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-bold tracking-wider uppercase text-white font-sans">
                Potential Consequences
              </h3>
            </div>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 font-bold uppercase">
              Unmitigated
            </span>
          </div>

          <p className="relative z-10 text-[11px] text-zinc-400 mb-3 font-sans leading-normal">
            Simulation forecast without autonomous DSC mesh evasion:
          </p>

          {/* Open, Elegant Swiss-Engineered List (No Nested Box Clutter!) */}
          <div className="relative z-10 divide-y divide-white/[0.06] -my-1">
            {CONSEQUENCES.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i, duration: 0.25 }}
                className="py-2 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <item.icon className={`w-3.5 h-3.5 shrink-0 ${item.color}`} />
                  <span className="text-xs text-zinc-300 font-sans truncate">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`text-xs font-mono font-bold ${item.color}`}>
                    {item.value}
                  </span>
                  {item.badge && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-red-500/30 text-red-200 uppercase font-mono">
                      {item.badge}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
