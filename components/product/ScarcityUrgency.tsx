'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Timer, AlertCircle } from 'lucide-react';

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

  return (
    <div className="space-y-3 my-6">
      {/* Viewers Count (Social Proof) */}
      <div className="flex items-center gap-2 text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full w-fit">
        <Users className="w-3.5 h-3.5" />
        <span>{viewersCount} people are viewing this now</span>
      </div>

      {/* Low Stock Warning (Scarcity) */}
      {stockCount < 15 && (
        <div className="flex items-center gap-2 text-[11px] font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-full w-fit">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Only {stockCount} left in stock!</span>
        </div>
      )}

      {/* Countdown Timer (Urgency) */}
      {timeLeft && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl w-full">
          <Timer className="w-4 h-4 text-primary" />
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Limited Time Offer Ends In</p>
            <div className="flex gap-2">
              <div className="flex flex-col items-center">
                <span className="text-sm font-black text-primary">{timeLeft.h}h</span>
              </div>
              <span className="text-gray-300">:</span>
              <div className="flex flex-col items-center">
                <span className="text-sm font-black text-primary">{timeLeft.m}m</span>
              </div>
              <span className="text-gray-300">:</span>
              <div className="flex flex-col items-center">
                <span className="text-sm font-black text-primary">{timeLeft.s}s</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
