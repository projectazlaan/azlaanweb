'use client';
import { motion } from 'framer-motion';
import { ArrowRight, Gift } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
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
  return (
    <section className="relative py-16 md:py-20 bg-[#F5F5F7] overflow-hidden flex justify-center border-t border-black/5">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-2xl px-4 md:px-8"
      >
        <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.02] flex flex-col items-center text-center">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4 bg-[#0071E3]/5 px-4 py-1.5 rounded-full border border-[#0071E3]/10">
            <Gift className="w-4 h-4 text-[#0071E3]" />
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.1em] text-[#0071E3]">
              {isBangla ? 'নতুন মেম্বারদের জন্য অফার' : 'Exclusive New Member Offer'}
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl font-semibold text-[#1D1D1F] tracking-tight mb-3">
            {isBangla ? 'রেজিস্টার করুন, পান ফ্রি ডেলিভারি।' : 'Register & Get Free Delivery.'}
          </h2>
          <p className="text-sm md:text-base text-[#86868B] mb-8 max-w-md font-medium leading-relaxed">
            {isBangla 
              ? 'আজই আজলান ইনার সার্কেলে জয়েন করুন এবং আপনার প্রথম অর্ডারে সম্পূর্ণ ফ্রি ডেলিভারি উপভোগ করুন।' 
              : 'Join the Azlaan Inner Circle today and enjoy complimentary shipping on your first order.'}
          </p>
          {/* Email Form */}
          <form onSubmit={handleSubscribe} className="w-full max-w-md relative flex items-center mb-8 group/form">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isBangla ? 'আপনার ইমেইল দিন...' : 'Enter email address...'}
              className="w-full bg-[#F5F5F7] border border-black/5 text-[#1D1D1F] text-base px-6 py-4 rounded-full focus:outline-none focus:ring-1 focus:ring-[#0071E3] transition-all placeholder:text-[#86868B]"
            />
            <button
              disabled={isSubscribed}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full transition-all duration-300 flex items-center justify-center ${
                isSubscribed ? 'bg-[#34C759] text-white' : 'bg-[#1D1D1F] text-white hover:bg-black active:scale-95'
              }`}
            >
              {isSubscribed ? <CheckIcon className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
          <div className="w-full max-w-md flex items-center gap-4 mb-8">
            <div className="h-[1px] flex-1 bg-black/5" />
            <span className="text-xs text-[#86868B] font-medium">Or continue with</span>
            <div className="h-[1px] flex-1 bg-black/5" />
          </div>
          {/* Social Logins */}
          <div className="flex items-center justify-center gap-3 w-full max-w-md">
            {/* Google */}
            <Link href="/login?provider=google" className="flex-1 flex justify-center items-center py-4 bg-white hover:bg-[#F5F5F7] border border-black/10 rounded-2xl transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </Link>
            {/* Facebook */}
            <Link href="/login?provider=facebook" className="flex-1 flex justify-center items-center py-4 bg-[#1877F2]/5 hover:bg-[#1877F2]/10 border border-[#1877F2]/20 rounded-2xl transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </Link>
            {/* Apple */}
            <Link href="/login?provider=apple" className="flex-1 flex justify-center items-center py-4 bg-white hover:bg-[#F5F5F7] border border-black/10 rounded-2xl transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="black" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.05 2.26.45 3.09.45.81 0 1.88-.47 3.25-.47 1.85 0 3.12.56 3.92 1.37-2.82 1.58-2.3 5.46.59 6.64-.69 1.8-1.57 3.52-2.85 4.98zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
function CheckIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
