'use client'
import { useEffect, useState } from 'react'
import { CheckCircle2, Sparkles, X, Layout, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStudioStore } from '../store'
export default function SaveSuccessModal() {
  const { showSaveSuccess, setShowSaveSuccess, lastSaved } = useStudioStore()
  const [countdown, setCountdown] = useState(5)
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (showSaveSuccess) {
      setCountdown(5)
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setShowSaveSuccess(false)
            return 5
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [showSaveSuccess, setShowSaveSuccess])
  return (
    <AnimatePresence>
      {showSaveSuccess && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSaveSuccess(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            {/* Header Gradient */}
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-green-500/10 to-transparent pointer-events-none" />
            <div className="p-10 flex flex-col items-center text-center">
              {/* Success Icon */}
              <div className="relative mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12, delay: 0.2 }}
                  className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.3)]"
                >
                  <CheckCircle2 size={40} className="text-black" />
                </motion.div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  className="absolute -inset-2 border-2 border-dashed border-green-500/20 rounded-full"
                />
              </div>
              {/* Text Content */}
              <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Design Synchronized</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                Your changes have been pushed to the production environment successfully. 
                Everything is up to date and secure.
              </p>
              {/* Meta Info */}
              <div className="w-full grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center">
                  <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Status</span>
                  <div className="flex items-center gap-1.5 text-green-400 font-bold text-xs">
                    <Sparkles size={12} /> Live
                  </div>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center">
                  <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Last Saved</span>
                  <span className="text-white font-bold text-xs">
                    {lastSaved?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
              {/* Action Button */}
              <button
                onClick={() => setShowSaveSuccess(false)}
                className="group w-full py-4 bg-white text-black font-black text-sm rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Continue Editing
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              {/* Auto Close Info */}
              <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-gray-700 uppercase tracking-widest">
                Closing in {countdown}s
              </div>
            </div>
            {/* Close Button */}
            <button
              onClick={() => setShowSaveSuccess(false)}
              className="absolute top-6 right-6 p-2 text-gray-600 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
