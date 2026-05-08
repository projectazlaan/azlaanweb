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
    <section className="py-4 md:py-6 bg-white overflow-hidden border-y border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
          
          {/* Left: Narrow & Super Compact Editorial Typography */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left shrink-0 max-w-[300px] md:max-w-[380px]">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Join Azlaan</span>
              <div className="h-[1px] w-6 bg-gray-200" />
            </div>
            <h2 className="text-xl md:text-2xl font-serif italic text-primary leading-none mb-1">
              {isBangla ? 'ফ্রি ডেলিভারি পেতে রেজিস্টার করুন' : 'Register for Complimentary Delivery'}
            </h2>
            <p className="text-[11px] md:text-xs text-gray-600 font-bold uppercase tracking-[0.2em] leading-tight">
              {isBangla ? 'আপনার প্রথম অর্ডারের জন্য এক্সক্লুসিভ অফার' : 'Exclusive for your first order'}
            </p>
          </div>

          {/* Right: Clean Editorial Form & Socials */}
          <div className="flex flex-col items-center md:items-end gap-3 md:gap-5 w-full max-w-[280px] md:max-w-xl">
            <form onSubmit={handleSubscribe} className="w-full relative flex items-center group">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isBangla ? 'আপনার ইমেইল ঠিকানা...' : 'Your email address...'}
                className="w-full bg-gray-50 border border-black/10 text-primary text-xs md:text-base px-4 md:px-6 py-2.5 md:py-4 rounded-full focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-300"
              />
              <button
                disabled={isSubscribed}
                className={`absolute right-1.5 p-2 md:p-2.5 rounded-full transition-all duration-300 ${
                  isSubscribed ? 'bg-green-500 text-white' : 'bg-primary text-white hover:bg-black active:scale-95'
                }`}
              >
                {isSubscribed ? <CheckIcon className="w-3.5 h-3.5 md:w-5 md:h-5" /> : <ArrowRight className="w-3.5 h-3.5 md:w-5 md:h-5" />}
              </button>
            </form>

            <div className="flex items-center gap-4 md:gap-5">
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Fast Connect</span>
              <div className="flex gap-3">
                {[
                  { id: 'google', icon: <GoogleIcon />, href: '/login?provider=google' },
                  { id: 'facebook', icon: <FacebookIcon />, href: '/login?provider=facebook' },
                  { id: 'apple', icon: <AppleIcon />, href: '/login?provider=apple' }
                ].map(social => (
                  <Link 
                    key={social.id} 
                    href={social.href}
                    className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-black/10 flex items-center justify-center hover:bg-gray-50 transition-all hover:-translate-y-0.5"
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4 md:w-4.5 md:h-4.5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="w-4 h-4 md:w-4.5 md:h-4.5" viewBox="0 0 24 24">
      <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="w-4 h-4 md:w-4.5 md:h-4.5" viewBox="0 0 24 24">
      <path fill="black" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.05 2.26.45 3.09.45.81 0 1.88-.47 3.25-.47 1.85 0 3.12.56 3.92 1.37-2.82 1.58-2.3 5.46.59 6.64-.69 1.8-1.57 3.52-2.85 4.98zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
    </svg>
  );
}

function CheckIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

