'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
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
              <div className="absolute inset-0 flex flex-col justify-end pb-12 md:pb-16 pointer-events-none">
                <div className="relative z-20 px-6 md:px-8 w-full max-w-[90rem] mx-auto text-left pointer-events-auto">
                  <div className="max-w-2xl">
                    <span 
                      className={`inline-block text-[9px] md:text-[11px] font-semibold tracking-[0.2em] uppercase text-white mb-3 md:mb-4 transition-all duration-700 delay-300 transform drop-shadow-md ${isRealActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                    >
                      {slide.subtitle || 'Premium Quality'}
                    </span>
                    <h1 
                      className={`font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 md:mb-5 text-white leading-[1.05] md:leading-[1.05] transition-all duration-700 delay-500 transform drop-shadow-lg ${isRealActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                    >
                      {slide.title}
                    </h1>
                    <p 
                      className={`text-[13px] sm:text-sm md:text-sm lg:text-base mb-6 md:mb-8 text-white/95 font-medium transition-all duration-700 delay-700 transform drop-shadow-md ${isRealActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} max-w-lg line-clamp-3 md:line-clamp-none`}
                    >
                      {slide.description}
                    </p>
                    <div className={`flex flex-wrap items-center justify-start gap-3 md:gap-4 transition-all duration-700 delay-1000 transform ${isRealActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                      <Link
                        href={slide.cta1Link || '#'}
                        className="group flex items-center justify-center gap-2 bg-white/20 backdrop-blur-md border border-white/40 text-white hover:bg-white hover:text-black px-6 py-3 md:px-7 md:py-3 rounded-full font-semibold text-[11px] md:text-xs transition-all duration-300 shadow-lg"
                      >
                        <span>{slide.cta1Text || 'Shop Now'}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-90 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </Link>
                      {(slide.cta2Text) && (
                        <Link
                          href={slide.cta2Link || '#'}
                          className="group flex items-center justify-center text-white hover:text-gray-200 px-6 py-3 md:py-3 font-semibold text-[11px] md:text-xs w-full sm:w-auto transition-colors drop-shadow-md"
                        >
                          <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-white after:transition-all hover:after:w-full pb-0.5">{slide.cta2Text}</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button 
            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-[70] flex items-center justify-center text-white bg-black/20 hover:bg-black/50 border border-white/10 backdrop-blur-sm rounded-full transition-all cursor-pointer w-10 h-10 md:w-14 md:h-14 group"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 md:w-7 md:h-7 opacity-70 group-hover:opacity-100 transition-opacity group-hover:-translate-x-0.5" strokeWidth={2} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-[70] flex items-center justify-center text-white bg-black/20 hover:bg-black/50 border border-white/10 backdrop-blur-sm rounded-full transition-all cursor-pointer w-10 h-10 md:w-14 md:h-14 group"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 md:w-7 md:h-7 opacity-70 group-hover:opacity-100 transition-opacity group-hover:translate-x-0.5" strokeWidth={2} />
          </button>
        </>
      )}
      {/* Navigation Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
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
        </div>
      )}
    </section>
  )
}
