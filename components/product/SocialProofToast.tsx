'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';
interface Purchase {
  name: string;
  timeAgo: string;
}
interface SocialProofToastProps {
  purchases: Purchase[];
}
export default function SocialProofToast({ purchases }: SocialProofToastProps) {
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (purchases.length === 0) return;
    // Show after 5 seconds, then cycle every 10 seconds
    const initialDelay = setTimeout(() => setShow(true), 5000);
    const cycle = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % purchases.length);
        setShow(true);
      }, 500);
    }, 15000);
    return () => {
      clearTimeout(initialDelay);
      clearInterval(cycle);
    };
  }, [purchases]);
  if (purchases.length === 0) return null;
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="fixed bottom-6 left-6 z-[100] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.1)] p-3 pr-8 rounded-xl border border-gray-100 flex items-center gap-3 max-w-[280px]"
        >
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <ShoppingBag className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <p className="text-[11px] text-gray-500 leading-tight">
              <span className="font-bold text-black">{purchases[index].name}</span> recently purchased this item.
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">{purchases[index].timeAgo}</p>
          </div>
          <button 
            onClick={() => setShow(false)}
            className="absolute top-2 right-2 p-0.5 hover:bg-gray-100 rounded-full"
          >
            <X className="w-3 h-3 text-gray-300" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
