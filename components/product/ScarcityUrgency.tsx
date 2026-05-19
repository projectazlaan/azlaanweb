'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ScarcityUrgencyProps {
  stockCount: number;
  viewersCount: number;
  offerEndsAt?: string;
}

export default function ScarcityUrgency({ stockCount, viewersCount, offerEndsAt }: ScarcityUrgencyProps) {
  const [timeLeft, setTimeLeft] = useState<{ h: string; m: string; s: string } | null>(null);

  useEffect(() => {
    if (!offerEndsAt) return;
    const timer = setInterval(() => {
      const distance = new Date(offerEndsAt).getTime() - new Date().getTime();
      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft(null);
      } else {
        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
        const s = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');
        setTimeLeft({ h, m, s });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [offerEndsAt]);

  const stockPercentage = Math.max(10, Math.min(100, (stockCount / 15) * 100));

  return (
    <div className="space-y-4 my-6">
      <div className="flex flex-col gap-3 bg-neutral-50/50 border border-neutral-100/50 p-4 rounded-xl shadow-inner">
        {/* Live Viewers Count */}
        <div className="flex items-center text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-500">
          <span className="relative flex h-2 w-2 mr-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>{viewersCount} active collectors viewing this silhouette</span>
        </div>

        {/* Dynamic Stock progress bar */}
        {stockCount < 15 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.2em] text-amber-700">
              <div className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2.5 animate-pulse" />
                <span>Urgent Scarcity Edition — Only {stockCount} left</span>
              </div>
              <span className="font-mono text-neutral-400">{stockCount}/15</span>
            </div>
            
            {/* 2px Micro Glowing Progress Bar */}
            <div className="h-[2px] w-full bg-neutral-200/50 rounded-full overflow-hidden relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${stockPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Countdown Timer */}
      {timeLeft && (
        <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl w-full text-white shadow-md">
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-neutral-200"></span>
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-neutral-400">Campaign Closes In</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[11px] font-bold tracking-widest text-neutral-100">
            <span className="bg-white/10 px-2 py-0.5 rounded border border-white/5">{timeLeft.h}h</span>
            <span className="text-white/30">:</span>
            <span className="bg-white/10 px-2 py-0.5 rounded border border-white/5">{timeLeft.m}m</span>
            <span className="text-white/30">:</span>
            <span className="bg-white/10 px-2 py-0.5 rounded border border-white/5 text-amber-400">{timeLeft.s}s</span>
          </div>
        </div>
      )}
    </div>
  );
}
