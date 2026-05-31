'use client';

import { notFound } from 'next/navigation';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Check, Star, Shield, ArrowLeft, Gift, Zap, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { GIFT_CARD_TIERS, CARD_NUM } from '@/data/giftCards';
import { useCartStore } from '@/store/cartStore';
import { useState, use } from 'react';
import { toast } from 'react-hot-toast';

const DETAIL_SCHEME: Record<string, { isLight: boolean; amtColor: string; subtle: string; saveColor: string; payColor: string; accentColor: string; catColor: string; numColor: string }> = {
  starter: { isLight: false, amtColor: 'text-white/80', subtle: 'text-white/15', saveColor: '#4ADE80', payColor: 'text-white/60', accentColor: 'text-white/45', catColor: 'text-white/50', numColor: 'text-white/30' },
  value: { isLight: false, amtColor: 'text-white/80', subtle: 'text-white/15', saveColor: '#4ADE80', payColor: 'text-white/60', accentColor: 'text-white/45', catColor: 'text-white/50', numColor: 'text-white/30' },
  premium: { isLight: true, amtColor: 'text-[#1D1D1F]/85', subtle: 'text-[#1D1D1F]/20', saveColor: '#1D4A1E', payColor: 'text-[#1D1D1F]/65', accentColor: 'text-[#1D1D1F]/45', catColor: 'text-[#1D1D1F]/55', numColor: 'text-[#1D1D1F]/30' },
  luxury: { isLight: false, amtColor: 'text-[#C9A84C]/85', subtle: 'text-white/12', saveColor: '#4ADE80', payColor: 'text-white/55', accentColor: 'text-white/40', catColor: 'text-white/45', numColor: 'text-white/25' },
};

export default function GiftCardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const tier = GIFT_CARD_TIERS.find(t => t.id === id);
  
  if (!tier) {
    notFound();
  }

  const { addGiftCardItem, items } = useCartStore();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const alreadyInCart = items.some(i => i.isGiftCard && i.giftCardTierId === id);
  const save = tier.getValue - tier.payPrice;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-8deg', '8deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  const handleAddToCart = async () => {
    if (alreadyInCart) {
      toast('Already in your bag!', { icon: '🎁' });
      return;
    }
    setAdding(true);
    await new Promise(r => setTimeout(r, 600));
    addGiftCardItem(tier.id, tier.name, tier.payPrice, tier.getValue);
    setAdding(false);
    setAdded(true);
    toast.success(`${tier.name} Gift Card added to your bag!`, {
      icon: '🎁',
      duration: 3000,
    });
    setTimeout(() => setAdded(false), 3000);
  };

  return (
    <div className="min-h-screen bg-white text-[#1D1D1F]">
      {/* ── Back nav ── */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-4">
          <Link href="/gift-cards" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#1D1D1F] transition-colors text-[11px] font-bold uppercase tracking-widest">
            <ArrowLeft className="w-3.5 h-3.5" /> Gift Cards
          </Link>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* ── Left: Card ── */}
          <div className="relative" style={{ perspective: '1200px' }}>
            <motion.div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
              className={`relative w-full aspect-[1.6/1] rounded-[2rem] bg-gradient-to-br ${tier.theme.bg} p-8 lg:p-12 cursor-crosshair shadow-2xl border ${tier.theme.border} overflow-hidden ring-1 ring-white/[0.06]`}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

              <div className="relative z-10 h-full flex flex-col" style={{ transform: 'translateZ(50px)' }}>
                {/* ── Top: logo + category ── */}
                <div className="flex items-start justify-between shrink-0">
                  <div className="relative w-[160px] md:w-[220px] h-8 md:h-11">
                    <Image
                      src="/media-pro/azlaan-logo-trimmed.png"
                      alt="Azlaan"
                      fill
                      className={`object-contain object-left opacity-90 ${DETAIL_SCHEME[tier.id].isLight ? '' : 'brightness-0 invert'}`}
                      sizes="220px"
                    />
                  </div>
                  <span className={`text-[11px] md:text-sm font-black uppercase tracking-[0.15em] ${DETAIL_SCHEME[tier.id].catColor}`}>
                    {tier.name}
                  </span>
                </div>

                <div className="flex-1" />

                {/* ── "GIFT CARD" centered ── */}
                <div className="flex justify-center shrink-0">
                  <p className={`text-[clamp(0.9rem,3.5vw,1.4rem)] font-black uppercase tracking-[0.35em] ${DETAIL_SCHEME[tier.id].accentColor} leading-none`}
                    style={{ fontFamily: 'Playfair Display, serif' }}>
                    Gift Card
                  </p>
                </div>

                <div className="flex-1" />

                {/* ── Bottom: value + save/pay ── */}
                <div className="flex flex-col items-start shrink-0">
                  <p className={`${DETAIL_SCHEME[tier.id].amtColor} font-black leading-none tracking-tighter text-[clamp(2rem,9vw,4.5rem)]`}>
                    ৳{tier.getValue.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs md:text-sm font-bold tracking-tight"
                      style={{ color: DETAIL_SCHEME[tier.id].saveColor }}>
                      +৳{save.toLocaleString()}
                    </span>
                    <span className={`text-[6px] ${DETAIL_SCHEME[tier.id].subtle}`}>|</span>
                    <span className={`text-xs md:text-sm font-bold tracking-tight ${DETAIL_SCHEME[tier.id].payColor}`}>
                      PAY ৳{tier.payPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* ── Card number bottom-right ── */}
                <div className="absolute bottom-6 md:bottom-8 right-6 md:right-8">
                  <p className={`text-[14px] md:text-[17px] font-mono tracking-[0.25em] ${DETAIL_SCHEME[tier.id].numColor}`}
                    style={{ textShadow: '0 0.5px 0 rgba(255,255,255,0.06)' }}>
                    {CARD_NUM[tier.id]}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Right: Details ── */}
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#F5F5F7] border border-gray-200 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest mb-4 w-fit text-gray-500">
                <Star className="w-3 h-3 text-[#C9A84C]" /> {tier.bonusPct}% Bonus Included
              </div>

              <h1 className="text-3xl lg:text-4xl font-black mb-2 text-[#1D1D1F]">
                {tier.name}
              </h1>

              <p className="text-gray-400 text-sm leading-relaxed">
                Pay <strong className="text-[#1D1D1F]">৳{tier.payPrice.toLocaleString()}</strong> and receive
                <strong className="text-[#1D1D1F]"> ৳{tier.getValue.toLocaleString()}</strong> in store credit — instantly.
                That&rsquo;s <strong className="text-[#C9A84C]">{tier.bonusPct}% free credit</strong> on top of what you pay.
              </p>
            </div>

            {/* Pricing card */}
            <div className="bg-[#F5F5F7] border border-gray-200 rounded-2xl p-5">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">You pay</p>
                  <p className="text-3xl lg:text-4xl font-black text-[#1D1D1F]">৳{tier.payPrice.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">You get</p>
                  <p className="text-xl lg:text-2xl font-black text-[#C9A84C]">৳{tier.getValue.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 py-2.5 px-3.5 rounded-xl bg-white border border-gray-100 mb-5">
                <Gift className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  Save <span className="text-[#4ADE80] font-bold">৳{save.toLocaleString()}</span> compared to buying credit directly.
                </p>
              </div>

              <motion.button
                onClick={handleAddToCart}
                disabled={adding || added || alreadyInCart}
                whileHover={{ scale: adding || added || alreadyInCart ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full h-12 rounded-xl flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest transition-all
                  ${added || alreadyInCart
                    ? 'bg-[#34C759] text-white cursor-default'
                    : 'bg-[#1D1D1F] text-white hover:bg-black'
                  }`}
              >
                <AnimatePresence mode="popLayout">
                  {added || alreadyInCart ? (
                    <motion.span key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1.5">
                      <Check className="w-4 h-4" /> {alreadyInCart ? 'Already in Bag' : 'Added to Bag!'}
                    </motion.span>
                  ) : adding ? (
                    <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5">
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      Adding...
                    </motion.span>
                  ) : (
                    <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5">
                      <ShoppingBag className="w-4 h-4" /> Add to Bag — ৳{tier.payPrice.toLocaleString()}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Perks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="flex items-start gap-2.5 bg-white border border-gray-100 p-3.5 rounded-xl">
                <Zap className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1D1D1F] mb-0.5">Instant Balance</h4>
                  <p className="text-[10px] text-gray-400 leading-relaxed">Credit is added to your account immediately after purchase.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 bg-white border border-gray-100 p-3.5 rounded-xl">
                <Shield className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1D1D1F] mb-0.5">30-Day Validity</h4>
                  <p className="text-[10px] text-gray-400 leading-relaxed">Use your full balance within 30 days. Unused credit expires.</p>
                </div>
              </div>
            </div>

            {/* ── Terms & Conditions ── */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-4 h-4 rounded-full border border-[#C9A84C]/40 flex items-center justify-center">
                  <span className="text-[8px] font-black text-[#C9A84C]">!</span>
                </div>
                <p className="text-[8px] font-black uppercase tracking-[0.25em] text-gray-300">
                  Terms &amp; Usage
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <Check className="w-3 h-3 text-[#4ADE80] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold text-[#1D1D1F] mb-0.5">How it works</p>
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      Pay <strong className="text-[#1D1D1F]">৳{tier.payPrice.toLocaleString()}</strong> and receive
                      {' '}<strong className="text-[#C9A84C]">৳{tier.getValue.toLocaleString()}</strong> in store credit instantly.
                      The bonus <strong className="text-[#4ADE80]">{tier.bonusPct}%</strong> is applied at the time of purchase.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Check className="w-3 h-3 text-[#4ADE80] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold text-[#1D1D1F] mb-0.5">Where to use</p>
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      Redeemable at our physical store and online at azlaan.com.bd on all regular-priced products.
                      Works across Men, Women, Kids, Fabric, and Gift Cards.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Check className="w-3 h-3 text-[#4ADE80] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold text-[#1D1D1F] mb-0.5">Single-use only</p>
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      The full balance must be used in a single bill. Cannot be split across multiple purchases.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Check className="w-3 h-3 text-[#4ADE80] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold text-[#1D1D1F] mb-0.5">30-day validity</p>
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      Balance must be used within 30 days of purchase. After expiry the card becomes void
                      and the remaining balance cannot be recovered or refunded.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Check className="w-3 h-3 text-[#4ADE80] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold text-[#1D1D1F] mb-0.5">Discount policy</p>
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      Gift card balance cannot be combined with item-level discounts or promotional pricing.
                      To use your card, the product must be purchased at regular price.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Check className="w-3 h-3 text-[#4ADE80] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold text-[#1D1D1F] mb-0.5">Restrictions</p>
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      Gift cards are non-refundable and cannot be exchanged for cash. Bonus credit is non-transferable.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
