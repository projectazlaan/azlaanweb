'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { GiftCardTier } from '@/data/giftCards';
import { GIFT_CARD_TIERS, CARD_NUM } from '@/data/giftCards';

/* ── Tilt hook for 3D card effect ──────────────── */
function useTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const smoothX = useSpring(x, { stiffness: 300, damping: 30 });
  const smoothY = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(smoothY, [0, 1], ['8deg', '-8deg']);
  const rotateY = useTransform(smoothX, [0, 1], ['-8deg', '8deg']);

  const onMove = (clientX: number, clientY: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((clientX - rect.left) / rect.width);
    y.set((clientY - rect.top) / rect.height);
  };

  const onLeave = () => { x.set(0.5); y.set(0.5); };

  return { ref, rotateX, rotateY, onMove, onLeave };
}

/* ── Card ─────────────────────────────────────── */
function GiftCard({ tier, scheme, index, isActive, onToggle }: {
  tier: GiftCardTier;
  scheme: {
    bg: string;
    isLight: boolean;
    amtColor: string;
    subtle: string;
    saveColor: string;
    payColor: string;
    accentColor: string;
    catColor: string;
    numColor: string;
  };
  index: number;
  isActive: boolean;
  onToggle: () => void;
}) {
  const router = useRouter();
  const tilt = useTilt();
  const stackZ = 10 - index;
  const yBase = index * 14;
  const scaleBase = 1 - index * 0.02;
  const rotBase = (index - 1) * 6;
  const save = tier.getValue - tier.payPrice;

  return (
    <motion.div
      ref={tilt.ref}
      onMouseMove={(e) => isActive && tilt.onMove(e.clientX, e.clientY)}
      onMouseLeave={tilt.onLeave}
      onTouchMove={(e) => {
        if (isActive) {
          const t = e.touches[0];
          tilt.onMove(t.clientX, t.clientY);
        }
      }}
      onTouchEnd={tilt.onLeave}
      onClick={() => {
        if (isActive) router.push('/gift-cards');
        else onToggle();
      }}
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
      className="absolute inset-x-0 rounded-2xl shadow-2xl select-none cursor-pointer overflow-hidden"
      style={{
        height: 260,
        rotateX: isActive ? tilt.rotateX : 0,
        rotateY: isActive ? tilt.rotateY : 0,
        transformStyle: 'preserve-3d',
        background: scheme.bg,
      }}
    >
      {/* Surface sheen */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative flex flex-col h-full px-5 md:px-7 py-4 md:py-6 z-10"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* ── Top: logo left + category right ── */}
        <div className="flex items-start justify-between shrink-0 gap-2">
          <div className="relative w-[100px] md:w-[140px] h-[18px] md:h-[22px]">
            <Image
              src="/media-pro/azlaan-logo-trimmed.png"
              alt="Azlaan"
              fill
              className={`object-contain object-left opacity-90 ${scheme.isLight ? '' : 'brightness-0 invert'}`}
              sizes="140px"
            />
          </div>
          <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-[0.15em] ${scheme.catColor}`}>
            {tier.name}
          </span>
        </div>

        <div className="flex-1" />

        {/* ── "GIFT CARD" centered ── */}
        <div className="flex justify-center shrink-0">
          <p className={`text-[clamp(0.55rem,2.5vw,0.85rem)] font-black uppercase tracking-[0.35em] ${scheme.accentColor} leading-none`}
            style={{ fontFamily: 'Playfair Display, serif' }}>
            Gift Card
          </p>
        </div>

        <div className="flex-1" />

        {/* ── Bottom: value + save/pay ── */}
        <div className="flex flex-col items-start shrink-0">
          <p className={`font-black tracking-tight leading-none ${scheme.amtColor}`}
            style={{ fontSize: 'clamp(1.1rem, 5vw, 2rem)' }}>
            ৳{tier.getValue.toLocaleString()}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`text-[8px] md:text-[10px] font-bold tracking-tight ${scheme.amtColor}`}
              style={{ color: scheme.saveColor }}>
              +৳{save.toLocaleString()}
            </span>
            <span className={`text-[4px] md:text-[5px] ${scheme.subtle}`}>|</span>
            <span className={`text-[8px] md:text-[10px] font-bold tracking-tight ${scheme.payColor}`}>
              PAY ৳{tier.payPrice.toLocaleString()}
            </span>
          </div>
        </div>

        {/* ── Card number bottom-right ── */}
        <div className="absolute bottom-4 md:bottom-5 right-5 md:right-7">
          <p className={`text-[10px] md:text-[12px] font-mono tracking-[0.25em] ${scheme.numColor}`}
            style={{ textShadow: '0 0.5px 0 rgba(255,255,255,0.06)' }}>
            {CARD_NUM[tier.id]}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main ─────────────────────────────────────── */
export default function GiftCardBanner() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const tiers = GIFT_CARD_TIERS;
  const visibleTiers = tiers;
  const maxIdx = visibleTiers.length - 1;

  const prev = useCallback(() => {
    setActiveIdx((p) => (p === null || p === 0 ? maxIdx : p - 1));
  }, [maxIdx]);
  const next = useCallback(() => {
    setActiveIdx((p) => (p === null || p === maxIdx ? 0 : p + 1));
  }, [maxIdx]);

  return (
    <section className="relative w-full bg-white py-20 md:py-28 px-4 md:px-8 lg:px-12 border-y border-gray-100 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-20">
          {/* ── Left ── */}
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

          {/* ── Right ── */}
          <div className="relative w-full max-w-[360px] mx-auto lg:mx-0 shrink-0"
            style={{ perspective: 1200, height: 310 }}
          >
            <div className="absolute -inset-8 bg-gradient-to-b from-amber-900/5 via-transparent to-transparent blur-[60px] rounded-full pointer-events-none" />

            <button onClick={prev} aria-label="Previous"
              className="absolute -left-10 md:-left-12 top-1/2 -translate-y-1/2 z-30 w-8 h-8 flex items-center justify-center rounded-full border border-black/10 bg-white/80 backdrop-blur-sm text-gray-400 hover:text-primary hover:border-black/20 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
            <button onClick={next} aria-label="Next"
              className="absolute -right-10 md:-right-12 top-1/2 -translate-y-1/2 z-30 w-8 h-8 flex items-center justify-center rounded-full border border-black/10 bg-white/80 backdrop-blur-sm text-gray-400 hover:text-primary hover:border-black/20 transition-all cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>

            {visibleTiers.map((tier, i) => (
              <GiftCard
                key={tier.id}
                tier={tier}
                scheme={SCHEMES[tier.id as keyof typeof SCHEMES]}
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

const SCHEMES = {
  starter: {
    bg: 'linear-gradient(145deg, #1D1D1F 0%, #28282B 50%, #1A1A1C 100%)',
    isLight: false,
    amtColor: 'text-white/80',
    subtle: 'text-white/15',
    saveColor: '#4ADE80',
    payColor: 'text-white/60',
    accentColor: 'text-white/45',
    catColor: 'text-white/50',
    numColor: 'text-white/30',
  },
  value: {
    bg: 'linear-gradient(145deg, #1C1B19 0%, #272520 50%, #1A1916 100%)',
    isLight: false,
    amtColor: 'text-white/80',
    subtle: 'text-white/15',
    saveColor: '#4ADE80',
    payColor: 'text-white/60',
    accentColor: 'text-white/45',
    catColor: 'text-white/50',
    numColor: 'text-white/30',
  },
  premium: {
    bg: 'linear-gradient(145deg, #C9A84C 0%, #B8952E 40%, #D4B85C 70%, #C9A84C 100%)',
    isLight: true,
    amtColor: 'text-[#1D1D1F]/85',
    subtle: 'text-[#1D1D1F]/20',
    saveColor: '#1D4A1E',
    payColor: 'text-[#1D1D1F]/65',
    accentColor: 'text-[#1D1D1F]/45',
    catColor: 'text-[#1D1D1F]/55',
    numColor: 'text-[#1D1D1F]/30',
  },
  luxury: {
    bg: 'linear-gradient(145deg, #0C0C0E 0%, #161618 50%, #0A0A0C 100%)',
    isLight: false,
    amtColor: 'text-white/80',
    subtle: 'text-white/12',
    saveColor: '#4ADE80',
    payColor: 'text-white/55',
    accentColor: 'text-white/40',
    catColor: 'text-white/45',
    numColor: 'text-white/25',
  },
} as const;