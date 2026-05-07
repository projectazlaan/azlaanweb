'use client'

import { Star, Quote } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Testimonial {
  id: string
  name: string
  nameBn: string
  location: string
  locationBn: string
  review: string
  reviewBn: string
  initial: string
  image: string
  rating: number
}

const DUMMY_TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Rahim Khan',
    nameBn: 'রহিম খান',
    location: 'Dhaka',
    locationBn: 'ঢাকা',
    review: 'The quality of Azlaan suits is unmatched in Bangladesh. Truly premium feel and perfect fit!',
    reviewBn: 'আজলানের স্যুটের মান বাংলাদেশে অপ্রতিদ্বন্দ্বী। সত্যিই প্রিমিয়াম অনুভূতি এবং নিখুঁত ফিট!',
    initial: 'R',
    image: '/media-pro/men/Design 1/649824908_122120770023151981_1372810042799937270_n.webp',
    rating: 5
  },
  {
    id: 't2',
    name: 'Sarah Ahmed',
    nameBn: 'সারাহ আহমেদ',
    location: 'Chittagong',
    locationBn: 'চট্টগ্রাম',
    review: 'Elegant designs and comfortable fabric. Azlaan has become my go-to brand for festive wear.',
    reviewBn: 'বিশুদ্ধ ডিজাইন এবং আরামদায়ক কাপড়। ফরমাল পোশাকের জন্য আজলান আমার প্রথম পছন্দ।',
    initial: 'S',
    image: '/media-pro/women/Design 2/671639040_122125885023151981_7657790961365514375_n.webp',
    rating: 5
  },
  {
    id: 't3',
    name: 'Karim Uddin',
    nameBn: 'করিম উদ্দিন',
    location: 'Sylhet',
    locationBn: 'সিলেট',
    review: 'Bought a Panjabi for my wedding. The craftsmanship and design exceeded my expectations!',
    reviewBn: 'আমার বিয়ের জন্য একটি পাঞ্জাবি কিনেছি। মান এবং ডিজাইন আমার প্রত্যাশার চেয়েও ভালো!',
    initial: 'K',
    image: '/media-pro/men/Design 2/649486384_122120775759151981_5241916048356926520_n.webp',
    rating: 5
  },
  {
    id: 't4',
    name: 'Anika Tabassum',
    nameBn: 'আনিকা তাবাসসুম',
    location: 'Dhaka',
    locationBn: 'ঢাকা',
    review: 'Absolutely love the women\'s collection. The colors are vibrant and the stitching is perfect.',
    reviewBn: 'নারীদের কালেকশনগুলো দারুণ। রঙগুলো চমৎকার এবং সেলাই একদম নিখুঁত।',
    initial: 'A',
    image: '/media-pro/women/Design 3/670896434_122125960101151981_3029998908890020858_n.webp',
    rating: 5
  },
  {
    id: 't5',
    name: 'Zayed Mansur',
    nameBn: 'জায়েদ মনসুর',
    location: 'Rajshahi',
    locationBn: 'রাজশাহী',
    review: 'Fast delivery and excellent customer service. The product quality is consistently high.',
    reviewBn: 'দ্রুত ডেলিভারি এবং চমৎকার কাস্টমার সার্ভিস। পণ্যের মান সব সময় সেরা।',
    initial: 'Z',
    image: '/media-pro/men/Design 3/650030190_122121217221151981_4107622559203671909_n.webp',
    rating: 5
  }
]

export default function Testimonials() {
  const [testimonials] = useState<Testimonial[]>(DUMMY_TESTIMONIALS)
  
  // Create infinite scroll array
  const infiniteTestimonials = [...testimonials, ...testimonials, ...testimonials, ...testimonials]

  return (
    <section className="py-24 overflow-hidden bg-white relative">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0071E3]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gray-100 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full">
        {/* Header - Minimal & Premium */}
        <div className="text-center mb-16 md:mb-24 px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center leading-[0.85] md:leading-[0.8]"
          >
            <span className="font-serif italic text-2xl md:text-3xl text-gray-400 font-light tracking-wider pr-8 md:pr-12 -mb-1 md:-mb-2 z-10">
              Customer
            </span>
            <span className="font-sans text-4xl md:text-6xl font-bold tracking-tighter text-primary uppercase drop-shadow-sm">
              Voices & Reviews
            </span>
          </motion.h2>
          <p className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-gray-400 mt-[10px]">
            Real Stories From Our Valued Clients
          </p>
        </div>

        {/* Scrolling Row */}
        <div className="flex overflow-hidden relative">
          <motion.div 
            className="flex gap-6 md:gap-10 pr-10"
            animate={{ x: [0, -3000] }}
            transition={{ 
              duration: 50, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            {infiniteTestimonials.map((t, idx) => (
              <div 
                key={`${t.id}-${idx}`}
                className="w-[320px] md:w-[500px] shrink-0"
              >
                <div className="h-full bg-white border border-black/[0.03] p-8 md:p-12 rounded-[2.5rem] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(0,113,227,0.1)] transition-all duration-700 group flex flex-col justify-between">
                  
                  <div>
                    {/* Header: Profile & Quote */}
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-[#0071E3]/20 group-hover:border-[#0071E3] transition-colors duration-500 shadow-xl">
                          <Image
                            src={t.image}
                            alt={t.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div>
                          <h4 className="font-black text-primary text-sm md:text-lg uppercase tracking-tight leading-none mb-1">
                            {t.name}
                          </h4>
                          <p className="text-[#0071E3] text-[9px] md:text-[11px] font-bold uppercase tracking-widest opacity-60">
                            {t.location}
                          </p>
                        </div>
                      </div>
                      <Quote className="w-8 h-8 md:w-12 md:h-12 text-black opacity-5" />
                    </div>

                    {/* Stars */}
                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    {/* Dual Language Review */}
                    <div className="space-y-4">
                      <p className="text-black text-sm md:text-lg font-medium leading-relaxed tracking-tight italic">
                        &ldquo;{t.review}&rdquo;
                      </p>
                      <div className="h-[1px] w-12 bg-black/5" />
                      <p className="text-gray-400 text-xs md:text-base font-semibold leading-relaxed tracking-tight">
                        &ldquo;{t.reviewBn}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Customer Footer Info */}
                  <div className="mt-10 pt-6 border-t border-black/5 flex items-center justify-between">
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
                      Verified Purchase
                    </span>
                    <div className="flex -space-x-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[8px] font-bold">
                          +
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
