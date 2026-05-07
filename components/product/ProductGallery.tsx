import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, X, Share2, Download } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const lastTap = useRef<number>(0);

  const nextImage = () => setActiveIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

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

  // Handle Double Click/Tap
  const handleDoubleClick = (e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      setIsFullscreen(true);
    }
    lastTap.current = now;
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* ── Desktop Sidebar Thumbnails ── */}
      <div className="hidden xl:flex flex-col gap-4 order-2 xl:order-1">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`relative w-24 aspect-[3/4] rounded-2xl overflow-hidden transition-all duration-500 group ${
              activeIndex === idx 
                ? 'ring-2 ring-black ring-offset-2 scale-105 shadow-xl' 
                : 'opacity-50 hover:opacity-100'
            }`}
          >
            <Image src={img} alt={`${name} ${idx}`} fill className="object-cover transition-transform duration-700 group-hover:scale-110" unoptimized />
          </button>
        ))}
      </div>

      {/* ── Main Interactive Image ── */}
      <div 
        className="relative flex-1 aspect-[3/4] rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-gray-50 order-1 xl:order-2 group shadow-2xl cursor-zoom-in"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsZoomed(true)}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => setIsZoomed(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full h-full"
            onPointerDown={handleDoubleClick}
            onDoubleClick={() => setIsFullscreen(true)}
          >
            <motion.div
              className="w-full h-full relative"
              animate={{
                scale: isZoomed ? 2.2 : 1,
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
              }}
              transition={{ type: 'spring', stiffness: 150, damping: 25, mass: 0.5 }}
            >
              <Image
                src={images[activeIndex]}
                alt={name}
                fill
                priority
                className="object-cover select-none"
                unoptimized
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Floating Navigation Controls */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-6">
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="pointer-events-auto p-4 rounded-full bg-white/20 backdrop-blur-xl text-black hover:bg-white transition-all shadow-2xl opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="pointer-events-auto p-4 rounded-full bg-white/20 backdrop-blur-xl text-black hover:bg-white transition-all shadow-2xl opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Enhanced Fullscreen Button */}
        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute bottom-8 right-8 p-4 rounded-3xl bg-black/80 backdrop-blur-xl text-white hover:bg-black hover:scale-110 transition-all shadow-2xl group/fs"
        >
          <Maximize2 className="w-6 h-6 group-hover/fs:scale-125 transition-transform" />
        </button>

        {/* Image Index Indicator */}
        <div className="absolute top-8 right-8 px-4 py-2 rounded-full bg-black/10 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-black/40">
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {/* ── Mobile/Tablet Bottom Thumbnails ── */}
      <div className="flex xl:hidden gap-3 overflow-x-auto no-scrollbar py-4 px-2 order-3 scroll-smooth">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`relative min-w-[100px] aspect-[3/4] rounded-2xl overflow-hidden transition-all duration-500 ${
              activeIndex === idx 
                ? 'ring-2 ring-black ring-offset-2 scale-95 shadow-lg' 
                : 'opacity-50'
            }`}
          >
            <Image src={img} alt={`${name} ${idx}`} fill className="object-cover" unoptimized />
          </button>
        ))}
      </div>

      {/* ── Ultra Modern Fullscreen Viewer ── */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              // Close if clicked on background (not on image, buttons or thumbnails)
              const target = e.target as HTMLElement;
              const isImage = target.tagName === 'IMG';
              const isButton = target.closest('button');
              const isNav = target.closest('.nav-container');
              if (!isImage && !isButton && !isNav) setIsFullscreen(false);
            }}
            className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl flex flex-col cursor-zoom-out"
          >
            {/* Viewer Header */}
            <div className="px-6 py-4 md:px-10 md:py-6 flex items-center justify-between text-white relative z-[110] nav-container">
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40 mb-1">Gallery View</span>
                <h2 className="text-xs font-bold uppercase tracking-widest">{name}</h2>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={async (e) => {
                    e.stopPropagation();
                    const shareData = { title: name, text: `Check out ${name} on Azlaan`, url: window.location.href };
                    if (navigator.share) try { await navigator.share(shareData); } catch (e) {}
                    else { navigator.clipboard.writeText(window.location.href); alert('Link copied!'); }
                  }}
                  className="group flex items-center gap-3 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-[9px] font-black uppercase tracking-widest hidden md:block">Share</span>
                </button>
                <button 
                  onClick={() => setIsFullscreen(false)}
                  className="p-3 bg-white text-black rounded-full hover:rotate-90 transition-all duration-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Viewer Stage */}
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
                  <div className="relative w-full h-full">
                    <Image
                      src={images[activeIndex]}
                      alt={name}
                      fill
                      className="object-contain select-none pointer-events-none"
                      unoptimized
                    />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Viewer Navigation (Desktop) */}
              <div className="hidden lg:flex absolute inset-0 pointer-events-none items-center justify-between px-6 nav-container">
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="pointer-events-auto p-4 rounded-full bg-black/40 hover:bg-white hover:text-black transition-all border border-white/10 backdrop-blur-xl"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="pointer-events-auto p-4 rounded-full bg-black/40 hover:bg-white hover:text-black transition-all border border-white/10 backdrop-blur-xl"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Viewer Footer (Compact Circular Thumbnails) */}
            <div className="p-4 md:p-6 flex flex-col items-center gap-4 relative z-10 bg-gradient-to-t from-black to-transparent cursor-default nav-container">
              <div className="flex items-center justify-center gap-4 overflow-x-auto no-scrollbar max-w-full px-4 py-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                    className={`relative flex-shrink-0 w-14 h-14 aspect-square rounded-full overflow-hidden transition-all duration-700 border outline-none focus:outline-none ${
                      activeIndex === idx 
                        ? 'border-white scale-110 shadow-[0_0_20px_rgba(255,255,255,0.4)] z-10' 
                        : 'border-white/10 opacity-30 hover:opacity-100'
                    }`}
                  >
                    <Image 
                      src={img} 
                      alt={`${name} ${idx}`} 
                      fill 
                      className="object-cover object-top" 
                      unoptimized 
                    />
                  </button>
                ))}
              </div>
              
              <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.4em]">
                {activeIndex + 1} / {images.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
