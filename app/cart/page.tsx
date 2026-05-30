'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, animate } from 'framer-motion';
import {
  Minus, Plus, X, ArrowRight, Truck,
  ShoppingBag, Star, Sparkles, ShieldCheck, RotateCcw,
} from 'lucide-react';

/* ── Animated counter ───────────────────────────── */
function Counter({ value, prefix = '৳' }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const ctrl = animate(display, value, {
      duration: 0.4, ease: 'easeOut',
      onUpdate: v => setDisplay(Math.round(v)),
    });
    return ctrl.stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return <>{prefix}{display.toLocaleString()}</>;
}

/* ── Data ───────────────────────────────────────── */
const INIT_CART = [
  { id: 1, name: 'Premium Cotton Panjabi', price: 8500, qty: 1, size: 'L',  color: 'Navy Blue',      image: '/media-pro/men/Design 1/649824908_122120770023151981_1372810042799937270_n.webp' },
  { id: 2, name: 'Elegant Evening Dress',  price: 9800, qty: 2, size: 'M',  color: 'Midnight Black', image: '/media-pro/women/Design 1/673191812_122125962327151981_8385571386878315506_n.webp' },
];
const SUGGESTED = [
  { id: 's1', name: 'Heritage Kurta',    price: 5900, image: '/media-pro/men/Design 1/651882421_122120769999151981_8209666213684742551_n.webp', slug: 'heritage-kurta',    r: 4.9 },
  { id: 's2', name: 'Signature Panjabi', price: 6800, image: '/media-pro/men/Design 1/650656536_122120770035151981_5282848327082156297_n.webp', slug: 'signature-panjabi', r: 5.0 },
  { id: 's3', name: 'Luxury Cord Set',   price: 7200, image: '/media-pro/women/Design 1/673191812_122125962327151981_8385571386878315506_n.webp', slug: 'luxury-cord-set',   r: 4.8 },
];

export default function CartPage() {
  const [cart, setCart]       = useState(INIT_CART);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const setQty = (id: number, q: number) => {
    if (q < 1) return;
    setCart(c => c.map(i => i.id === id ? { ...i, qty: q } : i));
  };
  const remove = (id: number) => setCart(c => c.filter(i => i.id !== id));

  const subtotal  = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const FREE      = 20000;
  const pct       = Math.min((subtotal / FREE) * 100, 100);
  const remaining = Math.max(FREE - subtotal, 0);
  const shipping  = remaining === 0 ? 0 : 120;
  const total     = subtotal + shipping;

  if (!mounted) return null;

  /* ── Empty ── */
  if (cart.length === 0) return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center gap-5 px-6 pb-36 lg:pb-0">
      <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center">
        <ShoppingBag className="w-7 h-7 text-neutral-400" />
      </div>
      <div className="text-center">
        <h1 className="text-lg font-black text-neutral-900 mb-1">Your bag is empty</h1>
        <p className="text-sm text-neutral-400">Add items to get started</p>
      </div>
      <Link href="/shop">
        <motion.button whileTap={{ scale: 0.97 }}
          className="bg-black text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest">
          Shop Now
        </motion.button>
      </Link>
    </main>
  );

  /* ── Shared section: Cart items + Suggestions ── */
  const ItemsSection = (
    <div className="flex-1 min-w-0">
      <AnimatePresence>
        {cart.map((item, i) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 50, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ delay: i * 0.05, type: 'spring', stiffness: 380, damping: 30 }}
            className="flex gap-3.5 py-4 border-b border-neutral-100 last:border-0 group"
          >
            <Link href={`/product/${item.id}`}
              className="relative w-[72px] h-[88px] sm:w-[84px] sm:h-[104px] shrink-0 bg-neutral-50 rounded-xl overflow-hidden">
              <Image src={item.image} alt={item.name} fill
                className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="96px" />
            </Link>

            <div className="flex-1 flex flex-col min-w-0 py-0.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-bold text-[13px] text-neutral-900 leading-snug">{item.name}</h3>
                  <p className="text-[10px] text-neutral-400 font-medium mt-0.5">{item.color} · Size {item.size}</p>
                </div>
                <motion.button whileTap={{ scale: 0.85 }} onClick={() => remove(item.id)}
                  className="w-6 h-6 rounded-full hover:bg-red-50 hover:text-red-400 text-neutral-300 flex items-center justify-center transition-colors shrink-0">
                  <X className="w-3 h-3" />
                </motion.button>
              </div>

              <div className="flex items-center justify-between mt-auto pt-3">
                <div className="flex items-center bg-neutral-100 rounded-lg overflow-hidden">
                  <motion.button whileTap={{ scale: 0.85 }} onClick={() => setQty(item.id, item.qty - 1)}
                    className="w-7 h-7 flex items-center justify-center text-neutral-500 hover:bg-neutral-200 transition-colors">
                    <Minus className="w-2.5 h-2.5" />
                  </motion.button>
                  <span className="w-6 text-center text-[12px] font-black">{item.qty}</span>
                  <motion.button whileTap={{ scale: 0.85 }} onClick={() => setQty(item.id, item.qty + 1)}
                    className="w-7 h-7 flex items-center justify-center text-neutral-500 hover:bg-neutral-200 transition-colors">
                    <Plus className="w-2.5 h-2.5" />
                  </motion.button>
                </div>
                <p className="text-sm font-black text-neutral-900">
                  <Counter value={item.price * item.qty} />
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* You may also like */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-7">
        <div className="flex items-center gap-2 mb-3.5">
          <Sparkles className="w-3 h-3 text-neutral-300" />
          <p className="text-[9px] font-black uppercase tracking-[0.22em] text-neutral-400">You May Also Like</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {SUGGESTED.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 + i * 0.06 }}>
              <Link href={`/product/${p.slug}`} className="group block">
                <div className="relative aspect-[3/4] bg-neutral-100 rounded-xl overflow-hidden mb-1.5">
                  <Image src={p.image} alt={p.name} fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="120px" />
                </div>
                <p className="text-[10px] font-bold text-neutral-800 truncate">{p.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="w-2 h-2 fill-amber-400 text-amber-400 shrink-0" />
                  <span className="text-[9px] text-neutral-400">{p.r}</span>
                  <span className="text-[10px] font-black text-neutral-900 ml-auto">৳{p.price.toLocaleString()}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );

  /* ── Shared Summary block ── */
  const Summary = ({ compact = false }: { compact?: boolean }) => (
    <div className={compact ? '' : 'w-full lg:w-[300px] xl:w-[320px] shrink-0 lg:sticky lg:top-24 lg:self-start'}>
      {/* Free shipping bar */}
      <div className={`flex items-center gap-2.5 mb-5 ${compact ? '' : 'bg-neutral-50 rounded-xl p-3.5 border border-neutral-100'}`}>
        <Truck className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <div className="flex-1">
          <div className="h-1 bg-neutral-200 rounded-full overflow-hidden mb-1">
            <motion.div
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className={`h-full rounded-full ${pct === 100 ? 'bg-emerald-500' : 'bg-black'}`}
            />
          </div>
          <p className="text-[9px] font-bold text-neutral-500">
            {remaining === 0 ? '🎉 Free shipping unlocked!' : `৳${remaining.toLocaleString()} more for free shipping`}
          </p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-2.5 mb-4">
        <div className="flex justify-between text-[12px]">
          <span className="text-neutral-500 font-medium">Subtotal</span>
          <span className="font-bold text-neutral-900"><Counter value={subtotal} /></span>
        </div>
        <div className="flex justify-between text-[12px]">
          <span className="text-neutral-500 font-medium">Shipping</span>
          {shipping === 0
            ? <span className="text-emerald-600 font-black text-[10px] uppercase tracking-wider">Free</span>
            : <span className="font-bold text-neutral-900">৳{shipping}</span>}
        </div>
      </div>

      {/* Total */}
      <div className="border-t border-neutral-100 pt-4 mb-5 flex justify-between items-end">
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Total</span>
        <span className="text-2xl font-black text-neutral-900"><Counter value={total} /></span>
      </div>

      {/* Promo */}
      <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-150 rounded-xl px-3.5 py-2.5 mb-3">
        <input type="text" placeholder="Promo / gift code"
          className="flex-1 bg-transparent text-[11px] font-bold text-neutral-800 placeholder:text-neutral-300 outline-none" />
        <button className="text-[9px] font-black uppercase tracking-widest text-neutral-400 hover:text-black transition-colors">Apply</button>
      </div>

      {/* CTA */}
      <Link href="/checkout" className="block">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-black text-white py-4 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 group"
        >
          Checkout
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </motion.button>
      </Link>

      {/* Trust */}
      <div className="flex items-center justify-center gap-5 mt-4">
        {[{ Icon: ShieldCheck, l: 'Secure Pay' }, { Icon: RotateCcw, l: 'Easy Returns' }, { Icon: Truck, l: 'Fast Ship' }]
          .map(({ Icon, l }) => (
            <div key={l} className="flex flex-col items-center gap-1">
              <Icon className="w-3.5 h-3.5 text-neutral-300" />
              <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider whitespace-nowrap">{l}</span>
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">

      {/* ══ HEADER AREA ══ */}
      <div className="pt-20 border-b border-neutral-100">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-8 py-4 flex items-baseline justify-between">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900">
            Your Bag
            <span className="ml-2 text-base font-bold text-neutral-300">({cart.length})</span>
          </h1>
          <Link href="/shop" className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-black transition-colors">
            ← Continue Shopping
          </Link>
        </div>
      </div>

      {/* ══ BODY ══ */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-8 pt-6
                      /* mobile bottom: leave room for sticky bar + mobile nav */
                      pb-[calc(175px+env(safe-area-inset-bottom))]
                      lg:pb-16">

        {/* Desktop: side-by-side */}
        <div className="hidden lg:flex gap-14 items-start">
          {ItemsSection}
          <Summary />
        </div>

        {/* Mobile: stacked, single column */}
        <div className="lg:hidden">
          {ItemsSection}
        </div>
      </div>

      {/* ══ MOBILE STICKY CHECKOUT BAR ══
          Sits above MobileBottomNav (57 px) with extra breathing room */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25, type: 'spring', stiffness: 320, damping: 28 }}
        className="lg:hidden fixed left-0 right-0 z-40
                   bg-white/97 backdrop-blur-xl border-t border-neutral-100
                   px-4 pt-3.5
                   bottom-[calc(57px+env(safe-area-inset-bottom))]"
      >
        {/* Mini summary row */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[8px] font-bold uppercase tracking-widest text-neutral-400 mb-0.5">Order Total</p>
            <p className="text-xl font-black text-neutral-900 leading-none"><Counter value={total} /></p>
          </div>
          {shipping === 0
            ? <span className="text-[8px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-full">Free Shipping</span>
            : <span className="text-[9px] text-neutral-400">+৳{shipping} ship</span>}
        </div>

        {/* Free shipping bar on mobile too */}
        <div className="h-0.5 bg-neutral-100 rounded-full overflow-hidden mb-3">
          <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
            className={`h-full ${pct === 100 ? 'bg-emerald-500' : 'bg-black'}`} />
        </div>

        <Link href="/checkout" className="block">
          <motion.button whileTap={{ scale: 0.98 }}
            className="w-full bg-black text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 mb-3">
            Checkout · <Counter value={total} prefix="" />
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </Link>
      </motion.div>

    </div>
  );
}
