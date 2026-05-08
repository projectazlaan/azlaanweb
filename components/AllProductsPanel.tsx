'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'
import { Product } from '@/types'
export default function AllProductsPanel() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    // Directly use productsData for reliability
    import('@/data/products.json').then((data) => {
      const allProducts = data.default as any[];
      const updateCount = () => {
        const width = window.innerWidth;
        let count = 4; // Mobile: 2 cols * 2 rows = 4
        if (width >= 1280) count = 12; // xl: 6 cols * 2 rows = 12
        else if (width >= 1024) count = 10; // lg: 5 cols * 2 rows = 10
        else if (width >= 768) count = 8; // md: 4 cols * 2 rows = 8
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
    <section className="pt-[15px] pb-[15px] bg-section-bg px-4 md:px-8 lg:px-12">
      <div className="w-full">
        {/* Header - Centered with New Collection Style */}
        <div className="flex flex-col items-center text-center mb-[15px]">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center leading-[0.85] md:leading-[0.8]"
          >
            <span className="font-serif italic text-2xl md:text-3xl text-gray-400 font-light tracking-wider pr-8 md:pr-12 -mb-1 md:-mb-2 z-10">
              Explore Our
            </span>
            <span className="font-sans text-4xl md:text-5xl font-bold tracking-tighter text-primary uppercase drop-shadow-sm">
              Entire Collection
            </span>
          </motion.h2>
          <p className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-gray-400 mt-[6px]">
            Premium Craftsmanship • Timeless Essentials
          </p>
        </div>
        {/* Grid - Edge to Edge */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} viewMode="grid" />
          ))}
        </div>
        {/* See More Button - Minimal Style */}
        <div className="mt-8 md:mt-12 flex justify-center">
          <Link
            href="/shop"
            className="group flex items-center gap-3 bg-white text-black border border-black hover:bg-black hover:text-white px-8 py-3 rounded-full font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-sm"
          >
            <span>See More Products</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  )
}
