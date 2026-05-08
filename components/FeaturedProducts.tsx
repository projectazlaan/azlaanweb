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

// Global Metadata for Editorial Feel
const CATEGORY_METADATA: Record<string, { tagline: string, subcategories: string[] }> = {
  Men: {
    tagline: "The Gentlemen's Choice",
    subcategories: ['Panjabi', 'Classic Kurtas', 'Formal Shirts', 'Chino Pants', 'Casual Edit', 'Traditional Wear', 'Premium Basics']
  },
  Women: {
    tagline: "The Premium Choice",
    subcategories: ['Luxury Pret', 'Unstitched', 'Saree', 'Bridal', 'Signature Series', 'Luxury Lawn', 'Festive Edit']
  },
  Kids: {
    tagline: "Exclusive Collection",
    subcategories: ['Boys Panjabi', 'Girls Wear', 'Festive Kids', 'Casuals']
  }
};

const CategoryRow = ({ title, products, direction }: { title: string, products: Product[], direction: 'left' | 'right' }) => {
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const speed = direction === 'left' ? 0.5 : -0.5
  const animationFrameRef = useRef<number | null>(null)

  // Duplicate products if list is short to ensure a rich bento grid
  const displayProducts = products.length < 10 ? [...products, ...products, ...products].slice(0, 12) : products;

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      const segmentWidth = scrollWidth / 3
      
      // Infinite loop logic for manual scrolling
      if (scrollLeft <= 10) {
        scrollRef.current.scrollLeft = segmentWidth + 10
      } else if (scrollLeft >= segmentWidth * 2) {
        scrollRef.current.scrollLeft = segmentWidth
      }

      setShowLeftArrow(scrollLeft > segmentWidth + 10)
      setShowRightArrow(scrollLeft < (segmentWidth * 2 - clientWidth - 10))
    }
  }

  // Auto-scroll logic
  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    const handleInteraction = () => {
      setIsPaused(true)
      const timer = setTimeout(() => setIsPaused(false), 3000)
      return () => clearTimeout(timer)
    }

    scrollContainer.addEventListener('wheel', handleInteraction, { passive: true })
    scrollContainer.addEventListener('touchstart', handleInteraction, { passive: true })
    scrollContainer.addEventListener('mousedown', handleInteraction, { passive: true })
    
    const animate = () => {
      if (!isPaused && scrollContainer) {
        scrollContainer.scrollLeft += speed
        
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainer
        const segmentWidth = scrollWidth / 3

        if (direction === 'left' && scrollLeft >= segmentWidth * 2) {
          scrollContainer.scrollLeft = segmentWidth
        } else if (direction === 'right' && scrollLeft <= segmentWidth) {
          scrollContainer.scrollLeft = segmentWidth * 2 - clientWidth
        }
      }
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      scrollContainer.removeEventListener('wheel', handleInteraction)
    }
  }, [isPaused, speed, direction])

  useEffect(() => {
    const ref = scrollRef.current
    if (ref) {
      ref.addEventListener('scroll', checkScroll)
      checkScroll()
      setTimeout(() => {
        if (ref) {
          const segmentWidth = ref.scrollWidth / 3
          ref.scrollLeft = direction === 'left' ? segmentWidth : segmentWidth * 2 - ref.clientWidth
        }
      }, 100)
    }
    return () => ref?.removeEventListener('scroll', checkScroll)
  }, [direction])

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current
      const scrollAmount = dir === 'left' ? -clientWidth : clientWidth
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  if (displayProducts.length === 0) return null

  // Generate Bento Blocks
  const blocks = [];
  const pattern = [1, 2, 3]; // Single, Stacked2, Grid3
  let pIdx = 0;
  let i = 0;
  while (i < displayProducts.length) {
    const take = pattern[pIdx % pattern.length];
    if (take === 1 || i + 1 > displayProducts.length) {
      blocks.push({ type: 'single', items: [displayProducts[i]], startIndex: i });
      i += 1;
    } else if (take === 2) {
      if (i + 1 < displayProducts.length) {
        blocks.push({ type: 'stacked2', items: [displayProducts[i], displayProducts[i+1]], startIndex: i });
        i += 2;
      } else {
        blocks.push({ type: 'single', items: [displayProducts[i]], startIndex: i });
        i += 1;
      }
    } else if (take === 3) {
      if (i + 2 < displayProducts.length) {
        blocks.push({ type: 'grid3', items: [displayProducts[i], displayProducts[i+1], displayProducts[i+2]], startIndex: i });
        i += 3;
      } else if (i + 1 < displayProducts.length) {
        blocks.push({ type: 'stacked2', items: [displayProducts[i], displayProducts[i+1]], startIndex: i });
        i += 2;
      } else {
        blocks.push({ type: 'single', items: [displayProducts[i]], startIndex: i });
        i += 1;
      }
    }
    pIdx++;
  }

  const renderCard = (product: Product, index: number, isSmall: boolean = false) => {
    if (!product) return null;
    const metadata = CATEGORY_METADATA[title] || CATEGORY_METADATA['Kids'];
    const subCategoryTitle = metadata.subcategories[index % metadata.subcategories.length] || `Exclusive Edit ${index + 1}`;
    const subCategoryContext = "Explore the finest collection curated for luxury and elegance.";

    return (
      <div
        key={`${product.id}-${index}-${isSmall}`}
        className="rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer group w-full h-full relative border border-gray-100 bg-gray-50"
      >
        <Link 
          href={`/${title.toLowerCase()}/${subCategoryTitle.toLowerCase().replace(/ /g, '-')}`} 
          className="absolute inset-0 z-10"
        />
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={product?.image || (product?.images && product?.images[0]) || ''}
            alt={subCategoryTitle}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 75vw, 30vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
          <div className={`absolute inset-0 ${isSmall ? 'p-3 md:p-4' : 'p-4 md:p-6'} flex flex-col justify-end pointer-events-none`}>
            <div className="relative z-20 w-full">
              <h3 className={`font-sans ${isSmall ? 'text-lg md:text-xl' : 'text-xl md:text-2xl lg:text-3xl'} font-bold tracking-tight mb-0.5 md:mb-1 text-white leading-tight drop-shadow-md`}>
                {subCategoryTitle}
              </h3>
              <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                {!isSmall && (
                  <p className="text-[10px] md:text-xs text-white/90 font-medium max-w-[95%] mb-2 leading-tight">
                    {subCategoryContext}
                  </p>
                )}
                <span className={`inline-block ${isSmall ? 'text-[7px] mt-0.5' : 'text-[8px] md:text-[9px] mt-1'} font-semibold tracking-widest uppercase text-white border-b border-white pb-0.5`}>
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
    <div className="mb-0 relative pt-3 md:pt-4">
      <div className="flex flex-col items-start mb-3 md:mb-4 px-4 md:px-0">
        <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-gray-500">
          {CATEGORY_METADATA[title]?.tagline || "Exclusive Collection"}
        </span>
        <div className="flex items-baseline gap-4 md:gap-6 w-full mt-0">
          <h2 className="flex items-baseline gap-1.5 md:gap-2 leading-none">
            <span className="font-sans font-extrabold text-2xl md:text-4xl uppercase tracking-tighter text-primary leading-none">
              {title}
            </span>
            <span className="font-serif italic font-light text-lg md:text-2xl text-gray-500 capitalize leading-none">
              Series
            </span>
          </h2>
          <Link href={`/${title.toLowerCase()}`} className="group flex items-center gap-1 text-primary border-b border-black/20 hover:border-black transition-all text-[8px] md:text-[10px] font-bold uppercase tracking-widest">
            <span>Explore Categories</span>
            <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      <div className="relative">
        <AnimatePresence>
          {showLeftArrow && (
            <button onClick={(e) => { e.stopPropagation(); scroll('left'); }} className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-[50] w-11 h-11 items-center justify-center rounded-full bg-white shadow-lg border border-black/10 hover:bg-black hover:text-white transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showRightArrow && (
            <button onClick={(e) => { e.stopPropagation(); scroll('right'); }} className="hidden md:flex absolute right-4 lg:left-8 top-1/2 -translate-y-1/2 z-[50] w-11 h-11 items-center justify-center rounded-full bg-white shadow-lg border border-black/10 hover:bg-black hover:text-white transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </AnimatePresence>

        <div 
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchMove={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="flex overflow-x-auto gap-3 md:gap-5 pb-8 pt-0.5 px-4 md:px-0 scrollbar-hide items-stretch will-change-scroll"
        >
          {[...blocks, ...blocks, ...blocks].map((block, bIdx) => {
            const hClass = "h-[520px] md:h-[560px]";
            if (block.type === 'single') {
              return (
                <div key={bIdx} className={`min-w-[75vw] md:min-w-[30vw] lg:min-w-[22vw] flex-shrink-0 ${hClass}`}>
                  {renderCard(block.items[0], block.startIndex)}
                </div>
              );
            }
            if (block.type === 'stacked2') {
              return (
                <div key={bIdx} className={`min-w-[80vw] md:min-w-[30vw] lg:min-w-[24vw] flex-shrink-0 ${hClass} flex flex-col gap-3 md:gap-4`}>
                  <div className="flex-1 w-full relative">{renderCard(block.items[0], block.startIndex, true)}</div>
                  <div className="flex-1 w-full relative">{renderCard(block.items[1], block.startIndex + 1, true)}</div>
                </div>
              );
            }
            if (block.type === 'grid3') {
              return (
                <div key={bIdx} className={`min-w-[95vw] md:min-w-[55vw] lg:min-w-[45vw] flex-shrink-0 ${hClass} grid grid-cols-2 gap-3 md:gap-4`}>
                  <div className="col-span-1 h-full relative">{renderCard(block.items[0], block.startIndex)}</div>
                  <div className="col-span-1 flex flex-col gap-3 md:gap-4 h-full">
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
    if (!initialProducts) fetchProducts()
  }, [initialProducts])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      if (res.ok) setProducts(await res.json())
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['Men', 'Women']
  if (loading) return null

  return (
    <section className="pb-10 md:pb-16 pt-0 px-0 md:px-2 bg-section-bg overflow-hidden">
      <div className="max-w-full mx-auto">
        {categories.map((cat, idx) => (
          <div key={cat}>
            <CategoryRow 
              title={cat} 
              products={products.filter(p => (p as any).category === cat || p.categorySlug === cat.toLowerCase())} 
              direction={idx % 2 === 0 ? 'left' : 'right'}
            />
            {cat === 'Women' && (
              <div className="my-12 md:my-20">
                <TrendingPanel />
              </div>
            )}
          </div>
        ))}
        <AllProductsPanel />
      </div>
    </section>
  )
}
