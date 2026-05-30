'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Gift, Sparkles, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { GIFT_CARD_TIERS } from '@/data/giftCards';

export default function GiftCardBanner() {
  const { giftCardBalance } = useCartStore();

  return (
    <section className="relative w-full overflow-hidden bg-[#050505] text-white py-14 md:py-20 px-4 md:px-8 border-y border-white/5">
      {/* Premium Background glows & Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -right-20 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[100px] bg-gradient-to-r from-transparent via-amber-500/5 to-transparent -rotate-12 blur-xl" />
      </div>

      <div className="relative z-10 max-w-[1100px] mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left text */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className="flex-1"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-4">
            <Gift className="w-3 h-3 text-amber-400" /> Azlaan স্পেশাল গিফট কার্ড
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-4 font-bengali">
            কম টাকায় কিনুন,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-600">বেশি টাকার শপিং করুন!</span>
          </h2>
          <p className="text-neutral-400 text-sm max-w-sm leading-relaxed mb-6 font-bengali">
            Azlaan গিফট কার্ড কিনে উপভোগ করুন <span className="text-white font-bold">২৫% পর্যন্ত এক্সট্রা বোনাস</span> ব্যালেন্স! যেকোনো শপিংয়ে ব্যবহার করুন, কোনো মেয়াদ উত্তীর্ণের ঝামেলা ছাড়াই।
          </p>
          {giftCardBalance > 0 ? (
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-emerald-500/20 border border-emerald-500/30 px-4 py-2 rounded-full flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-black text-xs">Balance: ৳{giftCardBalance.toLocaleString()}</span>
              </div>
            </div>
          ) : null}
          <Link href="/gift-cards">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-white text-black h-12 px-8 rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-neutral-100 transition-colors shadow-lg shadow-white/10 group"
            >
              Shop Gift Cards <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Right: Stacked mini-cards */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          className="relative w-64 h-44 shrink-0 hidden sm:block"
        >
          {GIFT_CARD_TIERS.slice(0, 3).map((tier, i) => (
            <motion.div
              key={tier.id}
              initial={{ rotate: (i - 1) * 8 }}
              whileHover={{ rotate: 0, scale: 1.05, zIndex: 10 }}
              className={`absolute inset-0 bg-gradient-to-br ${tier.theme.bg} rounded-2xl border ${tier.theme.border} shadow-xl flex flex-col justify-between p-5 cursor-default`}
              style={{
                rotate: `${(i - 1) * 8}deg`,
                zIndex: i + 1,
                originX: 0.5,
                originY: 1,
              }}
            >
              <div className="flex justify-between items-center">
                <span className={`text-[8px] font-black uppercase tracking-widest ${tier.theme.accent}`}>Azlaan</span>
                <span className={`${tier.theme.badge} ${tier.theme.badgeText} text-[8px] font-black px-2 py-0.5 rounded-full`}>{tier.badge}</span>
              </div>
              <p className={`text-3xl font-black ${tier.theme.text}`}>৳{tier.getValue.toLocaleString()}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Tier quick-view strip */}
      <div className="relative z-10 max-w-[1100px] mx-auto mt-12 grid grid-cols-2 md:grid-cols-4 gap-3">
        {GIFT_CARD_TIERS.map(tier => (
          <Link key={tier.id} href="/gift-cards">
            <motion.div
              whileHover={{ y: -3 }}
              className={`bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors cursor-pointer`}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">{tier.name}</span>
                <span className="bg-amber-400/20 text-amber-400 text-[9px] font-black px-2 py-0.5 rounded-full">{tier.badge}</span>
              </div>
              <p className="text-base font-black text-white">৳{tier.getValue.toLocaleString()}</p>
              <p className="text-[10px] text-neutral-500 mt-0.5">Pay ৳{tier.payPrice.toLocaleString()}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}
