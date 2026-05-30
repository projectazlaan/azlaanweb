'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, Star, ChevronDown } from 'lucide-react';
import { useRef } from 'react';

interface SubCategory {
  name: string;
  image: string;
  description: string;
}

const SUB_CATEGORIES: SubCategory[] = [
  {
    name: "Panjabi",
    image: "/media-pro/men/Design 5/650905571_122120824035151981_4320891712881698677_n.webp",
    description: "The Essence of Modern Sophistication"
  },
  {
    name: "Classic Kurtas",
    image: "/media-pro/men/Design 11/650770969_122120920443151981_7419337193691681295_n.webp",
    description: "Refined Simplicity & Artisanal Details"
  },
  {
    name: "Formal Shirts",
    image: "/media-pro/men/Design 14/651337020_122121225477151981_322056965429338679_n.webp",
    description: "Precision Fit for the Modern Professional"
  },
  {
    name: "Chino Pants",
    image: "/media-pro/men/Design 12/651225702_122121211317151981_899219807548154935_n.webp",
    description: "Versatile Style for Every Occasion"
  },
  {
    name: "Casual Edit",
    image: "/media-pro/men/Design 6/650061703_122120930277151981_1200600818769491462_n.webp",
    description: "Effortless Comfort & Contemporary Living"
  }
];

export default function MensHero({ onSubSelect }: { onSubSelect: (sub: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const yBackground = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const yModel = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacityModel = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={containerRef} className="relative h-screen min-h-[700px] w-full bg-[#f8f8f8] overflow-hidden">
      {/* Background Shapes/Deco */}
      <motion.div 
        style={{ y: yBackground }}
        className="absolute top-20 right-0 w-[60%] h-[80%] bg-white rounded-l-[300px] z-0 opacity-50 hidden md:block" 
      />
      
      {/* Top Bar Text */}
      <div className="absolute top-6 md:top-12 left-8 md:left-24 z-20 flex items-center gap-12">
        <div className="flex items-center gap-3">
          <p className="text-[8px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-tight">Hello Brooklyn!<br/>welcome to Azlaan</p>
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden relative border-2 border-amber-100">
             <Image src="/media-pro/men/Design 5/650905571_122120824035151981_4320891712881698677_n.webp" alt="Avatar" fill className="object-cover" />
          </div>
        </div>
        <p className="hidden lg:block text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
          Beautifully efficient apparel for<br/>the modern world
        </p>
      </div>

      {/* Main Content */}
      <div className="relative z-20 h-full flex flex-col justify-start md:justify-center pt-24 md:pt-0 px-6 md:px-24">
        <div className="max-w-4xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } }
            }}
          >
            <h1 className="text-[48px] md:text-[140px] font-sans font-black leading-[0.9] md:leading-[0.85] tracking-tighter text-[#1a1a1a] flex flex-col items-start">
              <motion.span 
                variants={{
                  hidden: { opacity: 0, y: 50, rotateX: -90 },
                  visible: { opacity: 1, y: 0, rotateX: 0, transition: { type: "spring", damping: 12, stiffness: 100 } }
                }}
                className="origin-bottom block"
              >
                Fresh &
              </motion.span>
              <motion.span 
                variants={{
                  hidden: { opacity: 0, y: 50, rotateX: -90 },
                  visible: { opacity: 1, y: 0, rotateX: 0, transition: { type: "spring", damping: 12, stiffness: 100 } }
                }}
                className="flex items-center gap-3 md:gap-4 origin-bottom"
              >
                <div className="w-16 md:w-40 h-10 md:h-24 rounded-full overflow-hidden relative mt-1 md:mt-4 shadow-xl">
                  <Image src="/media-pro/men/Design 6/650061703_122120930277151981_1200600818769491462_n.webp" alt="In-text image" fill className="object-cover" />
                </div>
                Stylish
              </motion.span>
            </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-8 md:mt-12 flex flex-col md:flex-row md:items-center gap-6 md:gap-8"
          >
            <p className="text-gray-500 text-[10px] md:text-base font-medium max-w-[200px] md:max-w-xs leading-relaxed uppercase tracking-widest">
              Your Gateway to Chic and <br/> Contemporary Living
            </p>
            <button className="w-fit flex items-center gap-4 bg-black text-white px-6 py-3 md:px-10 md:py-5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-transform group">
              <span>Explore Our Store</span>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform">
                <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Floating Model Image */}
      <motion.div 
        style={{ y: yModel, opacity: opacityModel }}
        initial={{ opacity: 0, scale: 0.8, x: 100 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
        className="absolute bottom-0 right-0 md:right-[5%] w-full md:w-[45%] h-[60%] md:h-[80%] z-10 md:z-0 pointer-events-none origin-bottom"
      >
        <Image 
          src="/media-pro/men/Design 11/650770969_122120920443151981_7419337193691681295_n.webp" 
          alt="Main Model" 
          fill 
          className="object-contain object-bottom opacity-40 md:opacity-100 drop-shadow-2xl"
          priority
        />
      </motion.div>

      {/* Side Swipe Subcategory Cards */}
      <div className="absolute bottom-6 md:bottom-12 left-0 w-full z-30">
        <div className="max-w-[1600px] mx-auto px-6 md:px-24">
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 min-w-max pr-24">
            {SUB_CATEGORIES.map((sub, index) => (
              <motion.button
                key={sub.name}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + (index * 0.1), duration: 0.5 }}
                onClick={() => onSubSelect(sub.name)}
                className="group relative flex items-center gap-4 md:gap-6 bg-white/95 backdrop-blur-xl p-3 md:p-6 rounded-[30px] md:rounded-[40px] shadow-2xl border border-white hover:bg-white transition-all w-[240px] md:w-[380px] text-left active:scale-95"
              >
                <div className="relative w-16 md:w-32 h-16 md:h-32 rounded-[20px] md:rounded-[30px] overflow-hidden shrink-0">
                  <Image src={sub.image} alt={sub.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5 md:mb-1">
                    <h4 className="text-lg md:text-2xl font-black text-[#1a1a1a] tracking-tight">{sub.name}'s</h4>
                    <ArrowUpRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 group-hover:text-black transition-colors" />
                  </div>
                  <p className="text-xs md:text-lg font-serif italic text-gray-400 mb-1 md:mb-2">Collection</p>
                  <p className="text-[7px] md:text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-none">{sub.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Ratings/Badge (Top Right) */}
      <div className="absolute top-6 md:top-12 right-8 md:right-24 z-20 flex flex-col items-end">
        <div className="flex items-center gap-1.5 mb-1 md:mb-2">
          {['🔥', '👍', '🙌', '😍', '💙', '🤞', '✨'].map((emoji, i) => (
            <motion.span 
              key={i} 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + (i * 0.1), type: "spring" }}
              className="text-[10px] md:text-sm drop-shadow-sm"
            >
              {emoji}
            </motion.span>
          ))}
        </div>
        <p className="text-[7px] md:text-[9px] font-black uppercase tracking-widest text-gray-400">
          Loved From <span className="text-black border-b border-black">500k Users</span>
        </p>
      </div>

      {/* Floating Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-6 right-8 md:right-24 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400 rotate-90 origin-right translate-x-3">Scroll</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-gray-400 mt-6" />
        </motion.div>
      </motion.div>
    </section>
  );
}
