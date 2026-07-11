'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, ArrowRight, Terminal } from 'lucide-react';
import { useSwarmStore } from '../store/useSwarmStore';

function formatTime(ts: number | string | Date): string {
  const d = new Date(ts);
  return d.toISOString().slice(11, 19); // Clean 8-char HH:MM:SS (no cluttered milliseconds)
}

export default function AIFeed() {
  const messages = useSwarmStore((s) => s.messages);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Show last 20 messages for clean performance & breathing room
  const visibleMessages = [...messages].reverse().slice(0, 20);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [messages.length]);

  return (
    <aside
      className="w-[340px] h-full flex flex-col overflow-hidden shrink-0 bg-[#040914]/95 backdrop-blur-3xl border-l border-white/[0.08] font-mono text-white select-none"
    >
      {/* ── Sleek, Clean Header (Minimalist & Airborne) ── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-white/[0.01]">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-white font-sans">
            ISL Telemetry Log
          </span>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>LIVE STREAM</span>
        </div>
      </div>

      {/* ── Open, Breathable Timeline List (No Heavy Cluttered Boxes!) ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 custom-scrollbar">
        <AnimatePresence initial={false}>
          {visibleMessages.map((msg) => {
            const isAlert = msg.isDanger || (msg.type || '').toLowerCase().includes('alert') || (msg.type || '').toLowerCase().includes('danger');
            const isConsensus = (msg.type || '').toLowerCase().includes('consensus') || msg.content.toLowerCase().includes('quorum');
            const isSolarStorm = msg.content.toUpperCase().includes('SOLAR');
            const isCollision = msg.content.toUpperCase().includes('COLLISION');

            // Instead of heavy full boxes, we use a clean left-line timeline indicator with open breathing room!
            const indicatorColor = isAlert
              ? 'border-l-red-500 text-red-300'
              : isConsensus
              ? 'border-l-blue-400 text-blue-300'
              : 'border-l-white/20 text-zinc-400';

            const bgGlow = isAlert
              ? 'bg-red-500/[0.06]'
              : isConsensus
              ? 'bg-blue-500/[0.04]'
              : 'bg-transparent hover:bg-white/[0.03]';

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  if (msg.fromId && msg.fromId !== 'system' && msg.fromId !== 'all') {
                    useSwarmStore.getState().setSelectedSatelliteId(msg.fromId);
                  }
                }}
                className={`group relative pl-3.5 pr-2 py-2.5 rounded-r-xl border-l-[2.5px] transition-all cursor-pointer ${indicatorColor} ${bgGlow}`}
              >
                {/* Top Timestamp & Category Badge (Clean & Compact) */}
                <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-1 font-mono">
                  <span>{formatTime(msg.timestamp)} UTC</span>
                  {isAlert ? (
                    <span className="text-[9px] font-bold uppercase tracking-widest text-red-400 font-sans">
                      {isSolarStorm ? 'CME-2055 Storm' : isCollision ? 'Collision Vector' : 'Warning'}
                    </span>
                  ) : isConsensus ? (
                    <span className="text-[9px] font-bold uppercase tracking-widest text-blue-400 font-sans">
                      DSC Quorum
                    </span>
                  ) : (
                    <span className="text-[9px] font-medium uppercase tracking-wider text-zinc-500 font-sans">
                      Optical ISL
                    </span>
                  )}
                </div>

                {/* Sender & Receiver Handshake */}
                <div className="flex items-center gap-1.5 mb-1 font-sans">
                  <span className="text-xs shrink-0">{msg.senderIcon || '🛰'}</span>
                  <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                    {msg.senderName || msg.fromName || 'System'}
                  </span>
                  {(msg.receiverName || msg.toName) && (msg.receiverName || msg.toName) !== 'Fleet' && (
                    <>
                      <ArrowRight className="w-3 h-3 text-zinc-600 shrink-0" />
                      <span className="text-xs font-medium text-zinc-300 truncate">
                        {msg.receiverName || msg.toName}
                      </span>
                    </>
                  )}
                </div>

                {/* Telemetry Payload Paragraph (Crisp & Breathable) */}
                <p
                  className={`text-xs font-mono leading-relaxed ${
                    isAlert ? 'text-red-200 font-medium' : isConsensus ? 'text-blue-100' : 'text-zinc-300'
                  }`}
                >
                  {msg.content}
                </p>

                {/* Subtle Hover Action Link */}
                <div className="mt-1.5 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] text-cyan-400 font-mono font-bold">
                    Inspect Node →
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {visibleMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-zinc-600 space-y-2">
            <Radio className="w-6 h-6 animate-pulse opacity-40 text-cyan-400" />
            <span className="text-xs font-mono">Listening for optical transmissions...</span>
          </div>
        )}
      </div>
    </aside>
  );
}
