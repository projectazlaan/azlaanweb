import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Share2, Heart, Maximize2 } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  name: string;
  // Expose active state to parent if needed, or manage internally
  externalActiveIndex?: number;
  onActiveIndexChange?: (idx: number) => void;
  isWished?: boolean;
  onWishlistToggle?: () => void;
}

export default function ProductGallery({ 
  images, 
  name, 
  externalActiveIndex, 
  onActiveIndexChange,
  isWished = false,
  onWishlistToggle
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync index if external index is provided
  useEffect(() => {
    if (externalActiveIndex !== undefined) {
      setActiveIndex(externalActiveIndex);
    }
  }, [externalActiveIndex]);

  const updateActiveIndex = (idx: number) => {
    setActiveIndex(idx);
    if (onActiveIndexChange) {
      onActiveIndexChange(idx);
    }
  };

  const nextImage = () => updateActiveIndex((activeIndex + 1) % images.length);
  const prevImage = () => updateActiveIndex((activeIndex - 1 + images.length) % images.length);

  const lastTap = useRef<number>(0);
  const handleDoubleTap = (e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastTap.current < DOUBLE_PRESS_DELAY) {
      setIsFullscreen(true);
    }
    lastTap.current = now;
  };

  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - window.scrollX - left) / width) * 100;
    const y = ((e.pageY - window.scrollY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const x = ((touch.pageX - window.scrollX - left) / width) * 100;
    const y = ((touch.pageY - window.scrollY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  // Touch Swipe Handlers for mobile swipe (both horizontal and vertical swipe support)
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    touchEndY.current = e.changedTouches[0].clientY;
    
    const diffX = touchStartX.current - touchEndX.current;
    const diffY = touchStartY.current - touchEndY.current;

    // Detect swipe (threshold of 50px)
    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Horizontal swipe
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) nextImage(); // Swiped left -> next
        else prevImage(); // Swiped right -> prev
      }
    } else {
      // Vertical swipe
      if (Math.abs(diffY) > 50) {
        if (diffY > 0) nextImage(); // Swiped up -> next
        else prevImage(); // Swiped down -> prev
      }
    }
  };

  return (
    <div className="w-full">
      {/* ── Unified Responsive Active Gallery (Thumbnails Left on PC, Right on Mobile) ── */}
      <div className="flex flex-col w-full relative">
        <div 
          className="relative w-full aspect-[3/3.6] lg:aspect-auto lg:h-[calc(100vh-140px)] lg:rounded-2xl overflow-hidden bg-neutral-50 cursor-pointer select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={handleDoubleTap}
        >
          {/* User Spec: Floating Wishlist Heart button overlayed in top-right */}
          {onWishlistToggle && (
            <div className="absolute top-4 right-4 lg:top-6 lg:right-6 z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onWishlistToggle();
                }}
                className={`p-2.5 lg:p-3 rounded-full backdrop-blur-xl border transition-all duration-300 active:scale-95 shadow-md ${
                  isWished 
                    ? 'bg-red-500/20 border-red-500/30 text-red-500 scale-105' 
                    : 'bg-black/35 border-white/10 text-white hover:bg-black/50'
                }`}
              >
                <Heart className={`w-4 h-4 lg:w-5 lg:h-5 ${isWished ? 'fill-current' : ''}`} />
              </button>
            </div>
          )}

          {/* Main Active Image with transitions */}
          <div className="w-full h-full relative">
            <AnimatePresence initial={false}>
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={images[activeIndex] || ''}
                  alt={`${name} active view`}
                  fill
                  priority
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Premium dark vignette gradient overlay for high contrast readability */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/65 via-black/20 to-transparent z-10 pointer-events-none lg:hidden" />

          {/* User Spec: Bold, large, normal (sans) product name typography & Rating stars overlayed inside mobile image (Hidden on Desktop since Desktop shows it in details column) */}
          <div className="absolute bottom-5 left-5 z-20 max-w-[80%] text-white pointer-events-none lg:hidden">
            <div className="flex items-center gap-2 mb-2 drop-shadow-sm select-none">
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white font-sans bg-black/45 backdrop-blur-md px-2.5 py-0.5 rounded border border-white/10 shadow-sm leading-none shrink-0">
                Collector's Edition
              </span>
              <div className="flex items-center gap-1 bg-black/35 backdrop-blur-md text-amber-400 px-2.5 py-0.5 rounded-full border border-white/10 leading-none shrink-0 shadow-sm">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-[9px] font-bold text-white font-mono ml-0.5 leading-none">4.9</span>
              </div>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight font-sans leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)]">
              {name}
            </h2>
          </div>

          {/* Overlay Vertical Thumb Stack (WOW Factor!) - Left on PC, Right on Mobile */}
          <div 
            className="absolute right-4 lg:right-auto lg:left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 z-20 bg-black/10 backdrop-blur-sm p-1.5 rounded-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()} // Stop trigger fullscreen on thumb click
          >
            {images.map((img, idx) => {
              const isSelected = activeIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => updateActiveIndex(idx)}
                  className={`relative w-12 h-16 lg:w-14 lg:h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 shadow-lg shrink-0 ${
                    isSelected 
                      ? 'border-white scale-110 shadow-white/20' 
                      : 'border-white/30 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image 
                    src={img || ''} 
                    fill 
                    sizes="(max-width: 1024px) 48px, 56px" 
                    className="object-cover" 
                    alt={`Thumb ${idx + 1}`} 
                  />
                </button>
              );
            })}
          </div>

          {/* Bottom Fraction Indicator */}
          <div className="absolute bottom-4 right-4 lg:bottom-6 lg:right-6 px-2.5 py-1 lg:px-3.5 lg:py-1.5 rounded-md lg:rounded-full bg-black/35 backdrop-blur-md text-[8px] lg:text-[9px] font-mono tracking-widest text-white/90">
            {(activeIndex + 1).toString().padStart(2, '0')} / {images.length.toString().padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* ── Fullscreen Viewer ── */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              const target = e.target as HTMLElement;
              const isImage = target.tagName === 'IMG';
              const isButton = target.closest('button');
              const isNav = target.closest('.nav-container');
              if (!isImage && !isButton && !isNav) setIsFullscreen(false);
            }}
            className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl flex flex-col cursor-zoom-out"
          >
            {/* Header */}
            <div className="px-6 py-5 md:px-10 flex items-center justify-between text-white relative z-[110] nav-container border-b border-white/5 bg-black/20">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/40 mb-0.5">Gallery View</span>
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-white/80">{name}</h2>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={async (e) => {
                    e.stopPropagation();
                    const shareData = { title: name, text: `Check out ${name} on Azlaan`, url: window.location.href };
                    if (navigator.share) try { await navigator.share(shareData); } catch (e) {}
                    else { navigator.clipboard.writeText(window.location.href); alert('Link copied!'); }
                  }}
                  className="group flex items-center gap-2.5 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all"
                >
                  <Share2 className="w-3.5 h-3.5 text-white/80" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/60 hidden md:block">Share</span>
                </button>
                <button 
                  onClick={() => setIsFullscreen(false)}
                  className="p-2.5 bg-white text-black rounded-full hover:scale-105 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Stage */}
            <div className="flex-1 relative flex items-center justify-center overflow-hidden touch-none">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: 100, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -100, scale: 0.95 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > 100) prevImage();
                    else if (info.offset.x < -100) nextImage();
                  }}
                  className="absolute inset-0 flex items-center justify-center p-4 md:p-8 cursor-default"
                >
                  <div 
                    className="relative w-full h-full overflow-hidden"
                  >
                    <motion.div
                      className="w-full h-full relative"
                      transition={{ type: 'spring', stiffness: 150, damping: 25, mass: 0.5 }}
                    >
                      <Image
                        src={images[activeIndex] || ''}
                        alt={name}
                        fill
                        className="object-contain select-none pointer-events-none"
                      />
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Controls (Desktop) */}
              <div className="hidden lg:flex absolute inset-0 pointer-events-none items-center justify-between px-8 nav-container">
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="pointer-events-auto p-4 rounded-full bg-black/40 hover:bg-white hover:text-black transition-all border border-white/5 backdrop-blur-xl text-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="pointer-events-auto p-4 rounded-full bg-black/40 hover:bg-white hover:text-black transition-all border border-white/5 backdrop-blur-xl text-white"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Footer with Circular Indicators */}
            <div className="p-6 flex flex-col items-center gap-4 relative z-10 bg-gradient-to-t from-black to-transparent cursor-default nav-container">
              <div className="flex items-center justify-center gap-3 overflow-x-auto no-scrollbar max-w-full px-4 py-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => updateActiveIndex(idx)}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                    className={`relative flex-shrink-0 w-12 h-12 rounded-full overflow-hidden transition-all duration-500 border outline-none focus:outline-none ${
                      activeIndex === idx 
                        ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)] z-10' 
                        : 'border-white/10 opacity-30 hover:opacity-100'
                    }`}
                  >
                    <Image 
                      src={img || ''} 
                      alt={`${name} thumbnail ${idx}`} 
                      fill 
                      className="object-cover object-top" 
                    />
                  </button>
                ))}
              </div>
              <p className="text-white/20 text-[9px] font-mono tracking-widest">
                {(activeIndex + 1).toString().padStart(2, '0')} / {images.length.toString().padStart(2, '0')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
