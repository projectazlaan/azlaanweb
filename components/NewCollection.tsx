'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'
import { Product } from '@/types'

export default function NewCollection() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch products and slice for "New Collection" (e.g., first 8-12 products)
    import('@/data/products.json').then((data) => {
      const allProducts = data.default as any[];
      const updateCount = () => {
        const width = window.innerWidth;
        let count = 4; // Mobile: 2 cols * 2 rows
        if (width >= 1280) count = 12; 
        else if (width >= 1024) count = 10;
        else if (width >= 768) count = 8;
        setProducts(allProducts.slice(0, count));
      };
      updateCount();
      window.addEventListener('resize', updateCount);
      setLoading(false);
      return () => window.removeEventListener('resize', updateCount);
    })
  }, [])

  if (loading) return null

  return (
    <section className="relative z-[100] pt-0 pb-0 bg-white px-4 md:px-8 lg:px-12">
      <div className="w-full">
        {/* Header - Matching "Entire Collection" Style */}
        <div className="flex flex-col items-center text-center mb-8 md:mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center leading-[0.85] md:leading-[0.8]"
          >
            <span className="font-serif italic text-2xl md:text-3xl text-gray-400 font-light tracking-wider pr-8 md:pr-12 -mb-1 md:-mb-2 z-10">
              New
            </span>
            <span className="font-sans text-4xl md:text-5xl font-bold tracking-tighter text-primary uppercase drop-shadow-sm">
              Collection
            </span>
          </motion.h2>
          <div className="flex items-center justify-center gap-3 md:gap-4 mt-4 md:mt-6">
            <div className="h-[1px] w-4 md:w-8 bg-black/20" />
            <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-gray-500">
              Fresh Arrivals 2026
            </span>
            <div className="h-[1px] w-4 md:w-8 bg-black/20" />
          </div>
        </div>

        {/* Grid of Products */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-1.5 md:gap-x-3 gap-y-6 md:gap-y-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} viewMode="grid" />
          ))}
        </div>

        {/* Action Button - Matching View All Category Style */}
        <div className="mt-[25px] mb-[25px] flex justify-center">
          <Link
            href="/shop"
            className="group relative flex items-center gap-3 px-8 py-2.5 rounded-full border border-black/20 hover:border-black/40 bg-white transition-all duration-700 overflow-hidden shadow-sm"
          >
            <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-black/80 group-hover:text-black transition-colors">
              Explore All Arrivals
            </span>
            <div className="w-8 md:w-12 h-[0.5px] bg-black/30 group-hover:bg-black group-hover:w-16 transition-all duration-700" />
            <ArrowRight className="w-4 h-4 text-black/60 group-hover:text-black group-hover:translate-x-1 transition-all duration-500" />
            <div className="absolute inset-0 bg-black/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          </Link>
        </div>


      </div>
    </section>
  )
}
