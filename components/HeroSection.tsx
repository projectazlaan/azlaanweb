'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  description: string;
  bgImage: string;
  slug: string;
}

interface HeroSectionProps {
  initialHero?: any;
  customSlides?: Slide[];
  onHeroClick?: (slide: Slide) => void;
}

export default function HeroSection({ initialHero, customSlides, onHeroClick }: HeroSectionProps) {
  // Map initialHero to slides structure if customSlides isn't provided
  const slides = customSlides || (initialHero ? [{
    id: 'hero-1',
    name: initialHero.title || 'Azlaan',
    title: initialHero.title || 'Luxury Collection',
    subtitle: initialHero.subtitle || 'Established 2024',
    description: initialHero.description || 'Experience the pinnacle of artisanal craftsmanship.',
    bgImage: initialHero.bgImage || initialHero.bg_image || initialHero.image || '/media-pro/men/Design 1/649824908_122120770023151981_1372810042799937270_n.webp',
    slug: 'all'
  }] : []);

  const extendedSlides = slides.length > 1 ? [slides[slides.length - 1], ...slides, slides[0]] : slides;
  
  const [currentSlide, setCurrentSlide] = useState(slides.length > 1 ? 1 : 0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = useCallback(() => {
    if (isTransitioning || slides.length <= 1) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => prev + 1);
  }, [isTransitioning, slides.length]);

  const prevSlide = useCallback(() => {
    if (isTransitioning || slides.length <= 1) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => prev - 1);
  }, [isTransitioning, slides.length]);

  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index + 1);
  };

  // Handle Teleportation for Infinite Loop
  useEffect(() => {
    if (currentSlide === extendedSlides.length - 1) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentSlide(1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (currentSlide === 0) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentSlide(extendedSlides.length - 2);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentSlide, extendedSlides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide, slides.length]);

  if (!slides || slides.length === 0) return null;

  // Active Index for Thumbnails (1-indexed based on extended array)
  const activeIndex = currentSlide === 0 ? slides.length - 1 : 
                     currentSlide === extendedSlides.length - 1 ? 0 : 
                     currentSlide - 1;

  return (
    <section className="relative h-[80vh] md:h-[85vh] w-full overflow-hidden bg-black">
      {/* 1. Main Hero Image (Horizontal Infinite Slider) */}
      <motion.div 
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={(e, { offset, velocity }) => {
          const swipe = offset.x;
          if (swipe < -50) nextSlide();
          else if (swipe > 50) prevSlide();
        }}
        className={`absolute inset-0 z-0 flex ${isTransitioning ? 'transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]' : ''}`}
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {extendedSlides.map((slide, index) => {
          const isRealActive = (currentSlide === index) || 
                              (currentSlide === extendedSlides.length - 1 && index === 1) ||
                              (currentSlide === 0 && index === extendedSlides.length - 2);

          return (
            <div key={`${slide.id}-${index}`} className="relative w-full h-full flex-shrink-0">
              {/* Clickable Area for Routing */}
              <div 
                className="absolute inset-0 z-10 cursor-pointer pointer-events-auto"
                onClick={() => onHeroClick?.(slide)}
              />
              
              <Image
                src={slide.bgImage}
                alt={slide.title}
                fill
                priority={index === 1}
                quality={100}
                unoptimized={true}
                className={`object-cover ${slide.name === 'Panjabi' ? 'object-[50%_50%]' : 'object-[50%_15%]'}`}
              />
              <div className="absolute inset-0 bg-black/40" />
              
              {/* 2. Main Typography Block */}
              <div className="relative z-20 h-full flex flex-col justify-center px-8 md:px-24 max-w-[1600px] mx-auto pointer-events-none pb-32 md:pb-48">
                <div className="max-w-3xl">
                  <motion.div
                    initial={false}
                    animate={isRealActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                    transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1], delay: isRealActive ? 0.3 : 0 }}
                  >
                    <span className="inline-block text-[9px] md:text-[10px] font-black tracking-[0.5em] uppercase text-white/50 mb-6 border-l-2 border-white/30 pl-4">
                      {slide.subtitle}
                    </span>
                    <h1 className="text-5xl md:text-[7rem] font-sans font-black text-white leading-[0.85] tracking-tighter mb-6 uppercase">
                      {slide.title.split(' ')[0]}
                      <span className="block text-[0.45em] font-serif font-light tracking-tight normal-case italic opacity-90 mt-[-10px] md:mt-[-20px]">
                        {slide.title.split(' ').slice(1).join(' ')}
                      </span>
                    </h1>
                    <p className="text-[12px] md:text-base text-white/50 font-medium max-w-md leading-relaxed">
                      {slide.description}
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* PC Minimal Arrows */}
      <div className="hidden md:flex absolute inset-y-0 left-4 items-center z-40">
        <button 
          onClick={(e) => { e.stopPropagation(); prevSlide(); }}
          className="p-3 text-white/30 hover:text-white transition-colors duration-300"
        >
          <ChevronLeft size={48} strokeWidth={1} />
        </button>
      </div>
      <div className="hidden md:flex absolute inset-y-0 right-4 items-center z-40">
        <button 
          onClick={(e) => { e.stopPropagation(); nextSlide(); }}
          className="p-3 text-white/30 hover:text-white transition-colors duration-300"
        >
          <ChevronRight size={48} strokeWidth={1} />
        </button>
      </div>

      {/* 3. Interactive Thumbnail Cards (Bottom Strip) */}
      <div className="absolute bottom-10 left-0 w-full z-20 pointer-events-auto">
        <div className="px-8 md:px-24 max-w-[1600px] mx-auto overflow-visible">
          <div className="flex gap-4 md:gap-6 items-end">
            {slides.map((slide, index) => {
              const isActive = activeIndex === index;
              return (
                <motion.button
                  key={slide.id}
                  onClick={() => goToSlide(index)}
                  animate={{
                    width: isActive ? (isMobileView ? 160 : 300) : (isMobileView ? 80 : 120),
                    opacity: isActive ? 1 : 0.4,
                  }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className={`relative h-24 md:h-44 rounded-2xl overflow-hidden shrink-0 group transition-all duration-500 ${isActive ? 'ring-1 ring-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : 'hover:opacity-100'}`}
                >
                  <Image
                    src={slide.bgImage}
                    alt={slide.name}
                    fill
                    className={`object-cover object-[50%_15%] transition-transform duration-1000 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}
                  />
                  
                  {/* Cinematic Overlay - Restored for Visibility */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${isActive ? 'from-black/90 via-black/30' : 'from-black/60'} to-transparent transition-opacity duration-700`} />

                  {/* Thumbnail Content Layer */}
                  <div className="absolute inset-0 p-3 md:p-5 flex flex-col justify-between z-10">
                    {/* Top: Catalog Index */}
                    <div className="flex justify-end">
                      <span className={`text-[8px] md:text-[10px] font-sans font-light text-white/40 tracking-widest transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Bottom: Main Info */}
                    <div className="text-left">
                      <p className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.3em] text-white/40 mb-1">
                        {slide.subtitle.split(' ')[0]}
                      </p>
                      <h4 className="text-[11px] md:text-2xl font-black uppercase tracking-tight text-white leading-none drop-shadow-md">
                        {slide.name}
                      </h4>
                      <p className={`text-[7px] md:text-[10px] font-serif italic text-white/50 mt-1 line-clamp-1 transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                        {slide.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
