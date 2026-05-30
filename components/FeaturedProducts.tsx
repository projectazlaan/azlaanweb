'use client'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import ReelsPanel from './ReelsPanel'
import TrendingPanel from './TrendingPanel'
import NewCollectionPanel from './NewCollectionPanel'
import AllProductsPanel from './AllProductsPanel'
import { Product } from '@/types';

// Global Metadata for Editorial Feel
const CATEGORY_METADATA: Record<string, { tagline: string, description: string, subcategories: string[], bannerImage: string, accentColor: string, tickerWords: string[] }> = {
  Men: {
    tagline: "The Gentlemen's Choice",
    description: "Impeccable craftsmanship meets contemporary style. Explore our premium traditional wear and modern essentials curated for the modern man.",
    subcategories: ['Panjabi', 'Classic Kurtas', 'Formal Shirts', 'Chino Pants', 'Casual Edit', 'Traditional Wear', 'Premium Basics'],
    bannerImage: '/media-pro/men/Design 5/650905571_122120824035151981_4320891712881698677_n.webp',
    accentColor: '#c9a96e',
    tickerWords: ['ELEVATED · ', 'TIMELESS · ', 'REFINED · ', 'CURATED · ', 'PREMIUM · ', 'CLASSIC · ']
  },
  Women: {
    tagline: "The Premium Choice",
    description: "Grace, elegance, and luxury redefined. Discover exquisite designs, fine fabrics, and signature collections crafted for every occasion.",
    subcategories: ['Luxury Pret', 'Unstitched', 'Saree', 'Bridal', 'Signature Series', 'Luxury Lawn', 'Festive Edit'],
    bannerImage: '/media-pro/women/Design 2/672121181_122125885095151981_7790861692313383598_n.webp',
    accentColor: '#d4a5c9',
    tickerWords: ['ELEGANT · ', 'LUXURIOUS · ', 'GRACEFUL · ', 'OPULENT · ', 'FEMININE · ', 'BESPOKE · ']
  },
  Kids: {
    tagline: "Exclusive Collection",
    description: "Vibrant, playful, and comfortable styles. Outfits crafted to bring joy and color to your little one's everyday adventures.",
    subcategories: ['Boys Panjabi', 'Girls Wear', 'Festive Kids', 'Casuals'],
    bannerImage: '/media-pro/cover/cover 3.jpg',
    accentColor: '#a8d5ba',
    tickerWords: ['PLAYFUL · ', 'VIBRANT · ', 'ADORABLE · ', 'FESTIVE · ', 'BRIGHT · ', 'JOYFUL · ']
  }
};

// Super Advanced Responsive Banner for each category header
const CategoryBanner = ({ title }: { title: string }) => {
  const meta = CATEGORY_METADATA[title] || CATEGORY_METADATA['Kids'];
  const tickerFull = [...meta.tickerWords, ...meta.tickerWords, ...meta.tickerWords, ...meta.tickerWords].join('');
  const bannerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: bannerRef, offset: ["start end", "end start"] });
  const yImage = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const yContent = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

  return (
    <div ref={bannerRef} className="relative w-full overflow-hidden rounded-[2rem] md:rounded-[2.5rem] group bg-black h-[220px] sm:h-[260px] md:h-[280px] lg:h-[300px] mb-4 md:mb-6 shadow-2xl border border-white/5">
      {/* Background image with hover zoom & parallax */}
      <motion.div style={{ y: yImage }} className="absolute inset-0 w-full h-[130%] -top-[15%]">
        <Image
          src={meta.bannerImage}
          alt={title}
          fill
          className="object-cover object-[center_35%] transition-transform duration-[2s] ease-out group-hover:scale-[1.03]"
          priority
          sizes="(max-width: 768px) 100vw, 90vw"
        />
      </motion.div>
      {/* Gradients for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 opacity-80" />
      
      {/* Glassmorphic advanced content card */}
      <motion.div style={{ y: yContent }} className="absolute inset-y-0 left-0 z-20 flex flex-col justify-center p-4 md:p-8 lg:p-12 w-full md:w-[65%] lg:w-[55%]">
        <div className="relative backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-2xl overflow-hidden group-hover:bg-white/[0.06] transition-all duration-700">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <div className="relative z-10">
            <span className="inline-block px-4 py-1.5 mb-4 text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] text-white/90 bg-black/40 backdrop-blur-md rounded-full border border-white/10 shadow-lg" style={{ boxShadow: `0 4px 20px -5px ${meta.accentColor}40` }}>
              {meta.tagline}
            </span>
            <h2 className="flex flex-col gap-0 mb-4 md:mb-6">
              <span className="font-sans font-black text-4xl sm:text-5xl md:text-7xl lg:text-8xl uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40 drop-shadow-2xl leading-[0.9]">
                {title}
              </span>
              <span className="font-serif italic font-light text-2xl md:text-4xl lg:text-5xl text-white/60 leading-none mt-1">
                Collections
              </span>
            </h2>
            <p className="text-white/70 text-xs md:text-sm lg:text-base max-w-md mb-8 leading-relaxed font-light tracking-wide">
              {meta.description}
            </p>
            <Link 
              href={`/${title.toLowerCase()}`}
              className="inline-flex items-center gap-4 px-7 py-3.5 bg-white text-black text-[10px] md:text-xs font-black uppercase tracking-[0.25em] rounded-full hover:bg-transparent hover:text-white border border-transparent hover:border-white/50 transition-all duration-500 shadow-xl group/btn w-fit overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-[1.5s]" />
              <span className="relative z-10">Explore Collection</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform duration-500 relative z-10" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Dynamic Ticker Animation */}
      <div className="absolute right-0 top-0 bottom-0 z-15 hidden md:flex items-center justify-center overflow-hidden w-[40%] pointer-events-none">
        <div
          className="whitespace-nowrap text-[12px] md:text-[14px] font-black uppercase tracking-[0.5em] select-none opacity-20 rotate-90 origin-center translate-x-16 md:translate-x-24"
          style={{
            color: '#ffffff',
            textShadow: `0 0 30px ${meta.accentColor}, 0 0 60px ${meta.accentColor}`,
            animation: 'bannerTicker 18s linear infinite',
            willChange: 'transform'
          }}
        >
          {tickerFull}
        </div>
      </div>
      
      {/* Bottom glowing aura */}
      <div
        className="absolute bottom-0 inset-x-0 h-2 z-20 opacity-80"
        style={{ background: `linear-gradient(to right, transparent, ${meta.accentColor}, transparent)`, filter: 'blur(4px)' }}
      />
      <div
        className="absolute bottom-0 inset-x-0 h-px z-20 opacity-100"
        style={{ background: `linear-gradient(to right, transparent, ${meta.accentColor}, transparent)` }}
      />
    </div>
  );
};

const CategoryRow = ({ title, products, direction }: { title: string, products: Product[], direction: 'left' | 'right' }) => {
  const router = useRouter()
  const sectionRef = useRef<HTMLDivElement>(null)
  const stripRef  = useRef<HTMLDivElement>(null)

  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  // Track vertical scroll progress
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // We track the previous progress to calculate deltas
  // Initializing with .get() avoids jumps on first scroll event
  const prevProgress = useRef<number>(scrollYProgress.get())

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (stripRef.current) {
      const delta = latest - prevProgress.current
      prevProgress.current = latest
      
      const maxShift = stripRef.current.scrollWidth - stripRef.current.clientWidth
      if (maxShift <= 0) return
      
      // Multiplier ensures the total scroll amount matches a proportion of the maxShift
      // 0.4 means the carousel will slide 40% of its hidden width during the vertical scroll
      const shift = delta * (maxShift * 0.4)
      
      if (direction === 'left') {
        stripRef.current.scrollLeft += shift
      } else {
        stripRef.current.scrollLeft -= shift
      }
    }
  })

  const checkScroll = () => {
    if (stripRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = stripRef.current
      setShowLeftArrow(scrollLeft > 10)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    const ref = stripRef.current
    if (ref) {
      ref.addEventListener('scroll', checkScroll)
      checkScroll()
      
      // Initial scroll set for right direction to start at the end
      if (direction === 'right') {
        const { scrollWidth, clientWidth } = ref
        ref.scrollLeft = scrollWidth - clientWidth
      }
    }
    return () => ref?.removeEventListener('scroll', checkScroll)
  }, [direction, products])

  const scroll = (dir: 'left' | 'right') => {
    if (stripRef.current) {
      const { clientWidth } = stripRef.current
      const scrollAmount = dir === 'left' ? -clientWidth : clientWidth
      stripRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const displayProducts = products.length < 10
    ? [...products, ...products, ...products, ...products].slice(0, 15)
    : products

  if (displayProducts.length === 0) return null

  // Generate Bento Blocks
  const blocks: { type: string; items: Product[]; startIndex: number }[] = []
  const pattern = [1, 2, 3]
  let pIdx = 0, i = 0
  while (i < displayProducts.length) {
    const take = pattern[pIdx % pattern.length]
    if (take === 1 || i + 1 > displayProducts.length) {
      blocks.push({ type: 'single', items: [displayProducts[i]], startIndex: i }); i += 1
    } else if (take === 2) {
      if (i + 1 < displayProducts.length) {
        blocks.push({ type: 'stacked2', items: [displayProducts[i], displayProducts[i+1]], startIndex: i }); i += 2
      } else { blocks.push({ type: 'single', items: [displayProducts[i]], startIndex: i }); i += 1 }
    } else {
      if (i + 2 < displayProducts.length) {
        blocks.push({ type: 'grid3', items: [displayProducts[i], displayProducts[i+1], displayProducts[i+2]], startIndex: i }); i += 3
      } else if (i + 1 < displayProducts.length) {
        blocks.push({ type: 'stacked2', items: [displayProducts[i], displayProducts[i+1]], startIndex: i }); i += 2
      } else { blocks.push({ type: 'single', items: [displayProducts[i]], startIndex: i }); i += 1 }
    }
    pIdx++
  }

  const renderCard = (product: Product, index: number, isSmall: boolean = false) => {
    if (!product) return null
    const metadata = CATEGORY_METADATA[title] || CATEGORY_METADATA['Kids']
    const subCategoryTitle = metadata.subcategories[index % metadata.subcategories.length] || `Exclusive Edit ${index + 1}`
    const subCategoryContext = 'Explore the finest collection curated for luxury and elegance.'
    return (
      <div
        key={`${product.id}-${index}-${isSmall}`}
        className="rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 cursor-pointer group w-full h-full relative border border-gray-200/50 bg-gray-50/50"
      >
        <Link href={`/${title.toLowerCase()}/${subCategoryTitle.toLowerCase().replace(/ /g, '-')}`} className="absolute inset-0 z-10" />
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={product?.image || (product?.images && product?.images[0]) || ''}
            alt={subCategoryTitle} fill
            className="object-cover group-hover:scale-[1.08] transition-transform duration-[1.5s] ease-out"
            sizes="(max-width: 768px) 75vw, 30vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
          <div className={`absolute inset-0 ${isSmall ? 'p-4 md:p-5' : 'p-5 md:p-8'} flex flex-col justify-end pointer-events-none`}>
            <div className="relative z-20 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <h3 className={`font-sans ${isSmall ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl lg:text-4xl'} font-bold tracking-tight mb-1 md:mb-2 text-white leading-tight drop-shadow-xl`}>
                {subCategoryTitle}
              </h3>
              <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500 opacity-0 group-hover:opacity-100">
                {!isSmall && <p className="text-[11px] md:text-xs text-white/90 font-medium max-w-[95%] mb-3 leading-relaxed">{subCategoryContext}</p>}
                <span className={`inline-flex items-center gap-2 ${isSmall ? 'text-[9px] mt-1' : 'text-[10px] md:text-xs mt-2'} font-bold tracking-[0.2em] uppercase text-white`}>
                  <span>Discover Now</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={sectionRef}
      className="mb-6 md:mb-10 bg-white dark:bg-neutral-900/30 rounded-[2rem] border border-neutral-100 dark:border-neutral-800/80 p-3 sm:p-4 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] mx-3 sm:mx-4 md:mx-6"
    >
      {/* Super Advanced Banner */}
      <CategoryBanner title={title} />

      {/* Section header */}
      <div className="flex items-center justify-between mt-8 mb-6 px-2">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full shadow-[0_0_10px_currentColor]"
            style={{ backgroundColor: CATEGORY_METADATA[title]?.accentColor || '#000', color: CATEGORY_METADATA[title]?.accentColor || '#000' }} />
          <h4 className="text-[11px] md:text-xs font-black uppercase tracking-[0.3em] text-neutral-800 dark:text-neutral-200">
            {title} Collections
          </h4>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-neutral-300 via-neutral-100 to-transparent dark:from-neutral-700 dark:via-neutral-900 mx-6" />
      </div>

      <div className="relative group/carousel">
        <AnimatePresence>
          {showLeftArrow && (
            <motion.button 
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
              onClick={(e) => { e.stopPropagation(); scroll('left'); }} 
              className="hidden md:flex absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-[50] w-14 h-14 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.1)] border border-black/5 hover:bg-black hover:text-white transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showRightArrow && (
            <motion.button 
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              onClick={(e) => { e.stopPropagation(); scroll('right'); }} 
              className="hidden md:flex absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-[50] w-14 h-14 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.1)] border border-black/5 hover:bg-black hover:text-white transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>

        <div
          ref={stripRef}
          className="overflow-x-auto pb-4 pt-2 px-4 md:px-2 scrollbar-hide will-change-scroll snap-x snap-mandatory md:snap-none"
        >
          <div className="flex gap-0.5 items-stretch w-max h-[500px] md:h-[600px]">
            {[...blocks, ...blocks].map((block, bIdx) => {
              if (block.type === 'single') return (
                <div key={bIdx} className="min-w-[85vw] md:min-w-[32vw] lg:min-w-[26vw] flex-shrink-0 h-full">
                  {renderCard(block.items[0], block.startIndex)}
                </div>
              )
              if (block.type === 'stacked2') return (
                <div key={bIdx} className="min-w-[85vw] md:min-w-[32vw] lg:min-w-[28vw] flex-shrink-0 h-full flex flex-col gap-0.5">
                  <div className="flex-1 w-full relative">{renderCard(block.items[0], block.startIndex, true)}</div>
                  <div className="flex-1 w-full relative">{renderCard(block.items[1], block.startIndex + 1, true)}</div>
                </div>
              )
              if (block.type === 'grid3') return (
                <div key={bIdx} className="min-w-[95vw] md:min-w-[60vw] lg:min-w-[50vw] flex-shrink-0 h-full grid grid-cols-2 gap-0.5">
                  <div className="col-span-1 h-full relative">{renderCard(block.items[0], block.startIndex)}</div>
                  <div className="col-span-1 flex flex-col gap-0.5 h-full">
                    <div className="flex-1 w-full relative">{renderCard(block.items[1], block.startIndex + 1, true)}</div>
                    <div className="flex-1 w-full relative">{renderCard(block.items[2], block.startIndex + 2, true)}</div>
                  </div>
                </div>
              )
              return null
            })}
          </div>
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
