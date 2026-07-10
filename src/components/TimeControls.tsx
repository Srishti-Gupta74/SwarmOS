'use client';

import { motion } from 'framer-motion';
import { Play, Pause, FastForward } from 'lucide-react';
import { useSwarmStore } from '../store/useSwarmStore';

const SPEEDS = [1, 2, 5, 10] as const;

export default function TimeControls() {
  const isPaused = useSwarmStore((s) => s.isPaused);
  const simSpeed = useSwarmStore((s) => s.simSpeed);
  const togglePause = useSwarmStore((s) => s.togglePause);
  const setSimSpeed = useSwarmStore((s) => s.setSimSpeed);

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="absolute bottom-5 left-1/2 -translate-x-1/2 z-[100] glass rounded-full px-2 py-1.5 flex items-center gap-1"
    >
      {/* Play/Pause */}
      <button
        onClick={togglePause}
        className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
          hover:bg-white/[0.08] active:scale-95"
        style={{
          color: isPaused ? 'var(--amber)' : 'var(--cyan)',
        }}
        title={isPaused ? 'Resume' : 'Pause'}
      >
        {isPaused ? (
          <Play className="w-4 h-4" fill="currentColor" />
        ) : (
          <Pause className="w-4 h-4" fill="currentColor" />
        )}
      </button>

      {/* Divider */}
      <div className="w-[1px] h-5 bg-white/10 mx-1" />

      {/* Speed buttons */}
      {SPEEDS.map((speed) => {
        const isActive = simSpeed === speed;
        return (
          <button
            key={speed}
            onClick={() => setSimSpeed(speed)}
            className={`relative h-7 px-2.5 rounded-full flex items-center gap-1 transition-all duration-200
              text-[0.65rem] font-bold tracking-wider active:scale-95
              ${
                isActive
                  ? 'text-[var(--cyan)] bg-[var(--cyan)]/10'
                  : 'text-[var(--text-dim)] hover:text-[var(--text-secondary)] hover:bg-white/[0.05]'
              }`}
            style={{
              fontFamily: 'var(--font-mono)',
              boxShadow: isActive
                ? '0 0 12px rgba(0, 229, 255, 0.2), inset 0 0 8px rgba(0, 229, 255, 0.08)'
                : 'none',
            }}
          >
            {speed > 1 && <FastForward className="w-3 h-3" />}
            {speed}×
          </button>
        );
      })}
    </motion.div>
  );
}
