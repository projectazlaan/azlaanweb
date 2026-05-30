'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

// Lazy-load the heavy chat engine
const ChatCore = dynamic(() => import('./ChatCore'), { ssr: false });

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Hide on /chat page (mobile full page) and admin
  if (pathname === '/chat' || pathname.startsWith('/admin')) return null;

  return (
    <>
      {/* ── Floating Button ── */}
      <div className="hidden lg:block fixed bottom-8 right-8 z-[200]">
        <AnimatePresence>
          {!open && (
            <motion.button
              key="fab"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setOpen(true)}
              className="relative w-14 h-14 bg-black text-white rounded-full shadow-2xl flex items-center justify-center group"
            >
              <MessageCircle className="w-6 h-6" />
              {/* Pulse ring */}
              <span className="absolute inset-0 rounded-full bg-black/30 animate-ping opacity-60" />
              {/* Online dot */}
              <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
              {/* Tooltip */}
              <span className="absolute right-16 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                Azlaan Concierge
              </span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* ── Popup Panel ── */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="popup"
              initial={{ opacity: 0, scale: 0.92, y: 24, transformOrigin: 'bottom right' }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="absolute bottom-0 right-0 w-[380px] h-[600px] bg-[#EFEDE8] rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.22)] overflow-hidden flex flex-col border border-black/10"
              style={{ transformOrigin: 'bottom right' }}
            >
              {/* Close button (top-right corner, layered over the ChatCore header) */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 z-50 w-7 h-7 rounded-full bg-black/5 hover:bg-black/15 flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5 text-black/60" />
              </button>

              <ChatCore onClose={() => setOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
