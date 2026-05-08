'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
interface HeroContent {
  id: string
  title: string
  subtitle: string
  description: string
  bgImage: string
  cta1Text: string
  cta1Link: string
  cta2Text: string
  cta2Link: string
}
const DEFAULT_SLIDES = [
  {
    id: 'slide-1',
    title: 'Handcrafted Elegance',
    subtitle: 'Azlaan Premium Quality',
    description: 'Discover ethically made, artisan-crafted products that blend tradition with contemporary style.',
    bgImage: '/media-pro/cover/cover 1.jpg',
    cta1Text: 'Explore Now',
    cta1Link: '/shop',
    cta2Text: 'Learn More',
    cta2Link: '/about'
  },
  {
    id: 'slide-2',
    title: 'Winter Warmth',
    subtitle: 'Stay Cozy, Look Sharp',
    description: 'Premium woolens and modern silhouettes for the cold season.',
    bgImage: '/media-pro/cover/cover 2.jpg',
    cta1Text: 'Shop Winter',
    cta1Link: '/men',
    cta2Text: 'View Lookbook',
    cta2Link: '/about'
  },
  {
    id: 'slide-3',
    title: 'New Arrivals',
    subtitle: 'Fresh Designs Just For You',
    description: 'Explore our latest collection of handcrafted fashion and lifestyle products.',
    bgImage: '/media-pro/cover/cover 3.jpg',
    cta1Text: 'Discover',
    cta1Link: '/women',
    cta2Text: 'Our Story',
    cta2Link: '/about'
  },
  {
    id: 'slide-4',
    title: 'Timeless Style',
    subtitle: 'Luxury Redefined',
    description: 'Artisanal craftsmanship meeting modern silhouettes for the contemporary wardrobe.',
    bgImage: '/media-pro/cover/cover 4.jpg',
    cta1Text: 'Shop All',
    cta1Link: '/shop',
    cta2Text: 'Lookbook',
    cta2Link: '/about'
  }
]
export default function HeroSection({ initialHero }: { initialHero?: HeroContent }) {
  // Initialize with DEFAULT_SLIDES so the UI renders instantly
  const [slides, setSlides] = useState<HeroContent[]>(DEFAULT_SLIDES)
  // currentSlide is the index in the EXTENDED slides array [last, ...original, first]
  const [currentSlide, setCurrentSlide] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)
  useEffect(() => {
    if (!initialHero) {
      fetchHero()
    }
  }, [initialHero])
  const fetchHero = async () => {
    try {
      const res = await fetch('/api/hero')
      if (res.ok) {
        const data = await res.json()
        setSlides([{ ...data, id: 'slide-0' }, ...DEFAULT_SLIDES])
      }
    } catch (error) {
      console.error('Failed to fetch hero:', error)
    }
  }
  // Extended slides for infinite loop: [last, ...original, first]
  const extendedSlides = [
    slides[slides.length - 1],
    ...slides,
    slides[0]
  ]
  const nextSlide = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentSlide((prev) => prev + 1)
  }, [isTransitioning])
  const prevSlide = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentSlide((prev) => prev - 1)
  }, [isTransitioning])
  // Handle teleportation and transition state reset
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (currentSlide === extendedSlides.length - 1) {
      timer = setTimeout(() => {
        setIsTransitioning(false)
        setCurrentSlide(1)
      }, 1200)
    } else if (currentSlide === 0) {
      timer = setTimeout(() => {
        setIsTransitioning(false)
        setCurrentSlide(extendedSlides.length - 2)
      }, 1200)
    } else {
      // Normal transition, reset after duration
      timer = setTimeout(() => {
        setIsTransitioning(false)
      }, 1200)
    }
    return () => clearTimeout(timer)
  }, [currentSlide, extendedSlides.length])
  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(nextSlide, 6000)
    return () => clearInterval(timer)
  }, [slides.length, nextSlide])
  const { scrollY } = useScroll();
  
  // Create a smoother parallax value using useSpring
  const rawContentY = useTransform(scrollY, [0, 800], [0, -200]);
  const contentY = useSpring(rawContentY, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const contentOpacity = useTransform(scrollY, [400, 700], [1, 0]);

  if (slides.length === 0) return null
  return (
    <section 
      data-customizable 
      data-custom-key="heroSection"
      className="relative h-screen min-h-[100dvh] flex items-center justify-center overflow-hidden group"
    >
      {/* Slides Wrapper for Horizontal Sliding */}
      <div 
        className={`absolute inset-0 flex ${isTransitioning ? 'transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)]' : ''}`}
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {extendedSlides.map((slide, index) => {
          // A slide is "active" if it's the current real slide or its clone
          const isRealActive = (currentSlide === index) || 
                              (currentSlide === extendedSlides.length - 1 && index === 1) ||
                              (currentSlide === 0 && index === extendedSlides.length - 2);
          return (
            <div
              key={`${slide.id}-${index}`}
              className="relative w-full h-full min-h-screen flex-shrink-0"
            >
              <div className="absolute inset-0 z-0">
                <Image
                  src={slide.bgImage}
                  alt={slide.title}
                  fill
                  priority={index === 1}
                  quality={90}
                  className={`object-cover transition-transform duration-[10000ms] ease-out ${isRealActive ? 'scale-105' : 'scale-100'} z-0`}
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10 pointer-events-none" />
              </div>
              
              {/* Content Container with Scroll Parallax - Optimized for Smoothness */}
              <motion.div 
                style={{ 
                  y: contentY,
                  opacity: contentOpacity,
                  willChange: 'transform, opacity'
                }}
                className="absolute inset-0 flex flex-col justify-end pb-12 md:pb-24 pointer-events-none"
              >
                <div className="relative z-20 px-6 md:px-8 w-full max-w-[90rem] mx-auto text-left pointer-events-auto">
                  <div className="max-w-2xl">
                    <span 
                      className={`inline-block text-[10px] md:text-[11px] font-bold text-white/60 mb-3 md:mb-4 tracking-[0.3em] uppercase transition-all duration-1000 delay-300 ${isRealActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                    >
                      {slide.subtitle || 'Premium Quality'}
                    </span>
                    <h1 
                      className={`font-sans text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 md:mb-6 text-white leading-[1.05] transition-all duration-1000 delay-500 ${isRealActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                    >
                      {slide.title}
                    </h1>
                    <p 
                      className={`text-[14px] sm:text-base md:text-lg mb-8 md:mb-10 text-white/80 font-medium transition-all duration-1000 delay-700 ${isRealActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} max-w-xl leading-relaxed`}
                    >
                      {slide.description}
                    </p>
                    <div className={`flex flex-wrap items-center justify-start gap-4 transition-all duration-1000 delay-1000 ${isRealActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                      <Link
                        href={slide.cta1Link || '#'}
                        className="group relative flex items-center gap-4 px-10 py-4 rounded-full bg-white text-black transition-all duration-500 hover:scale-105 active:scale-95 shadow-xl"
                      >
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                          {slide.cta1Text || 'Explore'}
                        </span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>

                      {(slide.cta2Text) && (
                        <Link
                          href={slide.cta2Link || '#'}
                          className="group px-8 py-4 text-white font-bold text-[11px] uppercase tracking-[0.2em] transition-all hover:text-primary relative overflow-hidden"
                        >
                          <span className="relative z-10">{slide.cta2Text}</span>
                          <div className="absolute bottom-3 left-8 right-8 h-[1px] bg-white/20 group-hover:bg-primary transition-colors" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )
        })}
      </div>
      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <div className="contents">
          <button 
            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
            className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-[70] items-center justify-center text-white bg-black/10 hover:bg-black/40 border border-white/5 backdrop-blur-md rounded-full transition-all w-16 h-16 group active:scale-90"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-8 h-8 opacity-50 group-hover:opacity-100 transition-opacity" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
            className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-[70] items-center justify-center text-white bg-black/10 hover:bg-black/40 border border-white/5 backdrop-blur-md rounded-full transition-all w-16 h-16 group active:scale-90"
            aria-label="Next slide"
          >
            <ChevronRight className="w-8 h-8 opacity-50 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      )}
      {/* Navigation Dots (Parallax Enabled with Top Masking) */}
      {slides.length > 1 && (
        <motion.div 
          style={{ 
            y: contentY, 
            opacity: contentOpacity,
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0px, transparent 150px, black 300px, black 100%)',
            maskImage: 'linear-gradient(to bottom, transparent 0px, transparent 150px, black 300px, black 100%)'
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3"
        >
          {slides.map((_, index) => {
            // Real index for dots mapping (currentSlide is 1-indexed in the extended array)
            const dotActiveIndex = currentSlide === 0 ? slides.length - 1 : 
                                  currentSlide === extendedSlides.length - 1 ? 0 : 
                                  currentSlide - 1;
            return (
              <button
                key={index}
                onClick={() => setCurrentSlide(index + 1)}
                className={`h-1.5 transition-all duration-500 rounded-full ${index === dotActiveIndex ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            )
          })}
        </motion.div>
      )}
    </section>
  )
}
