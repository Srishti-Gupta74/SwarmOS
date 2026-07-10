'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Cpu, User, MessageSquare } from 'lucide-react';
import { useSwarmStore } from '../store/useSwarmStore';
import { NEWS_TICKER_ITEMS } from '../data/satellites';

function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

export default function TopHUD() {
  const autonomousDecisions = useSwarmStore((s) => s.autonomousDecisionsToday || (s as any).autonomousDecisions || 184921334);
  const messagesPerSec = useSwarmStore((s) => s.messagesPerSec);
  const isPaused = useSwarmStore((s) => s.isPaused);

  const [utcTime, setUtcTime] = useState('--:--:--');

  // Real UTC clock
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setUtcTime(now.toISOString().slice(11, 19));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Duplicate ticker items for seamless loop
  const tickerText = [...NEWS_TICKER_ITEMS, ...NEWS_TICKER_ITEMS]
    .join(' ● ');

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="glass w-full h-[52px] shrink-0 flex items-center px-4 z-50 relative"
      style={{
        borderBottom: '1px solid var(--border-glass)',
        boxShadow: '0 1px 20px rgba(0, 229, 255, 0.05)',
      }}
    >
      {/* ── Left: World Timeline ── */}
      <div className="flex items-center gap-4 shrink-0 w-[220px]">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-[var(--cyan)]" />
          <span
            className="text-lg font-bold text-[var(--text-primary)] tracking-wider"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            2055
          </span>
        </div>
        <div className="flex flex-col leading-none">
          <span
            className="text-[0.7rem] font-semibold text-[var(--cyan)] tracking-wider"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {utcTime} UTC
          </span>
          <span className="text-[0.55rem] text-[var(--text-dim)] tracking-widest uppercase mt-0.5">
            Earth Orbit
          </span>
        </div>
      </div>

      {/* ── Center: News Ticker ── */}
      <div className="flex-1 mx-4 ticker-container">
        <div className="animate-ticker inline-block whitespace-nowrap" style={{ animationPlayState: isPaused ? 'paused' : 'running' }}>
          <span
            className="text-[0.65rem] text-[var(--text-dim)] tracking-wider"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {tickerText}
          </span>
        </div>
      </div>

      {/* ── Right: Key Metrics ── */}
      <div className="flex items-center gap-5 shrink-0">
        <div className="hud-metric">
          <span className="hud-metric-label flex items-center gap-1">
            <Cpu className="w-3 h-3" />
            Orbital Pop.
          </span>
          <span className="hud-metric-value text-[0.85rem]">2,842,198</span>
        </div>

        <div className="hud-metric">
          <span className="hud-metric-label flex items-center gap-1">
            <Cpu className="w-3 h-3" />
            Auto Decisions
          </span>
          <span className="hud-metric-value text-[0.85rem]">
            {formatNumber(autonomousDecisions)}
          </span>
        </div>

        <div className="hud-metric">
          <span className="hud-metric-label flex items-center gap-1">
            <User className="w-3 h-3" />
            Human Intervention
          </span>
          <span
            className="text-[0.85rem] font-bold"
            style={{ color: 'var(--emerald)', fontFamily: 'var(--font-mono)' }}
          >
            0
          </span>
        </div>

        <div className="hud-metric">
          <span className="hud-metric-label flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            Msg/sec
          </span>
          <span className="hud-metric-value text-[0.85rem]">
            {formatNumber(messagesPerSec)}
          </span>
        </div>
      </div>
    </motion.header>
  );
}
