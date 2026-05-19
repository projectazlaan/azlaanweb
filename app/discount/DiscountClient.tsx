'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, TrendingDown } from 'lucide-react';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';

interface DiscountClientProps {
  initialProducts: Product[];
}

export default function DiscountClient({ initialProducts }: DiscountClientProps) {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  // Stagger variants for the product grid
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
  };

  return (
    <main className="min-h-screen bg-[#faf9f6] pb-24">
      {/* ── Super Dynamic Hero Section ── */}
      <section className="relative w-full overflow-hidden bg-black py-20 md:py-32 flex flex-col items-center justify-center rounded-b-[3rem] shadow-2xl">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1], 
              rotate: [0, 90, 0],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/2 -left-1/4 w-full h-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 blur-[120px] rounded-full mix-blend-screen"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1], 
              rotate: [0, -90, 0],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-[120px] rounded-full mix-blend-screen"
          />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center gap-3 px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-white text-[10px] md:text-xs font-black uppercase tracking-[0.3em]">
              Exclusive Markdown Event
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, type: "spring", bounce: 0.4 }}
            className="relative"
          >
            <h1 className="text-6xl md:text-[10rem] font-sans font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-neutral-200 to-neutral-500 uppercase leading-[0.8] drop-shadow-2xl">
              Sale
            </h1>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -top-4 -right-4 md:-top-8 md:-right-8 w-16 h-16 md:w-24 md:h-24 bg-amber-500 rounded-full flex flex-col items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.5)] border-4 border-black"
            >
              <TrendingDown className="w-5 h-5 md:w-8 md:h-8 text-black mb-0.5" strokeWidth={3} />
              <span className="text-[9px] md:text-xs font-black text-black leading-none">UPTO</span>
            </motion.div>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-neutral-400 text-sm md:text-base font-medium max-w-lg mt-8 md:mt-12 leading-relaxed"
          >
            Discover our curated selection of premium pieces at exceptional prices. 
            Limited stock available across all categories.
          </motion.p>
        </div>
      </section>

      {/* ── Dynamic Product Grid ── */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-8 mt-16 md:mt-24">
        <div className="flex items-center justify-between mb-8 md:mb-12 border-b border-black/[0.05] pb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl md:text-4xl font-black font-sans tracking-tight text-neutral-900">
              All Offers
            </h2>
            <div className="hidden md:flex px-3 py-1 rounded-full bg-black/5 items-center justify-center">
              <span className="text-xs font-bold text-neutral-600">{initialProducts.length} Items</span>
            </div>
          </div>
        </div>

        {initialProducts.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-16"
          >
            {initialProducts.map((product) => (
              <motion.div 
                key={product.id} 
                variants={itemVariants}
                onMouseEnter={() => setHoveredProduct(product.id.toString())}
                onMouseLeave={() => setHoveredProduct(null)}
                className="relative group"
              >
                {/* Advanced Glowing Hover Effect */}
                {hoveredProduct === product.id.toString() && (
                  <motion.div 
                    layoutId="hoverGlow"
                    className="absolute -inset-4 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.06)] -z-10 pointer-events-none hidden md:block"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <ProductCard product={product} viewMode="grid" />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10 text-neutral-300" />
            </div>
            <h3 className="text-2xl font-black text-neutral-800 mb-2">No active sales right now</h3>
            <p className="text-neutral-500 font-medium">Check back later for exclusive discounts on our premium collections.</p>
          </div>
        )}
      </section>
    </main>
  );
}
