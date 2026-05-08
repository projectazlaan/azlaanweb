'use client';
import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
const COLLECTION_IMAGES = [
  { url: '/media-pro/cover/cover 1.jpg', title: 'Premium Silk Panjabi' },
  { url: '/media-pro/cover/cover 2.jpg', title: 'Hand-embroidered Kamiz' },
  { url: '/media-pro/cover/cover 3.jpg', title: 'Classic Cotton Kurta' },
  { url: '/media-pro/cover/cover 4.jpg', title: 'Silk Festive Wear' },
  { url: '/media-pro/men/Design%202/649486384_122120775759151981_5241916048356926520_n.webp', title: 'Designer Menswear' },
  { url: '/media-pro/women/Design%202/672121181_122125885095151981_7790861692313383598_n.webp', title: 'Luxury Pret' },
  { url: '/media-pro/men/Design%202/649776456_122120775735151981_894663234632234790_n.webp', title: 'Festive Kurta' },
  { url: '/media-pro/women/Design%202/671639040_122125885023151981_7657790961365514375_n.webp', title: 'Elegant Saree' },
  { url: '/media-pro/men/Design%202/651189502_122120775753151981_1115542629474834714_n.webp', title: 'Premium Collection' },
  { url: '/media-pro/women/Design%202/671858259_122125885173151981_8012706557340946160_n.webp', title: 'Signature Pret' },
  { url: '/media-pro/men/Design%201/649824908_122120770023151981_1372810042799937270_n.webp', title: 'Traditional Panjabi' },
  { url: '/media-pro/women/Design%201/673191812_122125962327151981_8385571386878315506_n.webp', title: 'Bridal Couture' },
];
export default function NewCollectionPanel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(1); // Start from 1 because of clones
  const [isTransitioning, setIsTransitioning] = useState(false);
  // Clone logic: [Last, 1, 2, ..., Last, 1]
  const extendedImages = [
    COLLECTION_IMAGES[COLLECTION_IMAGES.length - 1],
    ...COLLECTION_IMAGES,
    COLLECTION_IMAGES[0]
  ];
  const next = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent((prev) => prev + 1);
  }, [isTransitioning]);
  const prev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent((prev) => prev - 1);
  }, [isTransitioning]);
  // Handle Teleportation
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (current === extendedImages.length - 1) {
      timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrent(1);
      }, 3000); // Changed to match slow motion duration
    } else if (current === 0) {
      timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrent(extendedImages.length - 2);
      }, 3000); // Changed to match slow motion duration
    } else {
      timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 3000); // Changed to match slow motion duration
    }
    return () => clearTimeout(timer);
  }, [current, extendedImages.length]);
  // Auto-slide every 6 seconds to allow for slow motion
  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);
  return (
    <section className="pt-8 md:pt-16 pb-12 bg-white overflow-hidden relative">
      <div className="max-w-full mx-auto relative">
        {/* ── Header ── */}
        <div className="text-center mb-10 md:mb-16 px-4 relative flex flex-col items-center">
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
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex items-center justify-center gap-3 md:gap-4 mt-4 md:mt-6"
          >
            <div className="h-[1px] w-4 md:w-8 bg-[#0071E3]" />
            <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-gray-600">
              Fresh Arrivals 2026
            </span>
            <div className="h-[1px] w-4 md:w-8 bg-[#0071E3]" />
          </motion.div>
        </div>
        {/* ── Carousel wrapper ── */}
        <div className="relative group/nav">
          {/* Prev Arrow */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="
              absolute left-2 md:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-[50]
              w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full
              bg-white/90 backdrop-blur-md shadow-xl border border-black/5
              hover:bg-black hover:text-white transition-all duration-300
              active:scale-95
            "
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          {/* Next Arrow */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="
              absolute right-2 md:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-[50]
              w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full
              bg-white/90 backdrop-blur-md shadow-xl border border-black/5
              hover:bg-black hover:text-white transition-all duration-300
              active:scale-95
            "
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          {/* Infinite Container */}
          <div className="flex items-center justify-center">
            <div className="w-[70vw] md:w-[420px] aspect-[3/4] relative">
              <div 
                className={`flex h-full w-full ${isTransitioning ? 'transition-transform duration-[3000ms] ease-[cubic-bezier(0.25,1,0.32,1)]' : ''}`}
                style={{ transform: `translateX(-${current * 100}%)` }}
              >
                {extendedImages.map((item, idx) => {
                  const isMain = current === idx || (current === extendedImages.length - 1 && idx === 1) || (current === 0 && idx === extendedImages.length - 2);
                  return (
                    <div
                      key={`${item.url}-${idx}`}
                      className="min-w-full h-full relative px-2 md:px-4 flex-shrink-0"
                    >
                      <motion.div 
                        className="w-full h-full rounded-2xl md:rounded-[2.5rem] overflow-hidden bg-gray-100 shadow-[0_25px_60px_rgba(0,0,0,0.18)] relative group cursor-pointer"
                        animate={{
                          scale: isMain ? 1 : 0.85,
                          opacity: isMain ? 1 : 0.4,
                          filter: isMain ? 'blur(0px)' : 'blur(4px)'
                        }}
                        transition={{ duration: 0.6 }}
                      >
                        <Image
                          src={item.url}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-1000 group-hover:scale-110"
                          sizes="(max-width: 768px) 70vw, 420px"
                        />
                        {/* Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-700 ${isMain ? 'opacity-100' : 'opacity-0'}`} />
                        {/* Content */}
                        <div className={`absolute inset-0 p-6 md:p-10 flex flex-col justify-end transition-all duration-700 delay-100 transform ${isMain ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
                          <h3 className="text-white text-xl md:text-2xl font-bold mb-3 tracking-tight">{item.title}</h3>
                          <Link 
                            href="/shop"
                            className="flex items-center gap-2 text-white/90 hover:text-white text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] transition-all group/btn w-fit"
                          >
                            <span>Explore Collection</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1.5 transition-transform" />
                          </Link>
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        {/* ── Pagination Dots ── */}
        <div className="flex justify-center items-center gap-3 mt-12 md:mt-16">
          {COLLECTION_IMAGES.map((_, idx) => {
            const activeDotIdx = current === 0 ? COLLECTION_IMAGES.length - 1 : current === extendedImages.length - 1 ? 0 : current - 1;
            return (
              <button
                key={idx}
                onClick={() => {
                  if (!isTransitioning) {
                    setIsTransitioning(true);
                    setCurrent(idx + 1);
                  }
                }}
                className={`transition-all duration-500 rounded-full h-1.5 ${
                  activeDotIdx === idx
                    ? 'w-10 bg-[#0071E3]'
                    : 'w-2 bg-gray-200 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
