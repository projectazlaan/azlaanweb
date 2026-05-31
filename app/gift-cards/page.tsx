'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { GIFT_CARD_TIERS, GiftCardTier, CARD_NUM } from '@/data/giftCards';
import Image from 'next/image';
import Link from 'next/link';

const CARD_STYLE: Record<string, { isLight: boolean; amtColor: string; subtle: string; saveColor: string; payColor: string; accentColor: string; catColor: string; numColor: string }> = {
  starter: { isLight: false, amtColor: 'text-white/80', subtle: 'text-white/15', saveColor: '#4ADE80', payColor: 'text-white/60', accentColor: 'text-white/45', catColor: 'text-white/50', numColor: 'text-white/30' },
  value: { isLight: false, amtColor: 'text-white/80', subtle: 'text-white/15', saveColor: '#4ADE80', payColor: 'text-white/60', accentColor: 'text-white/45', catColor: 'text-white/50', numColor: 'text-white/30' },
  premium: { isLight: true, amtColor: 'text-[#1D1D1F]/85', subtle: 'text-[#1D1D1F]/20', saveColor: '#1D4A1E', payColor: 'text-[#1D1D1F]/65', accentColor: 'text-[#1D1D1F]/45', catColor: 'text-[#1D1D1F]/55', numColor: 'text-[#1D1D1F]/30' },
  luxury: { isLight: false, amtColor: 'text-[#C9A84C]/85', subtle: 'text-white/12', saveColor: '#4ADE80', payColor: 'text-white/55', accentColor: 'text-white/40', catColor: 'text-white/45', numColor: 'text-white/25' },
};

function Card({ tier }: { tier: GiftCardTier }) {
  const s = CARD_STYLE[tier.id];
  const save = tier.getValue - tier.payPrice;

  return (
    <Link href={`/gift-cards/${tier.id}`} className="group block">
      <div className={`relative w-full aspect-[1.6/1] rounded-2xl bg-gradient-to-br ${tier.theme.bg} border ${tier.theme.border} overflow-hidden shadow-lg`}>
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

        <div className="relative flex flex-col h-full p-3 md:p-6">
          {/* ── Top: logo + category ── */}
          <div className="flex items-start justify-between shrink-0 gap-2">
            <div className="relative w-[70px] md:w-[170px] h-[14px] md:h-9">
              <Image
                src="/media-pro/azlaan-logo-trimmed.png"
                alt="Azlaan"
                fill
                className={`object-contain object-left opacity-90 ${s.isLight ? '' : 'brightness-0 invert'}`}
                sizes="170px"
              />
            </div>
            <span className={`text-[7px] md:text-[10px] font-black uppercase tracking-[0.15em] ${s.catColor} whitespace-nowrap`}>
              {tier.name}
            </span>
          </div>

          <div className="flex-1 min-h-[4px]" />

          {/* ── "GIFT CARD" centered ── */}
          <div className="flex justify-center shrink-0">
            <p className={`text-[clamp(0.5rem,2vw,1rem)] font-black uppercase tracking-[0.35em] ${s.accentColor} leading-none`}
              style={{ fontFamily: 'Playfair Display, serif' }}>
              Gift Card
            </p>
          </div>

          <div className="flex-1 min-h-[4px]" />

          {/* ── Bottom: value + save/pay ── */}
          <div className="flex flex-col items-start shrink-0">
            <p className={`font-black leading-none tracking-tighter ${s.amtColor}`}
              style={{ fontSize: 'clamp(0.9rem,4vw,2.4rem)' }}>
              ৳{tier.getValue.toLocaleString()}
            </p>
            <div className="flex items-center gap-1.5 md:gap-2 mt-0.5 md:mt-1">
              <span className={`text-[7px] md:text-[10px] font-bold tracking-tight`}
                style={{ color: s.saveColor }}>
                +৳{save.toLocaleString()}
              </span>
              <span className={`text-[4px] md:text-[5px] ${s.subtle}`}>|</span>
              <span className={`text-[7px] md:text-[10px] font-bold tracking-tight ${s.payColor}`}>
                PAY ৳{tier.payPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* ── Card number bottom-right ── */}
          <div className="absolute bottom-2.5 md:bottom-5 right-3 md:right-6">
            <p className={`text-[8px] md:text-[13px] font-mono tracking-[0.2em] md:tracking-[0.25em] ${s.numColor}`}
              style={{ textShadow: '0 0.5px 0 rgba(255,255,255,0.06)' }}>
              {CARD_NUM[tier.id]}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-2 md:mt-3 space-y-1.5 md:space-y-2">
        <ul className="space-y-0.5 md:space-y-1">
          <li className="flex items-center gap-1 md:gap-1.5 text-[9px] md:text-[11px] text-gray-400">
            <Check className="w-2.5 h-2.5 md:w-3 md:h-3 text-gray-300 shrink-0" /> Instant credit, 30-day validity
          </li>
          <li className="flex items-center gap-1 md:gap-1.5 text-[9px] md:text-[11px] text-gray-400">
            <Check className="w-2.5 h-2.5 md:w-3 md:h-3 text-gray-300 shrink-0" /> Valid 30 days, single-use
          </li>
        </ul>

        <div className="w-full h-8 md:h-10 rounded-lg flex items-center justify-center gap-1 md:gap-1.5 text-[8px] md:text-[9px] font-black uppercase tracking-widest bg-gray-100 text-gray-500 border border-gray-200 group-hover:bg-gray-200 group-hover:text-gray-700 transition-all">
          Buy &mdash; ৳{tier.payPrice.toLocaleString()} <ArrowRight className="w-2.5 h-2.5 md:w-3 md:h-3 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

/* ── Page ─────────────────────────────────────── */
export default function GiftCardsPage() {
  const premiumTier = GIFT_CARD_TIERS.find(t => t.id === 'premium')!;
  const s = CARD_STYLE.premium;

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ── */}
      <section className="bg-white overflow-hidden border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center min-h-[70vh] lg:min-h-[80vh]">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 pt-16 md:pt-20 lg:pt-0 lg:pr-12"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-5">
                Azlaan Gift Card
              </p>
              <h1 className="text-[clamp(2.2rem,7vw,5rem)] font-black leading-[0.9] tracking-[-0.03em] uppercase text-[#1D1D1F]">
                More Than
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#D4B85C]">a Gift</span>
              </h1>
              <div className="w-12 h-px bg-gray-200 mt-6 mb-5" />
              <p className="text-gray-400 text-sm md:text-base max-w-md leading-relaxed">
                Every card comes with bonus balance. Pay less, get more &mdash; use it on anything across Azlaan.
              </p>
            </motion.div>

            {/* Right: Hero Card */}
            <motion.div
              initial={{ opacity: 0, x: 60, rotate: 6 }}
              animate={{ opacity: 1, x: 0, rotate: 3 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex-1 relative py-12 lg:py-20"
            >
              <div className="relative w-full max-w-[520px] lg:max-w-[580px] mx-auto lg:ml-auto aspect-[1.6/1] rounded-[2.5rem] bg-gradient-to-br from-[#C9A84C] via-[#B8952E] to-[#D4B85C] p-8 lg:p-10 shadow-2xl shadow-[#C9A84C]/15 rotate-[3deg] lg:rotate-[4deg]">
                <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none" />

                <div className="relative h-full flex flex-col">
                  {/* Top: logo + category */}
                  <div className="flex items-start justify-between shrink-0">
                    <div className="relative w-[180px] md:w-[220px] h-9 md:h-11">
                      <Image
                        src="/media-pro/azlaan-logo-trimmed.png"
                        alt="Azlaan"
                        fill
                        className="object-contain object-left opacity-90"
                        sizes="220px"
                      />
                    </div>
                    <span className="text-[11px] md:text-sm font-black uppercase tracking-[0.15em] text-[#1D1D1F]/55">
                      {premiumTier.name}
                    </span>
                  </div>

                  <div className="flex-1" />

                  {/* Center: "GIFT CARD" */}
                  <div className="flex justify-center shrink-0">
                    <p className="text-[clamp(1rem,4vw,1.6rem)] font-black uppercase tracking-[0.35em] text-[#1D1D1F]/45 leading-none"
                      style={{ fontFamily: 'Playfair Display, serif' }}>
                      Gift Card
                    </p>
                  </div>

                  <div className="flex-1" />

                  {/* Bottom: value + save/pay */}
                  <div className="flex flex-col items-start shrink-0">
                    <p className="text-[#1D1D1F]/85 font-black leading-none tracking-tighter"
                      style={{ fontSize: 'clamp(1.8rem,7vw,3.6rem)' }}>
                      ৳{premiumTier.getValue.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] md:text-sm font-bold tracking-tight text-[#1D4A1E]">
                        +৳{(premiumTier.getValue - premiumTier.payPrice).toLocaleString()}
                      </span>
                      <span className="text-[6px] text-[#1D1D1F]/20">|</span>
                      <span className="text-[11px] md:text-sm font-bold tracking-tight text-[#1D1D1F]/65">
                        PAY ৳{premiumTier.payPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Card number bottom-right */}
                  <div className="absolute bottom-6 md:bottom-8 right-6 md:right-8">
                    <p className="text-[14px] md:text-[17px] font-mono tracking-[0.25em] text-[#1D1D1F]/30"
                      style={{ textShadow: '0 0.5px 0 rgba(0,0,0,0.04)' }}>
                      {CARD_NUM.premium}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Cards ── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-[#C9A84C] mb-3">Choose your card</p>
            <h2 className="text-xl md:text-2xl font-black text-[#1D1D1F]">Bigger balance, bigger savings</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {GIFT_CARD_TIERS.map((tier, i) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <Card tier={tier} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-[#F5F5F7] border-t border-gray-200">
        <div className="max-w-[1000px] mx-auto px-4 md:px-8 py-16 md:py-20 text-center">
          <p className="text-[8px] font-black uppercase tracking-[0.4em] text-[#C9A84C] mb-3">How it works</p>
          <h2 className="text-xl md:text-2xl font-black text-[#1D1D1F]">Three simple steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {[
              { step: '01', title: 'Choose a card', desc: 'Pick your preferred gift card tier and pay the discounted price.' },
              { step: '02', title: 'Get instant credit', desc: 'The full balance is added to your account immediately.' },
              { step: '03', title: 'Shop & save', desc: 'Use your credit at checkout. What you saved is yours to keep.' },
            ].map(s => (
              <div key={s.step} className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center">
                  <span className="text-sm font-black text-[#C9A84C]">{s.step}</span>
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#1D1D1F] mb-1">{s.title}</h3>
                  <p className="text-[11px] text-gray-400 leading-relaxed max-w-[220px] mx-auto">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}