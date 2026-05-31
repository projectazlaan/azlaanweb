'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { GiftCardTier } from '@/data/giftCards';
import { GIFT_CARD_TIERS } from '@/data/giftCards';

const CARD = {
  starter: {
    bg: 'bg-gradient-to-br from-[#1a1a1a] via-[#222] to-[#2c2c2c]',
    border: 'border-white/[0.06]',
    badge: 'bg-white/10 text-white/80',
    accent: 'text-white/40',
    chip: 'bg-white/10',
    glow: 'via-white/[0.04]',
  },
  value: {
    bg: 'bg-gradient-to-br from-[#1D1D1F] via-[#222224] to-[#1D1D1F]',
    border: 'border-[#C9A84C]/20',
    badge: 'bg-[#C9A84C]/15 text-[#C9A84C]',
    accent: 'text-[#C9A84C]/50',
    chip: 'bg-[#C9A84C]/20',
    glow: 'via-[#C9A84C]/[0.06]',
  },
  premium: {
    bg: 'bg-gradient-to-br from-[#C9A84C] via-[#B8952E] to-[#96751C]',
    border: 'border-[#E8C86A]/40',
    badge: 'bg-[#1D1D1F]/15 text-[#1D1D1F]',
    accent: 'text-[#1D1D1F]/45',
    chip: 'bg-[#1D1D1F]/10',
    glow: 'via-white/[0.12]',
  },
  luxury: {
    bg: 'bg-gradient-to-br from-[#0d0d0d] via-[#161616] to-[#0d0d0d]',
    border: 'border-[#C9A84C]/15',
    badge: 'bg-[#C9A84C]/12 text-[#C9A84C]',
    accent: 'text-[#C9A84C]/40',
    chip: 'bg-[#C9A84C]/15',
    glow: 'via-[#C9A84C]/[0.05]',
  },
} as const;

/* ── 3D tilt hook ─────────────────────────────── */
function useTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const xRaw = useMotionValue(0);
  const yRaw = useMotionValue(0);

  const x = useSpring(xRaw, { stiffness: 220, damping: 26, mass: 0.5 });
  const y = useSpring(yRaw, { stiffness: 220, damping: 26, mass: 0.5 });

  const rotateX = useTransform(y, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10]);

  const onMove = useCallback((clientX: number, clientY: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const nx = (clientX - cx) / rect.width;
    const ny = (clientY - cy) / rect.height;
    xRaw.set(Math.max(-0.5, Math.min(0.5, nx)));
    yRaw.set(Math.max(-0.5, Math.min(0.5, ny)));
  }, [xRaw, yRaw]);

  const onLeave = useCallback(() => {
    xRaw.set(0);
    yRaw.set(0);
  }, [xRaw, yRaw]);

  return { ref, rotateX, rotateY, onMove, onLeave };
}

/* ── Individual tilt card ─────────────────────── */
function TiltCard({
  tier,
  theme,
  index,
  isActive,
  onToggle,
}: {
  tier: GiftCardTier;
  theme: (typeof CARD)[keyof typeof CARD];
  index: number;
  isActive: boolean;
  onToggle: () => void;
}) {
  const tilt = useTilt();
  const stackZ = 10 - index;
  const yBase = index * 8;
  const scaleBase = 1 - index * 0.015;
  const rotBase = (index - 1) * 3;

  return (
    <motion.div
      ref={tilt.ref}
      onMouseMove={(e) => tilt.onMove(e.clientX, e.clientY)}
      onMouseLeave={tilt.onLeave}
      onTouchMove={(e) => {
        const t = e.touches[0];
        tilt.onMove(t.clientX, t.clientY);
      }}
      onTouchEnd={tilt.onLeave}
      onClick={onToggle}
      animate={{
        zIndex: isActive ? 20 : stackZ,
        y: isActive ? 0 : yBase,
        scale: isActive ? 1 : scaleBase,
        rotate: isActive ? 0 : rotBase,
      }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 24,
        mass: 0.7,
      }}
      className={`absolute inset-x-0 ${theme.bg} rounded-2xl border ${theme.border} shadow-2xl flex flex-col justify-between p-6 md:p-8 select-none cursor-pointer overflow-hidden`}
      style={{
        height: 260,
        rotateX: isActive ? tilt.rotateX : 0,
        rotateY: isActive ? tilt.rotateY : 0,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Subtle glow overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br from-transparent ${theme.glow} to-transparent pointer-events-none`} />

      {/* Top row */}
      <div className="relative flex items-start justify-between" style={{ transformStyle: 'preserve-3d' }}>
        <div className="flex items-center gap-3">
          {/* EMV chip icon */}
          <div className={`w-8 h-6 rounded-[4px] ${theme.chip} flex items-center justify-center`}>
            <div className="w-5 h-3.5 rounded-[2px] border border-white/20 grid grid-cols-3 grid-rows-2 gap-px p-px">
              <div className="bg-white/15 rounded-[1px]" />
              <div className="bg-white/10 rounded-[1px]" />
              <div className="bg-white/15 rounded-[1px]" />
              <div className="bg-white/10 rounded-[1px]" />
              <div className="bg-white/15 rounded-[1px]" />
              <div className="bg-white/10 rounded-[1px]" />
            </div>
          </div>
          <div className="relative w-14 md:w-16 h-4 md:h-5">
            <Image
              src="/media-pro/azlaan-logo-trimmed.png"
              alt="Azlaan"
              fill
              className="object-contain object-left brightness-0 invert opacity-70"
              sizes="64px"
            />
          </div>
        </div>
        <span className={`text-[7px] md:text-[8px] font-black uppercase tracking-wider ${theme.badge} px-2.5 py-1 rounded-full`}>
          {tier.badge}
        </span>
      </div>

      {/* Bottom */}
      <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
        <p className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.3em] text-white/30 mb-1">
          {tier.name}
        </p>
        <p className="text-2xl md:text-3xl font-black text-white tracking-tight">
          ৳{tier.getValue.toLocaleString()}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <p className={`text-[10px] md:text-[11px] font-medium ${theme.accent}`}>
            Pay ৳{tier.payPrice.toLocaleString()}
          </p>
          <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main ─────────────────────────────────────── */
export default function GiftCardBanner() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const tiers = GIFT_CARD_TIERS;
  const visibleTiers = tiers.slice(0, 3);
  const maxIdx = visibleTiers.length - 1;

  const prev = useCallback(() => {
    setActiveIdx((p) => (p === null || p === 0 ? maxIdx : p - 1));
  }, [maxIdx]);
  const next = useCallback(() => {
    setActiveIdx((p) => (p === null || p === maxIdx ? 0 : p + 1));
  }, [maxIdx]);

  return (
    <section className="relative w-full bg-white py-20 md:py-28 px-4 md:px-8 lg:px-12 border-y border-gray-100">
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-20">
          {/* ── Left: Copy ── */}
          <div className="flex-1 text-center lg:text-left">
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 block mb-4">
              Azlaan Gift Card
            </span>
            <h2 className="text-[clamp(2.2rem,6vw,5rem)] font-black leading-[0.92] tracking-[-0.03em] text-primary uppercase">
              More Than
              <br />
              a Gift
            </h2>
            <div className="h-px w-12 bg-black/10 mt-6 mb-4 mx-auto lg:mx-0" />
            <p className="text-[13px] md:text-sm text-gray-400 font-medium tracking-[0.15em] uppercase max-w-sm mx-auto lg:mx-0">
              Pay less, get more &middot; Every card comes with bonus balance
            </p>
          </div>

          {/* ── Right: Interactive 3D card stack ── */}
          <div className="relative w-full max-w-[360px] mx-auto lg:mx-0 shrink-0"
            style={{ perspective: 1200, height: 280 }}
          >
            {/* Glow */}
            <div className="absolute -inset-8 bg-gradient-to-b from-amber-900/5 via-transparent to-transparent blur-[60px] rounded-full pointer-events-none" />

            {/* Left arrow */}
            <button
              onClick={prev}
              aria-label="Previous card"
              className="absolute -left-10 md:-left-12 top-1/2 -translate-y-1/2 z-30 w-8 h-8 flex items-center justify-center rounded-full border border-black/10 bg-white/80 backdrop-blur-sm text-gray-400 hover:text-primary hover:border-black/20 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>

            {/* Right arrow */}
            <button
              onClick={next}
              aria-label="Next card"
              className="absolute -right-10 md:-right-12 top-1/2 -translate-y-1/2 z-30 w-8 h-8 flex items-center justify-center rounded-full border border-black/10 bg-white/80 backdrop-blur-sm text-gray-400 hover:text-primary hover:border-black/20 transition-all cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>

            {visibleTiers.map((tier, i) => (
              <TiltCard
                key={tier.id}
                tier={tier}
                theme={CARD[tier.id as keyof typeof CARD]}
                index={i}
                isActive={activeIdx === i}
                onToggle={() => setActiveIdx(activeIdx === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
