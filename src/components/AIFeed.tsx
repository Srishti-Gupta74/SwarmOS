'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, ArrowRight } from 'lucide-react';
import { useSwarmStore } from '../store/useSwarmStore';

const BORDER_COLORS: Record<string, string> = {
  normal: 'border-l-[var(--cyan)]',
  danger: 'border-l-[var(--red)]',
  alert: 'border-l-[var(--red)]',
  consensus: 'border-l-[var(--purple)]',
  negotiation: 'border-l-[var(--purple)]',
  system: 'border-l-emerald-400',
};

const BORDER_GLOW: Record<string, string> = {
  normal: 'rgba(0, 229, 255, 0.15)',
  danger: 'rgba(255, 51, 85, 0.2)',
  alert: 'rgba(255, 51, 85, 0.2)',
  consensus: 'rgba(156, 77, 255, 0.2)',
  negotiation: 'rgba(156, 77, 255, 0.2)',
  system: 'rgba(0, 230, 118, 0.15)',
};

function formatTime(ts: number | string | Date): string {
  const d = new Date(ts);
  return d.toISOString().slice(11, 19);
}

export default function AIFeed() {
  const messages = useSwarmStore((s) => s.messages);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Show last 20 messages, newest first
  const visibleMessages = [...messages].reverse().slice(0, 20);

  // Auto-scroll to top on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [messages.length]);

  return (
    <motion.aside
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="glass w-[320px] h-full flex flex-col overflow-hidden shrink-0"
      style={{ borderLeft: '1px solid var(--border-glass)' }}
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-white/5">
        <Radio className="w-4 h-4 text-[var(--cyan)]" />
        <span className="text-sm font-semibold tracking-tight">AI Activity Feed</span>
        <span className="relative ml-auto flex items-center gap-1.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--emerald)] opacity-50" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--emerald)]" />
          </span>
          <span
            className="text-[0.6rem] uppercase tracking-widest text-[var(--emerald)] font-semibold"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            Live
          </span>
        </span>
      </div>

      {/* ── Messages ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
        <AnimatePresence initial={false}>
          {visibleMessages.map((msg) => {
            const typeKey = (msg.type || 'normal').toLowerCase();
            const borderClass = BORDER_COLORS[typeKey] || (msg.isDanger ? BORDER_COLORS.danger : BORDER_COLORS.normal);
            const glowColor = BORDER_GLOW[typeKey] || (msg.isDanger ? BORDER_GLOW.danger : BORDER_GLOW.normal);
            const isAlert = msg.isDanger || typeKey === 'alert' || typeKey === 'danger';
            const isSolarStorm = msg.content.toUpperCase().includes('SOLAR STORM');
            const isCollision = msg.content.toUpperCase().includes('COLLISION');

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: 40, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                onClick={() => {
                  if (msg.fromId && msg.fromId !== 'system' && msg.fromId !== 'all') {
                    useSwarmStore.getState().setSelectedSatelliteId(msg.fromId);
                  }
                }}
                className={`rounded-lg p-2.5 border-l-2 transition-all duration-300 cursor-pointer group hover:scale-[1.01] ${borderClass} ${
                  isAlert ? 'bg-[rgba(255,51,85,0.12)] border-[var(--red)] hover:bg-[rgba(255,51,85,0.2)]' : 'glass-subtle hover:bg-white/[0.08] hover:border-l-cyan-400'
                }`}
                style={{
                  boxShadow: isAlert
                    ? '0 0 16px rgba(255, 51, 85, 0.25), inset 4px 0 12px -3px rgba(255, 51, 85, 0.4)'
                    : `inset 3px 0 8px -3px ${glowColor}`,
                }}
              >
                {/* Priority / Event Badge */}
                {isAlert && (
                  <div className="flex items-center gap-1.5 mb-1.5 px-2 py-0.5 rounded bg-[var(--red)]/20 border border-[var(--red)]/40 text-[0.62rem] font-bold text-[var(--red)] tracking-wider uppercase animate-pulse">
                    <span>{isSolarStorm ? '⚠ SOLAR STORM EMERGENCY' : isCollision ? '🚨 COLLISION DANGER' : '🚨 CRITICAL ALERT'}</span>
                  </div>
                )}

                {/* Sender / Receiver */}
                <div className="flex items-center gap-1 mb-1 flex-wrap">
                  <span className="text-sm shrink-0">{msg.senderIcon || '🛰'}</span>
                  <span className="text-[0.7rem] font-bold text-[var(--text-primary)] group-hover:text-cyan-300 transition-colors truncate">
                    {msg.senderName || msg.fromName || 'System'}
                  </span>
                  {(msg.receiverName || msg.toName) && (msg.receiverName || msg.toName) !== 'Fleet' && (
                    <>
                      <ArrowRight className="w-3 h-3 text-[var(--text-dim)] shrink-0" />
                      <span className="text-[0.7rem] font-medium text-[var(--text-secondary)] truncate">
                        {msg.receiverName || msg.toName}
                      </span>
                    </>
                  )}
                </div>

                {/* Content */}
                <p className={`text-[0.68rem] leading-relaxed mb-1.5 ${isAlert ? 'text-white font-medium' : 'text-[var(--text-secondary)] group-hover:text-white transition-colors'}`}>
                  {msg.content}
                </p>

                {/* Timestamp & Interactive Prompt */}
                <div className="flex items-center justify-between text-[0.55rem] text-[var(--text-dim)]" style={{ fontFamily: 'var(--font-mono)' }}>
                  <span>{formatTime(msg.timestamp)}</span>
                  <span className="opacity-0 group-hover:opacity-100 text-cyan-400 font-bold tracking-wider uppercase transition-opacity">● Inspect Node</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {visibleMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-[var(--text-dim)]">
            <Radio className="w-6 h-6 mb-2 opacity-30" />
            <span className="text-xs opacity-50">Awaiting transmissions...</span>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
