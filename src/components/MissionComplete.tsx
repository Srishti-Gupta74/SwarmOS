'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, CheckCircle2, ShieldCheck, Cpu, Flame, Sparkles, Radio, Zap, Brain } from 'lucide-react';

interface MissionCompleteProps {
  onRestart?: () => void;
}

export default function MissionComplete({ onRestart }: MissionCompleteProps) {
  const stats = [
    { label: 'Consensus Latency', value: '0.81s', icon: Cpu, color: 'text-cyan-400', border: 'border-cyan-500/30 bg-cyan-500/10' },
    { label: 'Propellant Saved', value: '31%', icon: Flame, color: 'text-emerald-400', border: 'border-emerald-500/30 bg-emerald-500/10' },
    { label: 'Human Intervention', value: '0', icon: ShieldCheck, color: 'text-amber-400', border: 'border-amber-500/30 bg-amber-500/10' },
    { label: 'Orbital Integrity', value: 'RESTORED', icon: CheckCircle2, color: 'text-emerald-400', border: 'border-emerald-500/40 bg-emerald-500/15' },
  ];

  const pillars = [
    {
      title: 'P2P Laser Synchronization',
      icon: Radio,
      color: 'text-cyan-400',
      description: '12 satellites directly synchronized orbital state vectors and trajectory matrices over 14ms laser links without waiting for Earth.',
    },
    {
      title: 'Zero Ground Bottlenecks',
      icon: Zap,
      color: 'text-amber-400',
      description: 'Decentralized quorum algorithms calculated evasion burns locally in real time. No ground station delay, no single point of failure.',
    },
    {
      title: 'Collective Swarm AI',
      icon: Brain,
      color: 'text-purple-400',
      description: 'Autonomous swarm intelligence distributed decision weight based on live fuel reserves, drift status, and mission priorities.',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 bg-[#020611]/80 backdrop-blur-xl pointer-events-auto overflow-y-auto"
    >
      {/* Ultra-Spacious Apple Vision Pro + SpaceX Spatial Command Center Card */}
      <motion.div
        initial={{ scale: 0.94, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-4xl bg-[#060d1a]/98 backdrop-blur-3xl border border-cyan-500/40 rounded-[32px] p-7 md:p-10 shadow-[0_0_100px_rgba(0,229,255,0.25)] font-mono text-white overflow-hidden flex flex-col items-center text-center my-auto"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-36 bg-gradient-to-b from-emerald-500/20 via-cyan-500/10 to-transparent blur-3xl pointer-events-none" />

        {/* Status Pill */}
        <div className="relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-extrabold uppercase tracking-widest mb-4 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Mission Status: Nominal • Swarm Quorum Confirmed</span>
        </div>

        {/* Hero Title */}
        <h1 className="relative z-10 text-4xl md:text-5xl font-sans font-black tracking-tight text-white mb-2 drop-shadow-[0_4px_25px_rgba(16,185,129,0.4)]">
          Collision <span className="text-emerald-400">Avoided</span>
        </h1>
        <p className="relative z-10 text-xs md:text-sm text-gray-400 font-sans max-w-xl mb-8">
          Autonomous peer-to-peer evasion executed cleanly in low-Earth orbit. No Mission Control intervention required.
        </p>

        {/* 4-Stat Grid */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 w-full mb-8">
          {stats.map((stat) => {
            const IconComp = stat.icon;
            return (
              <div
                key={stat.label}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border ${stat.border} backdrop-blur-lg transition-all hover:scale-[1.02]`}
              >
                <IconComp className={`w-5 h-5 ${stat.color} mb-2`} />
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1 text-center">
                  {stat.label}
                </span>
                <span className={`text-xl md:text-2xl font-black tracking-tight ${stat.color}`}>
                  {stat.value}
                </span>
              </div>
            );
          })}
        </div>

        {/* 3 Architectural Pillar Cards */}
        <div className="relative z-10 w-full bg-white/[0.03] border border-white/10 rounded-3xl p-6 mb-8 text-left space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Distributed Swarm Intelligence Architecture</span>
            </div>
            <span className="text-[10px] text-gray-400 font-mono">2,842,198 Nodes Scalable</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pillars.map((pillar) => {
              const IconComp = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col gap-2 hover:border-cyan-500/35 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <IconComp className={`w-4 h-4 ${pillar.color} shrink-0`} />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide">
                      {pillar.title}
                    </h4>
                  </div>
                  <p className="text-[11px] md:text-xs text-gray-300 font-sans leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Heroic Footer Bar (Zero Overlap!) */}
        <div className="relative z-10 w-full flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/10 text-left">
          <div className="space-y-2">
            <p className="text-base md:text-lg font-sans font-extrabold italic text-gray-100 tracking-tight">
              &ldquo;The future won&apos;t be controlled. It will cooperate.&rdquo;
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black text-white tracking-widest uppercase">SwarmOS</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-extrabold border border-cyan-500/35">v2055.1</span>
              <span className="text-[10px] text-gray-400 ml-1">● Decentralized Space OS</span>
            </div>
          </div>

          {onRestart && (
            <button
              onClick={onRestart}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold font-mono tracking-wider uppercase shadow-[0_0_30px_rgba(0,229,255,0.4)] hover:shadow-[0_0_45px_rgba(0,229,255,0.6)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restart Live Demo</span>
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
