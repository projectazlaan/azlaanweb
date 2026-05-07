'use client';

import { motion } from 'framer-motion';
import { Send, CheckCircle2, Sparkles, Bell, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export default function Newsletter({ isBangla = false }: { isBangla?: boolean }) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  const perks = [
    { icon: Sparkles, text: isBangla ? 'আর্লি এক্সেস' : 'Early Access' },
    { icon: Bell, text: isBangla ? 'ইনস্ট্যান্ট আপডেট' : 'Instant Alerts' },
    { icon: CheckCircle2, text: isBangla ? 'এক্সক্লুসিভ অফার' : 'Member Only' },
  ];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* ── Background Elements ── */}
      <div className="absolute inset-0 bg-[#1D1D1F]" />
      <div className="absolute inset-0 opacity-20">
        <Image 
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e12?auto=format&fit=crop&q=80&w=2000" 
          alt="Background" 
          fill
          className="object-cover grayscale"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1D1D1F] via-[#1D1D1F]/90 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* ── Left Content ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em] text-[#0071E3] mb-6 block">
              The Azlaan Inner Circle
            </span>
            <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-8">
              Join the <br />
              <span className="text-gray-500 italic font-serif lowercase tracking-normal">Elite</span> List
            </h2>
            
            <div className="flex flex-wrap gap-6 md:gap-10">
              {perks.map((perk, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <perk.icon className="w-4 h-4 text-[#0071E3]" />
                  </div>
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400">
                    {perk.text}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: Form Card ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden group">
              {/* Decorative accent */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#0071E3]/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
              
              <div className="relative z-10">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                  {isBangla ? 'গোপন অফারগুলো সবার আগে পান' : 'Stay Ahead of the Curve'}
                </h3>
                <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                  {isBangla 
                    ? 'আমাদের ভিআইপি লিস্টে যোগ দিন এবং নতুন কালেকশন সবার আগে দেখার সুযোগ পান।'
                    : 'Be the first to experience our latest drops and exclusive member-only collections.'
                  }
                </p>

                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div className="relative group/input">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={isBangla ? 'আপনার ইমেইল অ্যাড্রেস' : 'Enter your professional email'}
                      className="w-full bg-white/5 border border-white/10 text-white px-8 py-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0071E3] transition-all placeholder:text-gray-600 font-medium"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 group-focus-within/input:opacity-100 transition-opacity">
                      <Send className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <button
                    disabled={isSubscribed}
                    className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] transition-all flex items-center justify-center gap-3 shadow-xl ${
                      isSubscribed 
                      ? 'bg-green-500 text-white' 
                      : 'bg-[#0071E3] text-white hover:bg-[#0077ED] hover:-translate-y-1 active:translate-y-0'
                    }`}
                  >
                    {isSubscribed ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        {isBangla ? 'সাবস্ক্রাইবড!' : 'Welcome Aboard!'}
                      </>
                    ) : (
                      <>
                        {isBangla ? 'জয়েন করুন' : 'Join Inner Circle'}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <p className="text-[10px] text-gray-500 mt-6 text-center uppercase tracking-widest leading-loose">
                  {isBangla 
                    ? 'যেকোনো সময় আনসাবস্ক্রাইব করতে পারবেন। আমরা স্প্যাম করি না।' 
                    : 'Join 12,000+ fashion enthusiasts. Unsubscribe anytime.'}
                </p>
              </div>
            </div>

            {/* Social Proof Counter Tag */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-black/5 whitespace-nowrap">
               <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white overflow-hidden">
                       <div className="relative w-full h-full">
                         <Image src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" fill className="object-cover" unoptimized />
                       </div>
                    </div>
                  ))}
               </div>
               <span className="text-[9px] font-black uppercase tracking-widest text-primary">
                 Recent Joiners
               </span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
