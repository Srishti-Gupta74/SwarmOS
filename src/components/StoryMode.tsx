'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StoryModeProps {
  onComplete: () => void;
}

export default function StoryMode({ onComplete }: StoryModeProps) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const sequence = [
      { delay: 1000, action: () => setStep(1) },
      { delay: 3200, action: () => setStep(2) },
      { delay: 5400, action: () => setStep(3) },
      { delay: 7600, action: () => setStep(4) },
      { delay: 9800, action: () => setStep(5) },
      { delay: 11500, action: () => setStep(6) },
      { delay: 15200, action: () => setStep(7) },
      { delay: 16800, action: () => setStep(8) },
      { delay: 20000, action: () => onComplete() },
    ];

    const timers = sequence.map((s) => setTimeout(s.action, s.delay));
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  // Progress bar animation
  useEffect(() => {
    if (step < 6) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 4;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [step]);

  const textFade: any = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 1.2, ease: 'easeOut' },
  };

  return (
    <AnimatePresence>
      {step < 9 ? (
        <motion.div
          key="story-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-[#030712] flex items-center justify-center select-none cursor-pointer"
          onClick={onComplete}
        >
          {/* Skip prompt */}
          <button
            onClick={onComplete}
            className="absolute top-6 right-6 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.12] text-zinc-400 hover:text-white text-xs font-mono font-bold tracking-widest uppercase transition-all cursor-pointer"
          >
            Skip Intro →
          </button>

          <div className="flex flex-col items-center justify-center text-center px-6 max-w-2xl font-mono">
            {step >= 1 && (
              <motion.p
                {...textFade}
                className="text-xs text-zinc-400 font-bold uppercase tracking-[0.25em]"
              >
                Year 2055
              </motion.p>
            )}

            {step >= 2 && (
              <motion.h1
                {...textFade}
                className="text-3xl md:text-5xl font-sans font-black text-white tracking-tight mt-3 leading-tight"
              >
                Low-Earth Orbit is at Capacity
              </motion.h1>
            )}

            {step >= 3 && (
              <motion.p
                {...textFade}
                className="text-sm text-zinc-400 mt-4 tracking-[0.15em]"
              >
                2,842,198 Autonomous Orbital Objects
              </motion.p>
            )}

            {step >= 4 && (
              <motion.p
                {...textFade}
                className="text-sm text-red-400 font-bold mt-1 tracking-[0.15em]"
              >
                No Central Mission Control
              </motion.p>
            )}

            {step >= 5 && step < 7 && (
              <motion.div
                {...textFade}
                className="flex items-center gap-2 mt-8"
              >
                <span className="text-sm text-blue-400 font-bold tracking-[0.12em]">
                  Initializing SwarmOS Kernel...
                </span>
                <span className="inline-block w-[2px] h-4 bg-blue-400 animate-pulse" />
              </motion.div>
            )}

            {step >= 6 && step < 8 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="mt-4 w-64"
              >
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden border border-white/10">
                  <motion.div
                    className="h-full rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-right text-xs mt-1 text-zinc-400 font-mono">
                  {progress}%
                </p>
              </motion.div>
            )}

            {step >= 7 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.0, ease: 'easeOut' }}
                className="mt-10"
              >
                <h2 className="text-5xl md:text-6xl font-bold font-sans text-white tracking-tight">
                  Swarm<span className="text-blue-400">OS</span>
                </h2>
              </motion.div>
            )}

            {step >= 8 && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, delay: 0.3 }}
                className="text-base md:text-lg text-zinc-300 font-sans font-medium mt-3 max-w-md"
              >
                The Operating System for Autonomous Space Infrastructure
              </motion.p>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="fadeout"
          className="fixed inset-0 z-[9999] bg-[#030712]"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.0 }}
        />
      )}
    </AnimatePresence>
  );
}
