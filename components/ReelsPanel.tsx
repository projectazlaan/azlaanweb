'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const REEL_LINKS = [
  'https://www.facebook.com/reel/1134307095487597',
  'https://www.facebook.com/reel/1259544982273036',
  'https://www.facebook.com/reel/1446643340499772',
  'https://www.facebook.com/reel/1680066329645105',
  'https://www.facebook.com/reel/1426742389142332',
  'https://www.facebook.com/reel/1521778248931006',
  'https://www.facebook.com/reel/1611200360066814',
  'https://www.facebook.com/reel/1134307095487597',
];

export default function ReelsPanel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedIframes, setLoadedIframes] = useState<Record<number, boolean>>({});

  // Intersection observer to track centred slide
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setActiveIndex(index);
            // Preload current, next and previous
            setLoadedIframes(prev => ({
              ...prev,
              [index]: true,
              [index + 1]: true,
              [index - 1]: true
            }));
          }
        });
      },
      { root: container, rootMargin: '0px -40% 0px -40%', threshold: 0 }
    );

    container.querySelectorAll('.reel-slide').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;

    const clamped = Math.max(0, Math.min(index, REEL_LINKS.length - 1));
    const slide = container.querySelector<HTMLElement>(`.reel-slide[data-index="${clamped}"]`);
    if (slide) {
      slide.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    setActiveIndex(clamped);
  }, []);

  const prev = () => scrollTo(activeIndex - 1);
  const next = () => scrollTo(activeIndex + 1);

  const getEmbedUrl = (url: string, isActive: boolean) => {
    const encodedUrl = encodeURIComponent(url);
    const autoPlayParam = isActive ? '&autoplay=true&mute=1' : '';
    return `https://www.facebook.com/plugins/video.php?href=${encodedUrl}&show_text=false&width=400${autoPlayParam}`;
  };

  return (
    <section className="pt-4 md:pt-6 pb-0 bg-white overflow-hidden relative">
      <div className="max-w-full mx-auto relative">

        {/* ── Header ── */}
        <div className="text-center mb-3 md:mb-4 px-4 relative flex flex-col items-center">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center leading-[0.85] md:leading-[0.8]"
          >
            <span className="font-serif italic text-2xl md:text-3xl text-gray-400 font-light tracking-wider pr-8 md:pr-12 -mb-1 md:-mb-2 z-10">
              Style
            </span>
            <span className="font-sans text-4xl md:text-5xl font-bold tracking-tighter text-primary uppercase drop-shadow-sm">
              Editorials
            </span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex items-center justify-center gap-3 md:gap-4 mt-4 md:mt-5"
          >
            <div className="h-[1px] w-4 md:w-8 bg-gray-400" />
            <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] md:tracking[0.4em] uppercase text-gray-600">
              Azlaan Visuals
            </span>
            <div className="h-[1px] w-4 md:w-8 bg-gray-400" />
          </motion.div>
        </div>

        {/* ── Desktop Arrow + Carousel wrapper ── */}
        <div className="relative">

          {/* Prev Arrow — desktop only */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            disabled={activeIndex === 0}
            aria-label="Previous reel"
            className="
              hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-[50]
              w-11 h-11 items-center justify-center rounded-full
              bg-white shadow-lg border border-black/10
              hover:bg-black hover:text-white hover:border-black
              disabled:opacity-30 disabled:cursor-not-allowed
              transition-all duration-200 group
            "
          >
            <ChevronLeft className="w-5 h-5 text-black group-hover:text-white transition-colors" />
          </button>

          {/* Next Arrow — desktop only */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            disabled={activeIndex === REEL_LINKS.length - 1}
            aria-label="Next reel"
            className="
              hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-[50]
              w-11 h-11 items-center justify-center rounded-full
              bg-white shadow-lg border border-black/10
              hover:bg-black hover:text-white hover:border-black
              disabled:opacity-30 disabled:cursor-not-allowed
              transition-all duration-200 group
            "
          >
            <ChevronRight className="w-5 h-5 text-black group-hover:text-white transition-colors" />
          </button>

          {/* Carousel */}
          <div
            ref={containerRef}
            className="flex overflow-x-auto gap-3 md:gap-5 px-[15vw] md:px-[calc(50vw-140px)] pb-4 scrollbar-hide snap-x snap-mandatory items-center scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {REEL_LINKS.map((link, idx) => {
              const isActive = activeIndex === idx;
              const shouldLoad = loadedIframes[idx];

              return (
                <motion.div
                  key={`${link}-${idx}`}
                  data-index={idx}
                  className="reel-slide min-w-[70vw] md:min-w-[280px] w-[70vw] md:w-[280px] aspect-[9/16] flex-shrink-0 snap-center relative transition-all duration-[400ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
                  style={{ scrollSnapStop: 'always' }}
                  animate={{
                    scale:   isActive ? 1    : 0.75,
                    opacity: isActive ? 1    : 0.6,
                    filter:  isActive ? 'blur(0px)' : 'blur(4px)',
                    y:       isActive ? 0    : 20,
                  }}
                >
                  <div className="w-full h-full rounded-2xl md:rounded-3xl overflow-hidden bg-black shadow-[0_10px_40px_rgba(0,0,0,0.2)] relative border border-gray-800">

                    {/* Loader/Placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-950">
                      <div className="flex flex-col items-center">
                        {isActive && !shouldLoad ? (
                           <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
                        ) : (
                          <Play className="w-10 h-10 text-gray-800" fill="currentColor" />
                        )}
                      </div>
                    </div>

                    {/* Lazy Loaded Iframe */}
                    {shouldLoad && (
                      <iframe
                        key={`${link}-${isActive}`}
                        src={getEmbedUrl(link, isActive)}
                        className={`absolute inset-0 w-[105%] h-[105%] -left-[2.5%] -top-[2.5%] border-0 bg-transparent z-10 scale-[1.02] ${!isActive ? 'pointer-events-none' : ''}`}
                        scrolling="no"
                        allowFullScreen={true}
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                        loading="lazy"
                      />
                    )}

                    {/* Inactive overlay — clicking snaps this reel to centre */}
                    {!isActive && (
                      <button
                        onClick={() => scrollTo(idx)}
                        aria-label={`Play reel ${idx + 1}`}
                        className="absolute inset-0 z-20 bg-black/40 hover:bg-black/25 transition-all duration-300 w-full h-full cursor-pointer flex items-center justify-center group"
                      >
                        <span className="w-14 h-14 rounded-full bg-white/20 border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                          <Play className="w-6 h-6 text-white fill-white ml-1" />
                        </span>
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Dot Indicators — desktop only ── */}
        <div className="hidden md:flex justify-center items-center gap-2 mt-4">
          {REEL_LINKS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              aria-label={`Go to reel ${idx + 1}`}
              className={`rounded-full transition-all duration-300 ${
                activeIndex === idx
                  ? 'w-6 h-2 bg-black'
                  : 'w-2 h-2 bg-black/20 hover:bg-black/40'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
