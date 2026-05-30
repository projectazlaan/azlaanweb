'use client';

import { notFound } from 'next/navigation';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Check, Star, Shield, ArrowLeft, Gift, Zap } from 'lucide-react';
import Link from 'next/link';
import { GIFT_CARD_TIERS } from '@/data/giftCards';
import { useCartStore } from '@/store/cartStore';
import { useState, use } from 'react';
import { toast } from 'react-hot-toast';
import { ShoppingBag } from 'lucide-react';

export default function GiftCardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const tier = GIFT_CARD_TIERS.find(t => t.id === id);
  
  if (!tier) {
    notFound();
  }

  const { addGiftCardItem, items } = useCartStore();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  // Check if already in cart
  const alreadyInCart = items.some(i => i.isGiftCard && i.giftCardTierId === id);

  // 3D effect logic
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
      {/* Subtle hero bar matching site header */}
      <div className="bg-[#1D1D1F] border-b border-white/5">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-4">
          <Link href="/gift-cards" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-bold">
            <ArrowLeft className="w-4 h-4" /> সব গিফট কার্ড
          </Link>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left: Huge 3D Card */}
          <div className="relative" style={{ perspective: '1200px' }}>
            <motion.div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
              className={`relative w-full aspect-[1.6/1] rounded-[2rem] bg-gradient-to-br ${tier.theme.bg} p-8 lg:p-12 cursor-crosshair shadow-2xl border ${tier.theme.border} overflow-hidden`}
            >
              {/* Glass Reflection Bar */}
              <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
              
              {/* Shimmer */}
              <div className={`absolute inset-0 bg-gradient-to-tr ${tier.theme.shimmer} opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
              
              <div className="h-full flex flex-col justify-between relative z-10" style={{ transform: 'translateZ(50px)' }}>
                <div className="flex justify-between items-start">
                  <span className={`text-[12px] lg:text-[14px] font-black uppercase tracking-[0.4em] ${tier.theme.accent}`}>Azlaan • {tier.name}</span>
                  <span className={`${tier.theme.badge} ${tier.theme.badgeText} text-[10px] lg:text-[12px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full backdrop-blur-md border border-white/20`}>
                    {tier.badge}
                  </span>
                </div>

                <div>
                  <p className={`text-[10px] lg:text-[12px] font-black uppercase tracking-widest ${tier.theme.accent} mb-2`}>Card Value</p>
                  <p className={`text-5xl lg:text-7xl font-black ${tier.theme.text} tracking-tighter`}>৳{tier.getValue.toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Details & Purchase Panel */}
          <div className="flex flex-col">
            <div className="inline-flex items-center gap-2 bg-[#F5F5F7] border border-[#D2D2D7] px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-6 w-fit text-[#6E6E73]">
              <Star className="w-3 h-3 text-[#C9A84C]" /> {tier.bonusPct}% Bonus Included
            </div>

            <h1 className="text-4xl lg:text-5xl font-black mb-4 text-[#1D1D1F] font-bengali">
              {tier.name} <span className="text-[#6E6E73]">গিফট কার্ড</span>
            </h1>

            <p className="text-[#6E6E73] text-base mb-10 font-bengali leading-relaxed">
              মাত্র ৳{tier.payPrice.toLocaleString()} পে করে পেয়ে যান সাথে সাথেই <strong className="text-[#1D1D1F]">৳{tier.getValue.toLocaleString()}</strong> স্টোর ক্রেডিট — {tier.bonusPct}% এক্সট্রা বোনাসসহ।
            </p>

            <div className="bg-[#F5F5F7] border border-[#D2D2D7] rounded-3xl p-6 lg:p-8 mb-8">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-xs text-[#6E6E73] font-black uppercase tracking-widest mb-1">শুধু পে করুন</p>
                  <p className="text-5xl font-black text-[#1D1D1F]">৳{tier.payPrice.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#6E6E73] font-black uppercase tracking-widest mb-1">পাবেন (ব্যালেন্স)</p>
                  <p className="text-2xl font-black text-[#C9A84C]">৳{tier.getValue.toLocaleString()}</p>
                </div>
              </div>

              <motion.button
                onClick={handleAddToCart}
                disabled={adding || added || alreadyInCart}
                whileHover={{ scale: adding || added || alreadyInCart ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full h-16 rounded-2xl flex items-center justify-center gap-3 text-sm font-black uppercase tracking-widest transition-all
                  ${added || alreadyInCart
                    ? 'bg-[#34C759] text-white cursor-default'
                    : 'bg-[#1D1D1F] text-white hover:bg-black shadow-lg shadow-black/20 border border-[#C9A84C]/20'
                  }`}
              >
                <AnimatePresence mode="popLayout">
                  {added || alreadyInCart ? (
                    <motion.span key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
                      <Check className="w-5 h-5" /> {alreadyInCart ? 'Already in Bag' : 'Added to Bag!'}
                    </motion.span>
                  ) : adding ? (
                    <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                      Adding...
                    </motion.span>
                  ) : (
                    <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5" /> Add to Bag — ৳{tier.payPrice.toLocaleString()}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Benefits List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-start gap-3 bg-[#F5F5F7] border border-[#D2D2D7] p-4 rounded-2xl">
                <Zap className="w-5 h-5 text-[#C9A84C] shrink-0" />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#1D1D1F] mb-1">Instant Balance</h4>
                  <p className="text-[11px] text-[#6E6E73] leading-relaxed font-bengali">অ্যাকাউন্টে সাথে সাথেই টাকা যোগ হবে।</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-[#F5F5F7] border border-[#D2D2D7] p-4 rounded-2xl">
                <Shield className="w-5 h-5 text-[#C9A84C] shrink-0" />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#1D1D1F] mb-1">No Expiry</h4>
                  <p className="text-[11px] text-[#6E6E73] leading-relaxed font-bengali">ব্যালেন্সের কোনো মেয়াদ শেষ হবে না।</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
