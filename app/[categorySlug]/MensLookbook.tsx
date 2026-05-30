'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';

const LOOKBOOK_ITEMS = [
  {
    id: 1,
    title: 'The Signature Silk',
    subtitle: 'Heritage Reimagined',
    image: '/media-pro/men/Design 5/650905571_122120824035151981_4320891712881698677_n.webp',
    align: 'left'
  },
  {
    id: 2,
    title: 'Modern Tailoring',
    subtitle: 'Precision Fit',
    image: '/media-pro/men/Design 14/651337020_122121225477151981_322056965429338679_n.webp',
    align: 'right'
  }
];

export default function MensLookbook() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [200, -200]);

  return (
    <section ref={containerRef} className="bg-[#f5f5f7] py-24 md:py-32 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6">
        <motion.div 
          style={{ y: useTransform(scrollYProgress, [0, 1], [50, -50]) }}
          className="mb-20"
        >
          <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-black/40 mb-4">Editorial</h2>
          <h3 className="text-4xl md:text-7xl font-sans font-black tracking-tighter uppercase leading-[0.9]">
            The Azlaan <br />
            <span className="font-serif italic font-light lowercase tracking-normal">Lookbook</span>
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          {LOOKBOOK_ITEMS.map((item, index) => (
            <motion.div
              key={item.id}
              style={{ y: index === 0 ? y1 : y2 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`relative group ${item.align === 'right' ? 'md:mt-32' : ''}`}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-700" />
                <div className="absolute bottom-12 left-12 right-12">
                  <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-2 block">{item.subtitle}</span>
                  <h4 className="text-white text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6">{item.title}</h4>
                  <button className="flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-[0.2em] group/btn">
                    <span>Explore Collection</span>
                    <div className="w-8 h-[1px] bg-white/40 group-hover/btn:w-12 group-hover/btn:bg-white transition-all duration-500" />
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
