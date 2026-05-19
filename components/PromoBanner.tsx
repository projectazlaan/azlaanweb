'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Clock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface PromoBannerProps {
  settings?: {
    isActive?: boolean
    badge?: string
    badgeBn?: string
    title?: string
    titleBn?: string
    discount?: string
    discountBn?: string
    description?: string
    descriptionBn?: string
    ctaText?: string
    ctaTextBn?: string
    ctaLink?: string
    bgImage?: string
    countdownEnd?: string
  }
}

export default function PromoBanner({ settings }: PromoBannerProps) {
  // Graceful fallback to database values or premium defaults
  const isActive = settings?.isActive ?? true
  const badge = settings?.badge || "Special Limited Drop"
  const title = settings?.title || "Crafted For Celebration"
  const titleBn = settings?.titleBn || "উৎসবের জন্য বিশেষ আয়োজন"
  const discount = settings?.discount || "30% OFF"
  const ctaText = settings?.ctaText || "Shop Collection"
  const ctaLink = settings?.ctaLink || "/shop"
  const bgImage = settings?.bgImage || "/media-pro/cover/cover 3.jpg"
  const countdownEnd = settings?.countdownEnd || "2026-06-30T00:00:00"

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  })

  useEffect(() => {
    if (!countdownEnd) return

    const calculateTimeLeft = () => {
      const difference = +new Date(countdownEnd) - +new Date()
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true })
        return
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isExpired: false
      })
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [countdownEnd])

  if (!isActive) return null

  return (
    <section className="relative w-full py-4 md:py-6 bg-white overflow-hidden px-4 md:px-8 lg:px-12 z-10">
      <div className="max-w-[1400px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative min-h-[120px] md:min-h-[140px] rounded-[2rem] overflow-hidden flex items-center shadow-[0_12px_36px_rgba(0,0,0,0.06)] border border-black/5"
        >
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <Image
              src={bgImage}
              alt="Azlaan Banner Background"
              fill
              className="object-cover transition-transform duration-[6000ms] hover:scale-103"
              priority
            />
            {/* Elegant horizontal gradient mask */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/85 to-black/40 md:from-black/95 md:via-black/80 md:to-black/35" />
            
            {/* Subtle glow */}
            <div className="absolute -left-10 -top-10 w-60 h-60 rounded-full bg-amber-500/5 blur-[80px] pointer-events-none" />
          </div>

          {/* Minimal Content Container */}
          <div className="relative z-10 w-full px-6 py-6 md:px-12 lg:px-16 flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Left: Sleek Typography Block */}
            <div className="space-y-1.5 flex-1">
              {/* Premium Gold Sub-badge */}
              <div className="text-[10px] md:text-xs font-bold text-amber-400 uppercase tracking-[0.3em]">
                {badge} • {discount}
              </div>

              {/* Minimal Headline Stacks */}
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 md:gap-3.5">
                <h2 className="font-serif italic text-xl md:text-2xl text-white font-light tracking-wide leading-none">
                  {title}
                </h2>
                <h3 className="font-sans text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-widest leading-none">
                  {titleBn}
                </h3>
              </div>
            </div>

            {/* Right: Integrated Timer & Pill Button */}
            <div className="flex items-center flex-wrap gap-4 md:gap-6 lg:gap-8 shrink-0">
              
              {/* Ultra-Minimal Countdown Clock */}
              {countdownEnd && !timeLeft.isExpired && (
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/5 backdrop-blur-md">
                  <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin-slow shrink-0" />
                  
                  <div className="flex items-center gap-1">
                    {[
                      { val: timeLeft.days, label: 'd' },
                      { val: timeLeft.hours, label: 'h' },
                      { val: timeLeft.minutes, label: 'm' },
                      { val: timeLeft.seconds, label: 's' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-baseline gap-0.5">
                        <span className="font-sans text-xs md:text-sm font-extrabold text-white tracking-tighter">
                          {String(item.val).padStart(2, '0')}
                        </span>
                        <span className="text-[8px] font-bold text-gray-400 uppercase">
                          {item.label}
                        </span>
                        {idx < 3 && <span className="text-white/20 text-xs mx-0.5">:</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Minimal Luxury CTA Button */}
              <Link
                href={ctaLink}
                className="group relative inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white text-black font-extrabold text-[10px] uppercase tracking-[0.25em] hover:bg-amber-400 transition-all duration-300 active:scale-95 overflow-hidden shrink-0 border border-white/10"
              >
                <span className="relative z-10 font-black leading-none">
                  {ctaText}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-black group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
              </Link>

            </div>

          </div>
        </motion.div>
      </div>
    </section>
  )
}
