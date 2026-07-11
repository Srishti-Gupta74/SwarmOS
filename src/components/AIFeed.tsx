'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, ArrowRight, Terminal, ShieldAlert, CheckCircle2, Cpu } from 'lucide-react';
import { useSwarmStore } from '../store/useSwarmStore';

function formatTime(ts: number | string | Date): string {
  const d = new Date(ts);
  return d.toISOString().slice(11, 23);
}

export default function AIFeed() {
  const messages = useSwarmStore((s) => s.messages);
  const scrollRef = useRef<HTMLDivElement>(null);

  const visibleMessages = [...messages].reverse().slice(0, 25);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [messages.length]);

  return (
    <aside
      className="w-[340px] h-full flex flex-col overflow-hidden shrink-0 bg-[#050b14]/95 backdrop-blur-3xl border-l border-white/[0.08] font-mono text-white select-none"
    >
      {/* ── Terminal Header ── */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.08] bg-white/[0.01]">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-white font-sans">
            Optical ISL Stream
          </span>
        </div>
        <div className="flex items-center gap-2 px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.1] text-zinc-300 text-[10px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span>LIVE 1,284 PKT/S</span>
        </div>
      </div>

      {/* ── Telemetry Packet List (Strictly Cohesive & High-Contrast Silver/White) ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
        <AnimatePresence initial={false}>
          {visibleMessages.map((msg) => {
            const isAlert = msg.isDanger || (msg.type || '').toLowerCase().includes('alert') || (msg.type || '').toLowerCase().includes('danger');
            const isConsensus = (msg.type || '').toLowerCase().includes('consensus') || msg.content.toLowerCase().includes('quorum');
            const isSolarStorm = msg.content.toUpperCase().includes('SOLAR');
            const isCollision = msg.content.toUpperCase().includes('COLLISION');

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                onClick={() => {
                  if (msg.fromId && msg.fromId !== 'system' && msg.fromId !== 'all') {
                    useSwarmStore.getState().setSelectedSatelliteId(msg.fromId);
                  }
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isAlert
                    ? 'bg-amber-500/10 border-l-2 border-l-amber-400 border-t-white/[0.08] border-r-white/[0.08] border-b-white/[0.08] hover:bg-amber-500/15'
                    : isConsensus
                    ? 'bg-blue-500/10 border-l-2 border-l-blue-400 border-t-white/[0.08] border-r-white/[0.08] border-b-white/[0.08] hover:bg-blue-500/15'
                    : 'bg-white/[0.03] border border-white/[0.06] hover:border-white/15 hover:bg-white/[0.06]'
                }`}
              >
                {/* Top Timestamp & Packet Header */}
                <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1.5">
                  <span className="text-zinc-400 font-mono">[{formatTime(msg.timestamp)} UTC]</span>
                  {isAlert ? (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold uppercase tracking-wider">
                      {isSolarStorm ? '⚠️ CME-2055 STORM' : isCollision ? '🚨 COLLISION VECTOR' : 'TACTICAL ALERT'}
                    </span>
                  ) : isConsensus ? (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-bold uppercase tracking-wider">
                      DSC QUORUM OK
                    </span>
                  ) : (
                    <span className="text-[9px] text-zinc-500 uppercase font-mono">OPTICAL_ISL</span>
                  )}
                </div>

                {/* Sender & Receiver Handshake */}
                <div className="flex items-center gap-1.5 mb-1.5 font-sans">
                  <span className="text-xs shrink-0">{msg.senderIcon || '🛰'}</span>
                  <span className="text-xs font-bold text-white truncate">
                    {msg.senderName || msg.fromName || 'System Kernel'}
                  </span>
                  {(msg.receiverName || msg.toName) && (msg.receiverName || msg.toName) !== 'Fleet' && (
                    <>
                      <ArrowRight className="w-3 h-3 text-zinc-500 shrink-0" />
                      <span className="text-xs font-medium text-zinc-300 truncate">
                        {msg.receiverName || msg.toName}
                      </span>
                    </>
                  )}
                </div>

                {/* Telemetry Payload Text */}
                <p
                  className={`text-[11px] font-mono leading-relaxed ${
                    isAlert ? 'text-amber-100 font-semibold' : 'text-zinc-300'
                  }`}
                >
                  {msg.content}
                </p>

                {/* Interactive Audit Link */}
                <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] text-zinc-500 uppercase">
                  <span>Ping: 14ms (P2P Mesh)</span>
                  <span className="text-blue-400 font-bold hover:underline">Inspect Node →</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {visibleMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-zinc-500 space-y-2">
            <Radio className="w-6 h-6 animate-pulse opacity-40 text-blue-400" />
            <span className="text-xs font-mono">Listening for optical ISL transmissions...</span>
          </div>
        )}
      </div>
    </aside>
  );
}
