'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  ArrowRight,
  ShoppingBag,
  Eye,
  Heart
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const REEL_LINKS = [
  "https://www.facebook.com/reel/1134307095487597",
  "https://www.facebook.com/reel/1259544982273036",
  "https://www.facebook.com/reel/1446643340499772",
  "https://www.facebook.com/reel/1680066329645105",
  "https://www.facebook.com/reel/1426742389142332"
];

const REEL_PRODUCTS = [
  { id: 1, name: "Premium Silk Panjabi", price: "4,590", originalPrice: "5,800", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=400&fit=crop", link: "/men/panjabi" },
  { id: 2, name: "Signature Cotton Kurta", price: "2,890", originalPrice: "3,500", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&h=400&fit=crop", link: "/men/kurta" },
  { id: 3, name: "Urban Street Tee", price: "890", originalPrice: "1,200", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop", link: "/men/t-shirt" },
  { id: 4, name: "Premium Linen Suit", price: "12,990", originalPrice: "15,500", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=300&h=400&fit=crop", link: "/men/suits" },
  { id: 5, name: "Monochrome Set", price: "5,490", originalPrice: "6,900", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&h=400&fit=crop", link: "/men/panjabi" }
];

export default function ReelsPanel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRefs = useRef<{[key: number]: any}>({});

  // Initialize Facebook SDK
  useEffect(() => {
    const initFB = () => {
      if (!(window as any).FB) return;
      (window as any).FB.init({ xfbml: true, version: 'v18.0' });
      
      (window as any).FB.Event.subscribe('xfbml.ready', (msg: any) => {
        if (msg.type === 'video' && msg.id) {
          const idx = parseInt(msg.id.split('-').pop() || '0');
          playerRefs.current[idx] = msg.instance;
          
          // Initial play/mute sync
          if (isMuted) msg.instance.mute(); else msg.instance.unmute();
          if (idx === activeIndex) msg.instance.play(); else msg.instance.pause();

          msg.instance.subscribe('finished', () => {
            if (idx === activeIndex) scrollTo(idx + 1);
          });
        }
      });
    };

    if (!(window as any).FB) {
      const script = document.createElement('script');
      script.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      script.onload = initFB;
      document.body.appendChild(script);
    } else {
      initFB();
    }
  }, [activeIndex, isMuted]); // Depend on activeIndex to handle race condition if FB loads late

  // Simple Intersection Observer to detect active reel
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setActiveIndex(index);
          }
        });
      },
      { root: container, rootMargin: '0px -45% 0px -45%', threshold: 0 }
    );

    container.querySelectorAll('.reel-slide').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Sync playback when activeIndex changes
  useEffect(() => {
    Object.keys(playerRefs.current).forEach((key) => {
      const idx = parseInt(key);
      const player = playerRefs.current[idx];
      if (!player) return;
      try {
        if (idx === activeIndex) {
          player.play();
          if (isMuted) player.mute(); else player.unmute();
        } else {
          player.pause();
        }
      } catch (e) {}
    });
  }, [activeIndex, isMuted]);

  const scrollTo = (index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const target = index >= REEL_LINKS.length ? 0 : index;
    const slide = container.querySelector(`[data-index="${target}"]`);
    if (slide) slide.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  return (
    <section className="pt-8 md:pt-12 pb-16 bg-white overflow-hidden relative">
      <div id="fb-root"></div>
      <div className="max-w-full mx-auto relative">
        <div className="text-center mb-8 px-4 flex flex-col items-center">
          <h2 className="flex flex-col items-center justify-center leading-none">
            <span className="font-serif italic text-2xl md:text-3xl text-gray-400 font-light tracking-wider pr-8 -mb-2">Style</span>
            <span className="font-sans text-4xl md:text-5xl font-bold tracking-tighter text-primary uppercase">Editorials</span>
          </h2>
          <div className="flex items-center gap-4 mt-6">
            <div className="h-[1px] w-8 bg-gray-300" />
            <span className="text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase text-gray-500">Watch & Buy</span>
            <div className="h-[1px] w-8 bg-gray-300" />
          </div>
        </div>

        <div className="relative group/carousel">
          <button onClick={() => scrollTo(activeIndex - 1)} className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-xl border border-black/5 hover:bg-black hover:text-white transition-all opacity-0 group-hover/carousel:opacity-100">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={() => scrollTo(activeIndex + 1)} className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-xl border border-black/5 hover:bg-black hover:text-white transition-all opacity-0 group-hover/carousel:opacity-100">
            <ChevronRight className="w-6 h-6" />
          </button>

          <div
            ref={containerRef}
            className="flex overflow-x-auto gap-4 md:gap-12 px-[10vw] md:px-[calc(50vw-180px)] pb-12 scrollbar-hide snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {REEL_LINKS.map((link, idx) => (
              <div
                key={idx}
                data-index={idx}
                onClick={() => scrollTo(idx)}
                className="reel-slide min-w-[80vw] md:min-w-[360px] w-[80vw] md:w-[360px] aspect-[9/16] flex-shrink-0 snap-center snap-stop-always relative cursor-pointer"
              >
                <div className={`w-full h-full rounded-2xl overflow-hidden bg-black shadow-2xl transition-all duration-500 ${activeIndex === idx ? 'scale-100' : 'scale-95 opacity-50'}`}>
                  <div 
                    id={`fb-player-${idx}`}
                    className="fb-video h-full"
                    data-href={link}
                    data-width="500"
                    data-allowfullscreen="true"
                    data-autoplay="true"
                    data-show-text="false"
                  />

                  {/* Controls Overlay */}
                  <div className="absolute inset-0 z-20 pointer-events-none">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                      className="absolute top-4 right-4 pointer-events-auto p-3 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-all z-30"
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>

                    <AnimatePresence>
                      {activeIndex === idx && (
                        <motion.div 
                          initial={{ opacity: 0, y: 15, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.98 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute bottom-8 inset-x-4 pointer-events-auto"
                        >
                          <Link href={REEL_PRODUCTS[idx].link} onClick={(e) => e.stopPropagation()}>
                            <div className="bg-black/60 backdrop-blur-3xl px-4 py-2.5 rounded-[16px] flex items-center justify-between gap-4 shadow-[0_15px_35px_rgba(0,0,0,0.5)] border border-white/10 group/card relative">
                              
                              <div className="flex-1 min-w-0">
                                <h4 className="text-[12px] font-bold text-white leading-tight tracking-tight break-words">{REEL_PRODUCTS[idx].name}</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[14px] font-extrabold text-white">৳{REEL_PRODUCTS[idx].price}</span>
                                  <span className="text-[11px] text-white/30 line-through font-medium">৳{REEL_PRODUCTS[idx].originalPrice}</span>
                                  <span className="text-[9px] font-black text-primary uppercase">-{Math.round((1 - parseFloat(REEL_PRODUCTS[idx].price.replace(',', '')) / parseFloat(REEL_PRODUCTS[idx].originalPrice.replace(',', ''))) * 100)}%</span>
                                </div>
                              </div>

                              <button 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                className="px-4 py-2 rounded-lg bg-white text-black text-[9px] font-black uppercase tracking-wider hover:bg-primary hover:text-white transition-all duration-300 shadow-lg active:scale-90 flex-shrink-0"
                              >
                                Add to Cart
                              </button>
                            </div>
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Link href="/visuals" className="group flex items-center gap-4 px-12 py-4 rounded-full border border-black/10 hover:bg-black hover:text-white transition-all duration-500 bg-white">
            <span className="text-[11px] font-bold uppercase tracking-[0.4em]">View All Visuals</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
