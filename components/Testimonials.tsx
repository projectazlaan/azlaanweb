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
    <section className="py-2 md:py-4 overflow-hidden bg-white">
      <div className="w-full">
        {/* Header - Compact & Premium with Advanced Typography */}
        <div className="text-center mb-2 md:mb-4 px-4 relative">
          <div className="inline-flex flex-col items-center">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-[1px] w-4 bg-gray-200" />
              <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.4em] text-gray-300">Curated Feedback</span>
              <div className="h-[1px] w-4 bg-gray-200" />
            </div>
            <h2 className="flex flex-col items-center justify-center leading-none">
              <span className="font-serif italic text-base md:text-lg text-gray-400 font-light tracking-wider pr-4 md:pr-6 -mb-0.5">
                Authentic
              </span>
              <span className="font-sans text-2xl md:text-3xl font-bold tracking-tighter text-primary uppercase">
                Customer Voices
              </span>
            </h2>
            <div className="mt-1 flex items-center gap-1.5 opacity-30">
              <span className="text-[6px] md:text-[7px] font-bold uppercase tracking-widest">Global Excellence</span>
              <div className="w-1 h-1 rounded-full bg-primary" />
              <span className="text-[6px] md:text-[7px] font-bold uppercase tracking-widest">Premium Quality</span>
            </div>
          </div>
        </div>

        {/* Scrolling Row */}
        <div className="flex overflow-hidden relative">
          <motion.div 
            className="flex gap-4 md:gap-6 pr-6 pb-6 pt-1"
            animate={{ x: [0, -2000] }}
            transition={{ 
              duration: 40, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            {infiniteTestimonials.map((t, idx) => (
              <div 
                key={`${t.id}-${idx}`}
                className="w-[280px] md:w-[350px] shrink-0"
              >
                <div className="bg-white border border-black/[0.05] p-5 md:p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-500 group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border border-black/5">
                      <Image
                        src={t.image}
                        alt={t.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary text-[11px] md:text-sm uppercase tracking-tight leading-none">
                        {t.name}
                      </h4>
                      <p className="text-gray-400 text-[9px] md:text-[10px] font-medium uppercase tracking-widest mt-1">
                        {t.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                    ))}
                  </div>

                  <div className="space-y-2">
                    <p className="text-black text-[12px] md:text-[13px] font-medium leading-relaxed tracking-tight italic">
                      &ldquo;{t.review}&rdquo;
                    </p>
                    <p className="text-gray-400 text-[10px] md:text-[11px] font-medium leading-relaxed tracking-tight">
                      &ldquo;{t.reviewBn}&rdquo;
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-gray-300">
                    <span>Verified Purchase</span>
                    <Quote className="w-3 h-3 opacity-10" />
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
