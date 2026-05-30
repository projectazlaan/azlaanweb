'use client';
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import Footer from '@/components/Footer';

const CATEGORIES = [
  {
    name: 'Men',
    subtitle: 'Modern Uniform',
    slug: 'men',
    image: '/media-pro/men/Design 5/650905571_122120824035151981_4320891712881698677_n.webp',
    bgPosition: 'object-[center_35%]',
    colSpan: 'col-span-2 md:col-span-8',
    height: 'h-[320px] md:h-[330px]',
  },
  {
    name: 'Women',
    subtitle: 'Elevated Silhouettes',
    slug: 'women',
    image: '/media-pro/women/Design 2/672121181_122125885095151981_7790861692313383598_n.webp',
    bgPosition: 'object-[center_35%]',
    colSpan: 'col-span-1 md:col-span-4',
    height: 'h-[200px] md:h-[330px]',
  },
  {
    name: 'Exclusive',
    subtitle: 'Limited Atelier',
    slug: 'exclusive',
    image: '/media-pro/cover/cover 1.jpg',
    bgPosition: 'object-center',
    colSpan: 'col-span-1 md:col-span-4',
    height: 'h-[200px] md:h-[330px]',
  },
  {
    name: 'Fabric',
    subtitle: 'Tactile Foundation',
    slug: 'fabric',
    image: '/media-pro/cover/cover 2.jpg',
    bgPosition: 'object-center',
    colSpan: 'col-span-2 md:col-span-4',
    height: 'h-[200px] md:h-[330px]',
  },
  {
    name: 'Kids',
    subtitle: 'Heritage Play',
    slug: 'kids',
    image: '/media-pro/women/Design 1/673191812_122125962327151981_8385571386878315506_n.webp',
    bgPosition: 'object-[center_45%]',
    colSpan: 'col-span-2 md:col-span-4',
    height: 'h-[220px] md:h-[330px]',
    soon: true,
  }
];

export default function AllCategoriesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressVal = useMotionValue(0);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const scrollTop = el.scrollTop;
      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll > 0) {
        const progress = scrollTop / maxScroll;
        progressVal.set(progress);
        setScrollPercent(Math.min(Math.round(progress * 100), 100));
      }
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      el.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const titleY = useTransform(progressVal, [0, 0.45], [260, 0]);
  const titleScale = useTransform(progressVal, [0, 0.45], [0.65, 1.0]);
  const curatedOpacity = useTransform(progressVal, [0.15, 0.45], [0, 1]);
  const readyOpacity = useTransform(progressVal, [0.15, 0.45], [0, 1]);
  const readyY = useTransform(progressVal, [0.15, 0.45], [30, 0]);


  // Viewfinder Camera Brackets
  const bracketOpacity = useTransform(progressVal, [0.12, 0.42], [0, 0.7]);
  const bracketOffset = useTransform(progressVal, [0.12, 0.42], [32, -8]);

  return (
    <main 
      ref={containerRef} 
      className="h-screen w-full overflow-y-auto snap-y snap-mandatory scroll-smooth bg-[#f8f7f3] selection:bg-black selection:text-white"
    >
      {/* ── Screen 1 & 2: Unified Cinematic Scrollytelling Cover ── */}
      <div className="relative h-[200vh] w-full">
        {/* Sticky Visual Content */}
        <div 
          onClick={() => {
            if (containerRef.current) {
              containerRef.current.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
            }
          }}
          className="sticky top-0 left-0 w-full h-screen flex flex-col justify-center items-start overflow-hidden bg-[#f8f7f3] cursor-pointer"
        >
          
          {/* Left-Aligned Typography Elements */}
          <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 text-left flex flex-col justify-center items-start -mt-[50px]">
            
            <div className="relative flex flex-col items-start">
              {/* Main Title Container */}
              <motion.div 
                style={{ y: titleY, scale: titleScale, transformOrigin: 'left center' }} 
                className="relative flex flex-col items-start px-8 py-4"
              >
                {/* Top line: New (Serif Italic) */}
                <motion.span 
                  style={{ opacity: curatedOpacity }}
                  className="absolute bottom-full left-8 -mb-3 md:-mb-5 font-serif italic text-3xl md:text-5xl text-neutral-800 font-light tracking-wide select-none whitespace-nowrap"
                >
                  New
                </motion.span>
                
                <h1 className="font-sans text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-neutral-900 leading-none select-none my-1">
                  Collections.
                </h1>

                {/* Bottom line: — READY FOR EXPLORE — */}
                <motion.div 
                  style={{ opacity: readyOpacity, y: readyY }}
                  className="absolute top-full left-8 -mt-1 md:-mt-2 flex items-center justify-start gap-3 md:gap-4 select-none whitespace-nowrap"
                >
                  <span className="text-[9px] md:text-[10px] font-bold tracking-[0.4em] uppercase text-neutral-800 font-sans">
                    READY FOR EXPLORE
                  </span>
                  <div className="h-[1px] w-12 md:w-20 bg-neutral-300" />
                </motion.div>
              </motion.div>
            </div>

          </div>
        </div>

        {/* Snap Targets for Screen 1 and Screen 2 */}
        <div className="absolute top-0 left-0 w-full h-screen snap-start snap-always pointer-events-none" />
        <div className="absolute top-[100vh] left-0 w-full h-screen snap-start snap-always pointer-events-none" />
      </div>

      {/* ── Screen 3: Bento Category Grid ── */}
      <div className="w-full min-h-screen lg:h-screen snap-start snap-always shrink-0 flex flex-col justify-center items-center relative py-12 md:py-16 overflow-y-auto bg-[#f8f7f3] z-20">
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
          
          <div className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-5">
            {CATEGORIES.map((cat, index) => {
              const cardClasses = `relative block w-full ${cat.height} bg-white rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)] group ${cat.soon ? 'cursor-default' : 'cursor-pointer'}`;

              const CardContent = (
                <>
                  {/* Background Image */}
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className={`object-cover ${cat.bgPosition} transition-transform duration-[2s] ease-[0.25,1,0.5,1] ${cat.soon ? '' : 'group-hover:scale-[1.02]'}`}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index < 2}
                  />

                  {/* Cinematic Overlay Fade */}
                  <div className={`absolute inset-0 transition-colors duration-700 ${cat.soon ? 'bg-black/10' : 'bg-black/5 group-hover:bg-black/20'}`} />
                  
                  {/* Text Protection Gradient */}
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/40 to-transparent opacity-80" />

                  {/* Typography & Content */}
                  <div className="absolute inset-0 p-5 md:p-8 flex flex-col justify-between">
                    <div>
                      <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-white mb-1 drop-shadow-md">
                        {cat.name}
                      </h2>
                      <p className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-white/80 drop-shadow-sm">
                        {cat.subtitle}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-end">
                      {cat.soon ? (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 border border-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                          Coming Soon
                        </span>
                      ) : (
                        <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-white opacity-90 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500">
                          <span>Enter</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  </div>
                </>
              );

              return (
                <motion.div
                  key={cat.slug}
                  initial={{ opacity: 0, y: 70, scale: 0.95, filter: 'blur(8px)' }}
                  whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                  viewport={{ once: true, margin: "50px" }}
                  transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                  className={cat.colSpan}
                >
                  {cat.soon ? (
                    <div className={cardClasses}>
                      {CardContent}
                    </div>
                  ) : (
                    <Link href={`/${cat.slug}`} className={cardClasses}>
                      {CardContent}
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Screen 4: Footer Snap Point ── */}
      <div className="w-full snap-start snap-always shrink-0 bg-[#f8f7f3]">
        <Footer />
      </div>
    </main>
  );
}
