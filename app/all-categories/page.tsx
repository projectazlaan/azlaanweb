'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Scissors, Globe, User } from 'lucide-react';
import PromoBanner from '@/components/PromoBanner';

const CATEGORIES = [
  {
    name: 'Men',
    subtitle: 'Modern Uniform',
    slug: 'men',
    image: '/media-pro/men/Design 5/650905571_122120824035151981_4320891712881698677_n.webp',
    bgPosition: 'object-[center_35%]',
    colSpan: 'col-span-2 md:col-span-8',
    height: 'h-[500px] md:h-[580px]',
  },
  {
    name: 'Women',
    subtitle: 'Elevated Silhouettes',
    slug: 'women',
    image: '/media-pro/women/Design 2/672121181_122125885095151981_7790861692313383598_n.webp',
    bgPosition: 'object-[center_35%]',
    colSpan: 'col-span-1 md:col-span-4',
    height: 'h-[300px] md:h-[580px]',
  },
  {
    name: 'Exclusive',
    subtitle: 'Limited Atelier',
    slug: 'exclusive',
    image: '/media-pro/cover/cover 1.jpg',
    bgPosition: 'object-center',
    colSpan: 'col-span-1 md:col-span-4',
    height: 'h-[300px] md:h-[580px]',
  },
  {
    name: 'Fabric',
    subtitle: 'Tactile Foundation',
    slug: 'fabric',
    image: '/media-pro/cover/cover 2.jpg',
    bgPosition: 'object-center',
    colSpan: 'col-span-2 md:col-span-4',
    height: 'h-[280px] md:h-[580px]',
  },
  {
    name: 'Kids',
    subtitle: 'Heritage Play',
    slug: 'kids',
    image: '/media-pro/women/Design 1/673191812_122125962327151981_8385571386878315506_n.webp',
    bgPosition: 'object-[center_45%]',
    colSpan: 'col-span-2 md:col-span-4',
    height: 'h-[400px] md:h-[580px]',
    soon: true,
  }
];

export default function AllCategoriesPage() {
  return (
    <main className="min-h-screen bg-[#f8f7f3] pt-8 md:pt-12 pb-20 md:pb-32 selection:bg-black selection:text-white">
      
      {/* ── Cinematic Marquee Header ── */}
      <div className="relative w-full mb-4 md:mb-8 pt-2 md:pt-6 pb-2 overflow-hidden flex items-center">
        
        {/* Background Marquee Layer */}
        <div className="absolute inset-0 flex items-center z-0 pointer-events-none opacity-[0.06]">
          <motion.div
            animate={{ x: [0, -2000] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 40,
            }}
            className="flex whitespace-nowrap"
          >
            {[...Array(6)].map((_, i) => (
              <span 
                key={i} 
                className="text-7xl md:text-[140px] font-black uppercase tracking-tighter text-black mx-4 leading-none" 
                style={{ WebkitTextStroke: '2px black', color: 'transparent' }}
              >
                AZLAAN ARCHIVE — THE COLLECTIONS — 
              </span>
            ))}
          </motion.div>
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left"
          >
            <span className="text-[10px] md:text-[11px] font-bold tracking-[0.3em] uppercase text-black/50 mb-2 block">
              Curated Editorials
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-[#1d1d1f] leading-none drop-shadow-sm">
              The Collections.
            </h1>
          </motion.div>
        </div>
      </div>

      {/* ── Asymmetric Editorial Grid ── */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 1, 0.5, 1] }}
                className={cat.colSpan}
              >
                {cat.soon ? (
                  <div className={cardClasses}>
                    {CardContent}
                  </div>
                ) : (
                  <Link href={`/shop?category=${cat.slug}`} className={cardClasses}>
                    {CardContent}
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Promotional Banner ── */}
      <div className="mt-16 md:mt-24">
        <PromoBanner />
      </div>

      {/* ── 1. The Brand Manifesto ── */}
      <section className="max-w-[1000px] mx-auto px-6 md:px-12 pt-8 md:pt-12 pb-16 md:pb-24 text-center border-t border-black/5 mt-8 md:mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center max-w-4xl mx-auto"
        >
          <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-4 block">Our Philosophy</span>
          <h2 className="font-serif italic text-3xl md:text-5xl text-primary leading-tight mb-4 md:mb-6">
            The Azlaan Heritage
          </h2>
          <p className="text-gray-500 leading-relaxed text-sm md:text-xl font-light italic px-4 md:px-12">
            "Woven in time. Crafted for tomorrow. Azlaan represents the absolute pinnacle of Bengal's artisanal heritage."
          </p>
        </motion.div>
      </section>

      {/* ── 2. Cinematic Ambient Reel (Ultra-Wide Parallax) ── */}
      <section className="w-full h-[40vh] md:h-[60vh] relative overflow-hidden bg-black">
        <motion.div
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src="/media-pro/cover/cover 3.jpg"
            alt="Ambient Reel"
            fill
            className="object-cover object-[center_40%] opacity-70"
            sizes="100vw"
          />
        </motion.div>
      </section>

      {/* ── 3. Bespoke Concierge Services ── */}
      <section className="py-8 md:py-12 border-t border-black/5 mt-8 md:mt-12">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
          {[
            { icon: Scissors, title: 'Bespoke Tailoring', desc: 'Custom fitting and alterations crafted to your exact measurements.' },
            { icon: Globe, title: 'Global Delivery', desc: 'Complimentary expedited shipping on all international luxury orders.' },
            { icon: User, title: 'Private Styling', desc: 'Book a virtual or in-store appointment with our concierge stylists.' }
          ].map((service, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="flex flex-col items-center space-y-3"
            >
              <div className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center mb-2">
                <service.icon className="w-5 h-5 text-[#1d1d1f]" strokeWidth={1.5} />
              </div>
              <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#1d1d1f]">{service.title}</h4>
              <p className="text-[11px] md:text-xs text-gray-500 font-medium max-w-[250px] leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

    </main>
  );
}
