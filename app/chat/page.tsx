'use client';
import { MessageSquareDashed, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ChatUnderConstructionPage() {
  return (
    <div className="min-h-[85vh] bg-white flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center text-center max-w-md mx-auto"
      >
        <div className="relative mb-8">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 border border-dashed border-neutral-300 rounded-full"
          />
          <div className="w-24 h-24 bg-black text-white rounded-full flex items-center justify-center shadow-2xl relative">
            <MessageSquareDashed className="w-10 h-10" strokeWidth={1.5} />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-1"
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-black font-sans tracking-tighter text-neutral-900 mb-4">
          Under Construction
        </h1>
        
        <p className="text-neutral-500 font-medium leading-relaxed mb-10 text-[15px]">
          We are currently crafting a next-generation real-time AI chat experience for our premium customers. Please check back soon!
        </p>

        <Link 
          href="/"
          className="group flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[11px] hover:scale-105 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Return to Home
        </Link>
      </motion.div>
    </div>
  );
}
