'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StoryModeProps {
  onComplete: () => void;
}

export default function StoryMode({ onComplete }: StoryModeProps) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  const advance = useCallback(() => {
    setStep((s) => s + 1);
  }, []);

  // Step sequencing with timeouts
  useEffect(() => {
    const timings = [
      500,   // step 0 → 1: blank → year
      1400,  // step 1 → 2: year → location
      1200,  // step 2 → 3: location → orbital objects
      1200,  // step 3 → 4: objects → no central control
      1000,  // step 4 → 5: pause
      1500,  // step 5 → 6: initializing
      2400,  // step 6 → 7: progress bar fills
      1200,  // step 7 → 8: logo
      1800,  // step 8 → 9: tagline
      2200,  // step 9 → 10: hold, then fade
    ];

    if (step < timings.length) {
      const timer = setTimeout(advance, timings[step]);
      return () => clearTimeout(timer);
    }
    // Step 10: begin fade-out
    if (step === 10) {
      setFadeOut(true);
      const exitTimer = setTimeout(onComplete, 1200);
      return () => clearTimeout(exitTimer);
    }
  }, [step, advance, onComplete]);

  // Progress bar animation
  useEffect(() => {
    if (step === 6) {
      const interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            clearInterval(interval);
            return 100;
          }
          return p + 2;
        });
      }, 40);
      return () => clearInterval(interval);
    }
  }, [step]);

  const textFade = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] as const },
  };

  const textFadeSlow = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] as const },
  };

  return (
    <AnimatePresence>
      {!fadeOut ? (
        <motion.div
          key="story"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center story-bg"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0 }}
        >
          {/* Subtle center glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 600px 400px at 50% 50%, rgba(41, 121, 255, 0.06) 0%, transparent 70%)',
            }}
          />

          {/* Scanline effect */}
          <div className="absolute inset-0 pointer-events-none scanline-overlay" />

          <div className="relative flex flex-col items-center gap-3 text-center z-10">
            {/* Step 1: Year */}
            {step >= 1 && (
              <motion.div {...textFadeSlow}>
                <h1
                  className="text-7xl md:text-8xl font-bold tracking-[0.4em] text-white/95"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  2 0 5 5
                </h1>
              </motion.div>
            )}

            {/* Step 2: Earth Orbit */}
            {step >= 2 && (
              <motion.p
                {...textFade}
                className="story-text text-lg text-[var(--text-secondary)] mt-2 tracking-[0.25em]"
              >
                Earth Orbit
              </motion.p>
            )}

            {/* Step 3: Orbital objects */}
            {step >= 3 && (
              <motion.p
                {...textFade}
                className="story-text text-sm text-[var(--text-dim)] mt-4 tracking-[0.15em]"
              >
                2,842,198 Autonomous Orbital Objects
              </motion.p>
            )}

            {/* Step 4: No central control */}
            {step >= 4 && (
              <motion.p
                {...textFade}
                className="story-text text-sm text-[var(--red)] mt-1 tracking-[0.15em]"
              >
                No Central Mission Control
              </motion.p>
            )}

            {/* Step 5: Initializing */}
            {step >= 5 && step < 7 && (
              <motion.div
                {...textFade}
                className="flex items-center gap-2 mt-8"
              >
                <span
                  className="story-text text-sm text-[var(--cyan)] tracking-[0.12em]"
                >
                  Initializing SwarmOS...
                </span>
                <span
                  className="inline-block w-[2px] h-4 bg-[var(--cyan)] animate-blink"
                />
              </motion.div>
            )}

            {/* Step 6: Progress bar */}
            {step >= 6 && step < 8 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="mt-4 w-64"
              >
                <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      width: `${progress}%`,
                      background:
                        'linear-gradient(90deg, var(--cyan), var(--blue))',
                      boxShadow: '0 0 12px var(--cyan)',
                    }}
                  />
                </div>
                <p
                  className="text-right text-xs mt-1 text-[var(--text-dim)]"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {progress}%
                </p>
              </motion.div>
            )}

            {/* Step 7: Logo */}
            {step >= 7 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="mt-10"
              >
                <h2
                  className="text-5xl md:text-6xl font-bold text-white tracking-tight"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    textShadow: '0 0 40px rgba(0, 229, 255, 0.3), 0 0 80px rgba(0, 229, 255, 0.1)',
                  }}
                >
                  Swarm
                  <span className="text-[var(--cyan)]">OS</span>
                </h2>
              </motion.div>
            )}

            {/* Step 8: Tagline */}
            {step >= 8 && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, delay: 0.3 }}
                className="story-tagline text-base md:text-lg mt-3 max-w-md"
              >
                The Operating System for Autonomous Space Infrastructure
              </motion.p>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="fadeout"
          className="fixed inset-0 z-[9999] story-bg"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.0 }}
        />
      )}
    </AnimatePresence>
  );
}
