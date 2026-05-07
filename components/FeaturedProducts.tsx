'use client'

import { Heart, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import ReelsPanel from './ReelsPanel'
import TrendingPanel from './TrendingPanel'
import NewCollectionPanel from './NewCollectionPanel'
import AllProductsPanel from './AllProductsPanel'

import { Product } from '@/types';

const CategoryRow = ({ title, products }: { title: string, products: Product[] }) => {
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    const ref = scrollRef.current
    if (ref) {
      ref.addEventListener('scroll', checkScroll)
      checkScroll()
    }
    return () => ref?.removeEventListener('scroll', checkScroll)
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current
      const scrollAmount = direction === 'left' ? -clientWidth : clientWidth
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  if (products.length === 0) return null

  const getTagline = (cat: string) => {
    switch(cat) {
      case 'Men': return "The Gentlemen's Choice";
      case 'Women': return "The Premium Choice";
      default: return "Exclusive Collection";
    }
  }

  const subCategoryNames: Record<string, string[]> = {
    Men: ['Panjabi', 'Classic Kurtas', 'Formal Shirts', 'Chino Pants', 'Casual Edit'],
    Women: ['Luxury Pret', 'Unstitched', 'Saree', 'Bridal', 'Signature Series'],
    Kids: ['Boys Panjabi', 'Girls Wear', 'Festive Kids', 'Casuals'],
    Fabric: ['Premium Silk', 'Luxury Cotton', 'Imported Linen', 'Designer Wool', 'Traditional Weaves']
  };

  // Safely group products into bento blocks (Pattern: 1 item, 2 items, 3 items...)
  const blocks = [];
  const pattern = [1, 2, 3];
  let pIdx = 0;
  let i = 0;
  
  while (i < products.length) {
    const take = pattern[pIdx % pattern.length];
    
    if (take === 1 || i + 1 > products.length) {
      blocks.push({ type: 'single', items: [products[i]], startIndex: i });
      i += 1;
    } else if (take === 2) {
      if (i + 1 < products.length) {
        blocks.push({ type: 'stacked2', items: [products[i], products[i+1]], startIndex: i });
        i += 2;
      } else {
        blocks.push({ type: 'single', items: [products[i]], startIndex: i });
        i += 1;
      }
    } else if (take === 3) {
      if (i + 2 < products.length) {
        blocks.push({ type: 'grid3', items: [products[i], products[i+1], products[i+2]], startIndex: i });
        i += 3;
      } else if (i + 1 < products.length) {
        blocks.push({ type: 'stacked2', items: [products[i], products[i+1]], startIndex: i });
        i += 2;
      } else {
        blocks.push({ type: 'single', items: [products[i]], startIndex: i });
        i += 1;
      }
    }
    pIdx++;
  }

  const renderCard = (product: Product, index: number, isSmall: boolean = false) => {
    if (!product) return null; // Safety check
    
    const subCategoryTitle = subCategoryNames[title]?.[index % (subCategoryNames[title]?.length || 1)] || `Category ${index + 1}`;
    const subCategoryContext = "Explore the finest collection curated for luxury and elegance.";

    return (
      <div
        key={product.id || index}
        data-customizable
        data-custom-key={`categoryCard_${product?.id}`}
        className="rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer group w-full h-full relative border border-gray-100"
      >
        <Link 
          href={`/${title.toLowerCase()}/${subCategoryTitle.toLowerCase().replace(/ /g, '-')}`} 
          className="absolute inset-0 z-10"
          prefetch={true}
        />

        <div className="absolute inset-0 w-full h-full bg-gray-100">
          <Image
            src={product?.image || (product?.images && product?.images[0]) || ''}
            alt={subCategoryTitle}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 75vw, (max-width: 1024px) 32vw, 24vw"
            priority={index < 2}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className={`absolute inset-0 ${isSmall ? 'p-3 md:p-4' : 'p-4 md:p-6'} flex flex-col justify-end pointer-events-none`}>
            <div className="relative z-20 w-full">
              <h3 
                className={`font-sans ${isSmall ? 'text-lg md:text-xl' : 'text-xl md:text-2xl lg:text-3xl'} font-bold tracking-tight mb-0.5 md:mb-1 text-white leading-[1.1] drop-shadow-lg transform group-hover:-translate-y-1 transition-transform duration-500`}
              >
                {subCategoryTitle}
              </h3>
              
              <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                {!isSmall && (
                  <p className="text-[10px] md:text-xs text-white/90 font-medium max-w-[95%] mb-2 drop-shadow-md leading-tight">
                    {subCategoryContext}
                  </p>
                )}
                <span className={`inline-block ${isSmall ? 'text-[7px] mt-0.5' : 'text-[8px] md:text-[9px] mt-1'} font-semibold tracking-[0.2em] uppercase text-white border-b border-white pb-0.5 drop-shadow-md`}>
                  Discover
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mb-0 last:mb-0 relative group pt-3 md:pt-4">
      
      {/* Super Premium Category Heading - Ultra Compact */}
      <div className="flex flex-col items-start mb-3 md:mb-4 px-2 md:px-0 gap-0">
        <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-gray-500 block">
          {getTagline(title)}
        </span>
        <div className="flex items-baseline gap-4 md:gap-6 w-full flex-wrap mt-0">
          <h2 className="flex items-baseline gap-1.5 md:gap-2 leading-none">
            <span className="font-sans font-extrabold text-2xl md:text-4xl uppercase tracking-tighter text-primary drop-shadow-sm leading-none">
              {title}
            </span>
            <span className="font-serif italic font-light text-lg md:text-2xl tracking-normal text-gray-500 capitalize leading-none">
              Series
            </span>
          </h2>
          
          <Link 
            href={title === 'Men' ? '/men' : title === 'Women' ? '/women' : '#'}
            className="group flex items-center gap-1 bg-transparent text-primary pb-0.5 border-b border-black/20 hover:border-black transition-all duration-300 text-[8px] md:text-[10px] font-bold uppercase tracking-widest shrink-0 mb-0.5"
          >
            <span>Explore Categories</span>
            <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      <div className="relative">
        {/* Navigation Arrows - Desktop Only */}
        <AnimatePresence>
          {showLeftArrow && (
            <button
              onClick={(e) => { e.stopPropagation(); scroll('left'); }}
              aria-label="Previous"
              className="
                hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-[50]
                w-11 h-11 items-center justify-center rounded-full
                bg-white shadow-lg border border-black/10
                hover:bg-black hover:text-white hover:border-black
                transition-all duration-200 group
              "
            >
              <ChevronLeft className="w-5 h-5 text-black group-hover:text-white transition-colors" />
            </button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showRightArrow && (
            <button
              onClick={(e) => { e.stopPropagation(); scroll('right'); }}
              aria-label="Next"
              className="
                hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-[50]
                w-11 h-11 items-center justify-center rounded-full
                bg-white shadow-lg border border-black/10
                hover:bg-black hover:text-white hover:border-black
                transition-all duration-200 group
              "
            >
              <ChevronRight className="w-5 h-5 text-black group-hover:text-white transition-colors" />
            </button>
          )}
        </AnimatePresence>

        {/* Scrollable Container - Bento Grid Layout */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-1.5 md:gap-2 pb-2 pt-0.5 px-2 md:px-0 scrollbar-hide snap-x snap-mandatory scroll-smooth items-stretch"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {blocks.map((block, bIdx) => {
            if (block.type === 'single') {
              return (
                <div key={bIdx} className="min-w-[75vw] md:min-w-[30vw] lg:min-w-[22vw] flex-shrink-0 snap-center h-[520px] md:h-[560px]">
                  {renderCard(block.items[0], block.startIndex)}
                </div>
              );
            }
            if (block.type === 'stacked2') {
              return (
                <div key={bIdx} className="min-w-[80vw] md:min-w-[30vw] lg:min-w-[24vw] flex-shrink-0 snap-center h-[520px] md:h-[560px] flex flex-col gap-2 md:gap-3">
                  <div className="flex-1 w-full relative">{renderCard(block.items[0], block.startIndex, true)}</div>
                  <div className="flex-1 w-full relative">{renderCard(block.items[1], block.startIndex + 1, true)}</div>
                </div>
              );
            }
            if (block.type === 'grid3') {
              return (
                <div key={bIdx} className="min-w-[95vw] md:min-w-[55vw] lg:min-w-[45vw] flex-shrink-0 snap-center h-[520px] md:h-[560px] grid grid-cols-2 gap-2 md:gap-3">
                  <div className="col-span-1 h-full relative">
                    {renderCard(block.items[0], block.startIndex)}
                  </div>
                  <div className="col-span-1 flex flex-col gap-2 md:gap-3 h-full">
                    <div className="flex-1 w-full relative">{renderCard(block.items[1], block.startIndex + 1, true)}</div>
                    <div className="flex-1 w-full relative">{renderCard(block.items[2], block.startIndex + 2, true)}</div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  )
}

export default function FeaturedProducts({ initialProducts }: { initialProducts?: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts || [])
  const [loading, setLoading] = useState(!initialProducts)

  useEffect(() => {
    if (!initialProducts) {
      fetchProducts()
    }
  }, [initialProducts])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      if (res.ok) {
        const data = await res.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['Men', 'Women', 'Fabric']

  if (loading) {
    return (
      <section className="pb-16 md:pb-24 pt-2 px-0 md:px-2 bg-section-bg overflow-hidden">
        <div className="max-w-full mx-auto">
          {categories.map((cat) => (
            <div key={`skeleton-${cat}`}>
               {/* Skeleton Row */}
               <div className="mb-[1px] relative group pt-6 md:pt-10 px-4 md:px-0">
                  <div className="h-6 w-32 bg-gray-200 rounded mb-6 animate-pulse"></div>
                  <div className="flex gap-2 md:gap-3 overflow-hidden px-2 md:px-0">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="min-w-[75vw] md:min-w-[30vw] lg:min-w-[22vw] h-[520px] md:h-[560px] bg-gray-100 rounded-xl animate-pulse"></div>
                    ))}
                  </div>
               </div>
               {cat === 'Women' && (
                 <>
                   <ReelsPanel />
                   <TrendingPanel />
                   <NewCollectionPanel />
                   <AllProductsPanel />
                 </>
               )}
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section 
      data-customizable 
      data-custom-key="productsSection"
      className="pb-2 md:pb-4 pt-0 px-0 md:px-2 bg-section-bg overflow-hidden"
    >
      <div className="max-w-full mx-auto">
        {categories.map((cat) => (
          <div key={cat}>
            <CategoryRow 
              title={cat} 
              products={products.filter(p => (p as any).category === cat || p.categorySlug === cat.toLowerCase())} 
            />
            {cat === 'Women' && (
              <>
                <ReelsPanel />
                <TrendingPanel />
                <NewCollectionPanel />
                <AllProductsPanel />
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
