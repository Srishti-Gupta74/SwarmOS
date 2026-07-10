'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Bomb, Satellite, DollarSign, Wifi, MapPin } from 'lucide-react';
import { useSwarmStore } from '../store/useSwarmStore';

const CONSEQUENCES = [
  {
    icon: Bomb,
    label: 'Collision',
    value: 'IMPACT',
    color: 'var(--red)',
    large: true,
  },
  {
    icon: Bomb,
    label: 'Debris Generated',
    value: '427 fragments',
    color: 'var(--red)',
    large: false,
  },
  {
    icon: Satellite,
    label: 'Satellites Endangered',
    value: '19 satellites',
    color: 'var(--amber)',
    large: false,
  },
  {
    icon: DollarSign,
    label: 'Projected Losses',
    value: '$4.3 Billion',
    color: 'var(--amber)',
    large: true,
  },
  {
    icon: Wifi,
    label: 'Communication Blackout',
    value: '12 min',
    color: 'var(--red)',
    large: false,
  },
  {
    icon: MapPin,
    label: 'Affected Regions',
    value: 'North Atlantic, Western Europe',
    color: 'var(--text-secondary)',
    large: false,
  },
];

export default function ConsequenceCard() {
  const showConsequences = useSwarmStore((s) => s.showConsequences);

  return (
    <AnimatePresence>
      {showConsequences && (
        <motion.div
          initial={{ opacity: 0, y: 80, x: 30, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="consequence-card absolute bottom-6 right-6 z-[200] w-[380px] max-w-[calc(100vw-2rem)] p-5"
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-5 h-5 text-[var(--red)]" />
            <h3
              className="text-sm font-bold tracking-[0.1em] uppercase text-[var(--red)]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              ⚠ Potential Consequences
            </h3>
          </div>
          <p
            className="text-[0.65rem] text-[var(--text-dim)] mb-4 tracking-wider uppercase"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            If no satellite maneuvers...
          </p>

          {/* Consequence items */}
          <div className="space-y-2.5">
            {CONSEQUENCES.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.35 }}
                className="flex items-center gap-3"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: `${item.color}15`,
                    border: `1px solid ${item.color}40`,
                  }}
                >
                  <item.icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[0.55rem] text-[var(--text-dim)] uppercase tracking-wider"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {item.label}
                  </p>
                  <p
                    className={`font-bold tracking-wide ${
                      item.large ? 'text-lg' : 'text-sm'
                    }`}
                    style={{
                      color: item.color,
                      fontFamily: 'var(--font-mono)',
                      textShadow: item.large
                        ? `0 0 20px ${item.color}40`
                        : 'none',
                    }}
                  >
                    {item.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-5 pt-3 border-t border-white/10"
          >
            <p
              className="text-sm font-bold tracking-wider"
              style={{
                color: 'var(--emerald)',
                fontFamily: 'var(--font-mono)',
                textShadow: '0 0 20px rgba(0, 230, 118, 0.3)',
              }}
            >
              SwarmOS prevents this.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
