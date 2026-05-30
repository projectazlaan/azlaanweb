'use client';

import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Sparkles, Check, ArrowRight, Star, Gift, Zap, Shield } from 'lucide-react';
import { GIFT_CARD_TIERS, GiftCardTier } from '@/data/giftCards';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';

function TierCard({ tier }: { tier: GiftCardTier }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 25 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <Link href={`/gift-cards/${tier.id}`} className="relative flex flex-col h-full group block" style={{ perspective: '800px' }}>
      {tier.popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="bg-[#1D1D1F] text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
            <Star className="w-2.5 h-2.5 fill-[#C9A84C] text-[#C9A84C]" /> Most Popular
          </div>
        </div>
      )}

      {/* The 3D Card */}
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={`relative w-full aspect-[1.6/1] rounded-[1.75rem] bg-gradient-to-br ${tier.theme.bg} p-6 cursor-pointer shadow-xl ${tier.theme.glow} border ${tier.theme.border} overflow-hidden transition-shadow duration-300`}
      >
        {/* Subtle top glass sheen */}
        <div className="absolute top-0 left-0 right-0 h-2/5 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-[1.75rem]" />
        {/* Shimmer on hover */}
        <div className={`absolute inset-0 bg-gradient-to-tr ${tier.theme.shimmer} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

        <div className="h-full flex flex-col justify-between relative z-10" style={{ transform: 'translateZ(28px)' }}>
          <div className="flex justify-between items-center">
            <span className={`text-[9px] font-black uppercase tracking-[0.35em] ${tier.theme.accent}`}>Azlaan • {tier.name}</span>
            <span className={`${tier.theme.badge} ${tier.theme.badgeText} text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full`}>
              {tier.badge}
            </span>
          </div>
          <div>
            <p className={`text-[9px] font-black uppercase tracking-widest ${tier.theme.accent} mb-1.5`}>Store Credit</p>
            <p className={`text-[2.4rem] font-black leading-none ${tier.theme.text}`}>৳{tier.getValue.toLocaleString()}</p>
          </div>
        </div>
      </motion.div>

      {/* Below-card info */}
      <div className="flex-1 flex flex-col mt-5 px-1 space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] text-[#6E6E73] font-bold uppercase tracking-widest mb-0.5">You Pay</p>
            <p className="text-2xl font-black text-[#1D1D1F] group-hover:text-[#C9A84C] transition-colors duration-200">৳{tier.payPrice.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#C9A84C] bg-[#C9A84C]/10 px-2.5 py-1.5 rounded-full">
              Save ৳{(tier.getValue - tier.payPrice).toLocaleString()}
            </p>
          </div>
        </div>

        <ul className="space-y-2 text-[11px] text-[#6E6E73] font-medium">
          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#1D1D1F] shrink-0" /> যেকোনো অর্ডারে ব্যবহার করুন</li>
          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#1D1D1F] shrink-0" /> কোনো মেয়াদ নেই</li>
          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#1D1D1F] shrink-0" /> সাথে সাথে অ্যাকাউন্টে যোগ</li>
        </ul>

        <div
          className={`w-full h-12 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all mt-auto
            ${tier.popular
              ? 'bg-[#1D1D1F] text-white group-hover:bg-black border border-[#C9A84C]/30'
              : 'bg-white text-[#1D1D1F] border border-[#D2D2D7] group-hover:border-[#1D1D1F]'
            }`}
        >
          বিস্তারিত দেখুন <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

export default function GiftCardsPage() {
  const { giftCardBalance } = useCartStore();

  return (
    <div className="min-h-screen bg-white">

      {/* Hero — site-matching dark header */}
      <div className="relative bg-[#1D1D1F] text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 left-1/4 w-[700px] h-[700px] bg-[#C9A84C]/10 rounded-full blur-[140px]" />
          <div className="absolute -bottom-40 right-1/4 w-[600px] h-[600px] bg-[#C9A84C]/8 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-[1100px] mx-auto px-4 md:px-8 py-16 md:py-24 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-white/8 border border-white/10 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
              <Gift className="w-3.5 h-3.5 text-[#C9A84C]" /> Azlaan স্পেশাল গিফট কার্ড
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-5 font-bengali">
              উপহার দিন নিজেকে<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] via-[#E8C86A] to-[#C9A84C]">বা প্রিয়জনকে</span>
            </h1>
            <p className="text-[#6E6E73] text-base max-w-md mx-auto mb-8 font-bengali leading-relaxed">
              Azlaan গিফট কার্ড কিনে পেয়ে যান <strong className="text-white">২৫% পর্যন্ত এক্সট্রা</strong> বোনাস ব্যালেন্স। যেকোনো সময় যেকোনো প্রোডাক্ট কিনতে ব্যবহার করুন।
            </p>

            {giftCardBalance > 0 && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-3 bg-[#C9A84C]/10 border border-[#C9A84C]/20 px-6 py-3 rounded-2xl">
                <Sparkles className="w-4 h-4 text-[#C9A84C]" />
                <span className="text-white font-black text-sm">আপনার ব্যালেন্স: ৳{giftCardBalance.toLocaleString()}</span>
                <Link href="/checkout" className="text-[#1D1D1F] text-[10px] font-black uppercase tracking-widest bg-[#C9A84C] px-3 py-1 rounded-full hover:bg-[#B8952E] transition-colors">
                  এখনই ব্যবহার করুন
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Trust Strip */}
      <div className="bg-[#F5F5F7] border-b border-[#D2D2D7]">
        <div className="max-w-[1100px] mx-auto px-4 py-4 flex flex-wrap justify-center gap-6 md:gap-12 text-[10px] font-black uppercase tracking-widest text-[#6E6E73]">
          <span className="flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-[#C9A84C]" /> Instant Credit</span>
          <span className="flex items-center gap-2"><Shield className="w-3.5 h-3.5 text-[#C9A84C]" /> Never Expires</span>
          <span className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#C9A84C]" /> Works on All Orders</span>
          <span className="flex items-center gap-2"><Gift className="w-3.5 h-3.5 text-[#C9A84C]" /> Perfect as a Gift</span>
        </div>
      </div>

      {/* 4 Tier Cards */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-black text-[#1D1D1F] mb-3 font-bengali">আপনার পছন্দমতো টায়ার বেছে নিন</h2>
          <p className="text-[#6E6E73] text-sm font-bengali">যত বেশি কিনবেন, তত বেশি সাশ্রয়</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
          {GIFT_CARD_TIERS.map((tier, i) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 180, damping: 22 }}
              className={`pt-6 rounded-3xl ${tier.popular ? 'ring-2 ring-[#C9A84C] ring-offset-4' : ''}`}
            >
              <TierCard tier={tier} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="bg-[#F5F5F7] border-t border-[#D2D2D7] py-16 md:py-24">
        <div className="max-w-[1000px] mx-auto px-4 md:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-[#1D1D1F] mb-3 font-bengali">কীভাবে কাজ করে?</h2>
          <p className="text-[#6E6E73] text-sm mb-12 font-bengali">মাত্র ৩টি সহজ ধাপে আপনার সাশ্রয় শুরু করুন</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'কার্ড পছন্দ করুন', desc: 'আপনার পছন্দের গিফট কার্ডটি ডিসকাউন্ট মূল্যে কিনে নিন।', icon: Gift },
              { step: '02', title: 'ইন্সট্যান্ট ব্যালেন্স', desc: 'কেনার সাথে সাথেই পুরো কার্ডের ভ্যালু আপনার অ্যাকাউন্টে যোগ হয়ে যাবে।', icon: Zap },
              { step: '03', title: 'শপিং ও সেভিংস', desc: 'চেকআউটের সময় ক্যাশের বদলে এই ব্যালেন্স ব্যবহার করুন।', icon: Check },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-white border border-[#D2D2D7] flex items-center justify-center shadow-sm">
                  <s.icon className="w-6 h-6 text-[#0071E3]" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#6E6E73] mb-1">Step {s.step}</p>
                  <h3 className="text-base font-black text-[#1D1D1F] mb-2 font-bengali">{s.title}</h3>
                  <p className="text-sm text-[#6E6E73] leading-relaxed font-bengali">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
