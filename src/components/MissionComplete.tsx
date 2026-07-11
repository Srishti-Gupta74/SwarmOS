'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, CheckCircle2, ShieldCheck, Cpu, Flame, Radio, Zap, ArrowRight } from 'lucide-react';

interface MissionCompleteProps {
  onRestart?: () => void;
}

export default function MissionComplete({ onRestart }: MissionCompleteProps) {
  const stats = [
    { label: 'Consensus Latency', value: '0.81s', icon: Cpu, color: 'text-cyan-400' },
    { label: 'Propellant Saved', value: '31%', icon: Flame, color: 'text-emerald-400' },
    { label: 'Human Intervention', value: '0', icon: ShieldCheck, color: 'text-amber-400' },
    { label: 'Orbital Integrity', value: 'RESTORED', icon: CheckCircle2, color: 'text-emerald-400' },
  ];

  const verificationSteps = [
    {
      title: 'P2P Quorum Reached in 14ms',
      detail: '12 active satellites synchronized orbital state vectors directly via inter-satellite optical lasers.',
      icon: Radio,
      badge: 'OPTICAL MESH',
    },
    {
      title: 'Suitability Matrix Evaluated',
      detail: 'Local decision engine prioritized Gaia Sentinel based on 91% fuel reserves and observation priority.',
      icon: Zap,
      badge: 'DSC QUORUM',
    },
    {
      title: 'Autonomous Evasion Burn Executed',
      detail: 'Precision thruster burn (0.42 m/s ΔV) altered trajectory safely without ground station delay.',
      icon: CheckCircle2,
      badge: 'ZERO DELAY',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-[#020611]/85 backdrop-blur-2xl pointer-events-auto overflow-y-auto"
    >
      {/* Sleek, Center-Aligned Apple Vision Pro Glass Card */}
      <motion.div
        initial={{ scale: 0.95, y: 25, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-3xl bg-[#060e1f]/95 backdrop-blur-3xl border border-cyan-500/40 rounded-[36px] p-6 sm:p-9 md:p-11 shadow-[0_0_120px_rgba(0,229,255,0.22)] font-mono text-white flex flex-col items-center text-center my-auto overflow-hidden"
      >
        {/* Top Ambient Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-gradient-to-b from-emerald-500/25 via-cyan-500/15 to-transparent blur-3xl pointer-events-none" />

        {/* Status Badge */}
        <div className="relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/45 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-6 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Mission Status: Nominal • Swarm Quorum Confirmed</span>
        </div>

        {/* Hero Title */}
        <h1 className="relative z-10 text-4xl sm:text-5xl md:text-6xl font-sans font-black tracking-tight text-white mb-3 drop-shadow-[0_4px_30px_rgba(16,185,129,0.4)]">
          Collision <span className="text-emerald-400">Avoided</span>
        </h1>
        <p className="relative z-10 text-xs sm:text-sm text-gray-300 font-sans max-w-lg mb-8 leading-relaxed">
          Autonomous peer-to-peer evasion executed cleanly in low-Earth orbit. No Mission Control intervention or Earth round-trip delay required.
        </p>

        {/* 4 Key Stats — Clean Open Grid without Cluttered Boxes */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full p-5 rounded-3xl bg-white/[0.03] border border-white/10 mb-8 backdrop-blur-md">
          {stats.map((stat, idx) => {
            const IconComp = stat.icon;
            return (
              <div
                key={stat.label}
                className={`flex flex-col items-center justify-center p-2 ${
                  idx < 3 ? 'sm:border-r border-white/10' : ''
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <IconComp className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                    {stat.label}
                  </span>
                </div>
                <span className={`text-2xl sm:text-3xl font-black tracking-tight ${stat.color} font-mono`}>
                  {stat.value}
                </span>
              </div>
            );
          })}
        </div>

        {/* Crisp Verification Checklist (Instead of Cramped Paragraph Boxes) */}
        <div className="relative z-10 w-full space-y-3 mb-9 text-left">
          {verificationSteps.map((step) => {
            const IconComp = step.icon;
            return (
              <div
                key={step.title}
                className="flex items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-cyan-500/40 transition-all group"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 group-hover:bg-cyan-500/25 transition-all shrink-0">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white font-sans tracking-wide mb-0.5">
                      {step.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-gray-400 font-sans leading-normal">
                      {step.detail}
                    </p>
                  </div>
                </div>
                <span className="hidden sm:inline-block text-[10px] font-mono px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 font-bold uppercase tracking-wider shrink-0">
                  {step.badge}
                </span>
              </div>
            );
          })}
        </div>

        {/* Hero CTA Button & Clean Centered Footer */}
        {onRestart && (
          <button
            onClick={onRestart}
            className="relative z-10 w-full sm:w-auto min-w-[260px] flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold font-mono tracking-widest uppercase shadow-[0_0_35px_rgba(0,229,255,0.45)] hover:shadow-[0_0_55px_rgba(0,229,255,0.7)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer mb-7"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Live Demo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {/* Zero-Overlap Centered Footer */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center gap-2 pt-5 border-t border-white/10 text-center">
          <p className="text-xs sm:text-sm font-sans font-bold italic text-gray-300 tracking-normal">
            &ldquo;The future won&apos;t be controlled. It will cooperate.&rdquo;
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-gray-400">
            <span className="font-extrabold text-white tracking-wider">SwarmOS</span>
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/35">
              v2055.1
            </span>
            <span>● Decentralized Space OS</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
