'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';

const categories = [
  { 
    name: 'Men', 
    image: '/media-pro/men/Design 5/650905571_122120824035151981_4320891712881698677_n.webp', 
    href: '/men',
    subtitle: 'Signature Classics',
    position: 'object-[center_55%]'
  },
  { 
    name: 'Women', 
    image: '/media-pro/women/Design 2/672121181_122125885095151981_7790861692313383598_n.webp', 
    href: '/women',
    subtitle: 'Timeless Elegance',
    position: 'object-[center_60%]'
  },
  { 
    name: 'Kids', 
    image: '/media-pro/women/Design 1/673191812_122125962327151981_8385571386878315506_n.webp', 
    href: '/kids', 
    soon: true,
    subtitle: 'Little Ones',
  },
  { 
    name: 'Fabric', 
    image: '/media-pro/cover/cover 4.jpg', 
    href: '/fabric',
    subtitle: 'Premium Textiles',
  },
  { 
    name: 'Exclusive', 
    image: '/media-pro/cover/cover 1.jpg', 
    href: '/exclusive',
    subtitle: 'Limited Collection',
  },
];

function CategoryCard({ cat, index, total }: { cat: any, index: number, total: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax for content within the card
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div 
      ref={containerRef}
      className="sticky top-[60px] md:top-[68px] w-full h-[210px] md:h-[300px] overflow-hidden bg-white z-[20]"
      style={{ zIndex: 20 + index }}
    >
      <Link 
        href={cat.href}
        className="group relative flex w-full h-full overflow-hidden"
      >
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <Image 
            src={cat.image} 
            alt={cat.name} 
            fill 
            className={`object-cover ${cat.position || 'object-top'} transition-transform duration-[3s] group-hover:scale-110`}
            priority={index < 2}
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 opacity-90 md:opacity-100" 
             style={{ 
               background: 'linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 35%, rgba(0,0,0,0) 80%)' 
             }} 
        />

        {/* Content with Parallax and Masking */}
        <motion.div 
          style={{ 
            y: contentY, 
            opacity: contentOpacity,
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0px, transparent 50px, black 120px, black 100%)',
            maskImage: 'linear-gradient(to bottom, transparent 0px, transparent 50px, black 120px, black 100%)'
          }}
          className="absolute inset-y-0 left-0 w-full md:w-[45%] flex items-center justify-start px-6 md:px-12 lg:px-20 z-10 pointer-events-none"
        >
          <div className="flex flex-col items-start text-left max-w-sm pointer-events-auto">
            <span className="text-[9px] md:text-[11px] font-bold tracking-[0.3em] uppercase text-white/70 mb-2 md:mb-3 transition-all duration-700 group-hover:text-white group-hover:tracking-[0.4em]">
              {cat.subtitle}
            </span>

            <h2 className="font-sans text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white mb-4 md:mb-6 leading-none transition-all duration-700 group-hover:scale-105 origin-left">
              {cat.name}
              {cat.soon && (
                <span className="ml-3 inline-block align-middle bg-white/10 backdrop-blur-md border border-white/20 text-[8px] md:text-[10px] px-2 py-0.5 rounded-full font-bold tracking-widest">
                  SOON
                </span>
              )}
            </h2>

            <div className="flex items-center gap-3 opacity-60 group-hover:opacity-100 transition-all duration-500">
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white">
                Shop Now
              </span>
              <div className="w-8 md:w-12 h-[1px] bg-white group-hover:w-16 transition-all duration-700" />
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Border Divider */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10 z-20" />
      </Link>
    </div>
  );
}

export default function CategoryNav({ showAll = true }: { showAll?: boolean }) {
  const displayCategories = showAll ? categories : categories.slice(0, 2);

  return (
    <>
      <section className="relative w-full bg-white -mt-px">
        <div className="flex flex-col md:grid md:grid-cols-2 w-full">
          {displayCategories.map((cat, i) => (
            <CategoryCard 
              key={cat.name} 
              cat={cat} 
              index={i} 
              total={displayCategories.length} 
            />
          ))}
          
          {/* 
            SCROLL TRACK: Higher z-index than cards to allow the reveal layer 
            to slide over both desktop cards at once.
          */}
          {!showAll && (
            <div className="col-span-full h-[210px] md:h-[300px] bg-white pointer-events-none" />
          )}
        </div>
      </section>


      {/* 
        REVEAL LAYER: This panel and the New Collection below it 
        will slide UP together over the stuck Category section.
      */}
      {!showAll && (
        <div 
          className="relative z-[100] bg-white py-3 flex justify-center items-center w-full -mt-[210px] md:-mt-[300px] shadow-[0_-10px_40px_rgba(0,0,0,0.08)] border-b border-black/[0.05]"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%)'
          }}
        >
          <Link 
            href="/all-categories" 
            className="group relative flex items-center gap-3 px-8 py-2.5 rounded-full border border-black/20 hover:border-black/40 bg-white transition-all duration-700 overflow-hidden shadow-sm"
          >
            <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-black/80 group-hover:text-black transition-colors">
              View All Category
            </span>
            <div className="w-8 md:w-12 h-[0.5px] bg-black/30 group-hover:bg-black group-hover:w-16 transition-all duration-700" />
            <ArrowRight className="w-4 h-4 text-black/60 group-hover:text-black group-hover:translate-x-1 transition-all duration-500" />
            <div className="absolute inset-0 bg-black/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          </Link>
        </div>
      )}

    </>
  );
}





