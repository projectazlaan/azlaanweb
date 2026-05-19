'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

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

export default function SubCategoryCards({ 
  onSubSelect, 
  activeSlide = 0
}: { 
  onSubSelect: (sub: string) => void,
  activeSlide?: number
}) {
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const cardWidth = isMobile ? 250 : 400;
  const cardGap = isMobile ? 16 : 32;

  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative flex items-center h-[160px] md:h-[260px]">
        <motion.div 
          className="flex gap-4 md:gap-8"
          animate={{ x: -(activeSlide * (cardWidth + cardGap)) }}
          transition={{ 
            type: "spring", 
            stiffness: 40,
            damping: 25,
            mass: 1.5,
            restDelta: 0.001
          }}
        >
          {SUB_CATEGORIES.map((sub, index) => {
            const isActive = activeSlide === index;
            return (
              <motion.button
                key={sub.name}
                onClick={() => onSubSelect(sub.name)}
                animate={{ 
                  scale: isActive ? 1.05 : 0.9,
                  opacity: isActive ? 1 : 0.4,
                }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                className={`relative flex flex-col justify-end p-5 md:p-8 rounded-[24px] md:rounded-[40px] transition-shadow duration-700 w-[250px] md:w-[400px] h-[140px] md:h-[220px] text-left shrink-0 overflow-hidden group ${isActive ? 'shadow-[0_40px_100px_rgba(0,0,0,0.5)] z-20 border border-white/20' : 'z-10 opacity-40'}`}
              >
                {/* Background Image with Precise Top Focus */}
                <Image 
                  src={sub.image} 
                  alt={sub.name} 
                  fill 
                  className={`object-cover object-[50%_15%] transition-transform duration-[3000ms] ease-out ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} 
                />
                
                {/* Cinema Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${isActive ? 'from-black/90 via-black/30' : 'from-black/70 via-transparent'} to-transparent transition-opacity duration-1000`} />

                {/* Content Layer */}
                <div className="relative z-10 transform transition-transform duration-700 group-hover:translate-y-[-5px]">
                  <h4 className="text-sm md:text-2xl font-black tracking-tight text-white uppercase mb-1">{sub.name}</h4>
                  <p className="text-[10px] md:text-sm font-serif italic text-white/60 line-clamp-1">{sub.description}</p>
                </div>

                {isActive && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute left-0 bottom-0 w-full h-1 bg-white z-20"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
