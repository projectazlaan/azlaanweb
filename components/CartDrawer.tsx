'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Truck, Gift, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const FREE_SHIPPING_THRESHOLD = 5000;

export default function CartDrawer() {
  const { isOpen, closeCart, items, updateQuantity, removeItem, getTotalPrice } = useCartStore();

  const subtotal = getTotalPrice();
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-neutral-100">
              <h2 className="text-lg font-black uppercase tracking-widest text-black flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Your Bag
              </h2>
              <button 
                onClick={closeCart}
                className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center hover:bg-neutral-200 transition-colors"
              >
                <X className="w-5 h-5 text-black" />
              </button>
            </div>

            {/* Upsell Bar */}
            <div className="p-5 bg-neutral-50 border-b border-neutral-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-black uppercase tracking-widest text-black flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" /> 
                  {remaining > 0 ? `Add ৳${remaining.toLocaleString()} for Free Shipping` : "You've unlocked Free Shipping!"}
                </p>
              </div>
              <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className={`h-full ${progress === 100 ? 'bg-emerald-500' : 'bg-black'}`}
                />
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-neutral-400">
                  <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                  <p className="text-sm font-bold text-black mb-2">Your bag is empty.</p>
                  <p className="text-xs">Looks like you haven't added anything yet.</p>
                  <button 
                    onClick={closeCart}
                    className="mt-6 border border-black text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={item.id} 
                      className="flex gap-4"
                    >
                      {item.isGiftCard ? (
                        /* ── Gift Card Item ── */
                        <>
                          {/* Mini card visual */}
                          <div className="w-20 h-24 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-[#1D1D1F] to-[#2c2c2c] border border-[#C9A84C]/20 flex flex-col justify-between p-2.5 relative">
                            <div className="flex justify-between items-center">
                              <Gift className="w-3 h-3 text-[#C9A84C]" />
                              <span className="text-[6px] font-black uppercase tracking-widest text-white/40">Azlaan</span>
                            </div>
                            <div>
                              <p className="text-[7px] font-black uppercase tracking-widest text-[#C9A84C]/60 mb-0.5">Value</p>
                              <p className="text-sm font-black text-[#C9A84C] leading-none">৳{item.giftCardValue?.toLocaleString()}</p>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="flex-1 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-sm font-bold text-black leading-tight">{item.name}</h3>
                                <div className="flex items-center gap-1 mt-1">
                                  <Sparkles className="w-3 h-3 text-[#C9A84C]" />
                                  <p className="text-[10px] font-black text-[#C9A84C]">৳{item.giftCardValue?.toLocaleString()} credit added on checkout</p>
                                </div>
                              </div>
                              <button onClick={() => removeItem(item.id)} className="text-neutral-400 hover:text-red-500 transition-colors shrink-0 ml-2">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="flex items-end justify-between mt-2">
                              <p className="text-sm font-black text-black">৳{item.price.toLocaleString()}</p>
                              <span className="text-[9px] font-black uppercase tracking-widest text-[#C9A84C] bg-[#C9A84C]/10 px-2 py-1 rounded-full">
                                Save ৳{((item.giftCardValue ?? 0) - item.price).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        /* ── Regular Product Item ── */
                        <>
                          {/* Image */}
                          <div className="w-20 h-24 bg-neutral-100 rounded-xl overflow-hidden relative shrink-0">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          
                          {/* Details */}
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start">
                                <h3 className="text-sm font-bold text-black leading-tight line-clamp-2">{item.name}</h3>
                                <button onClick={() => removeItem(item.id)} className="text-neutral-400 hover:text-red-500 transition-colors shrink-0 ml-2">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <p className="text-[11px] text-neutral-500 mt-1">
                                {item.size && `Size: ${item.size}`} {item.color && `| Color: ${item.color}`}
                              </p>
                            </div>
                            
                            <div className="flex items-end justify-between mt-2">
                              <p className="text-sm font-black text-black">৳{(item.price * item.quantity).toLocaleString()}</p>
                              
                              {/* Quantity Controls */}
                              <div className="flex items-center border border-neutral-200 rounded-full bg-white">
                                <button 
                                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                  className="w-7 h-7 flex items-center justify-center hover:bg-neutral-50 rounded-l-full text-neutral-500 transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                                <button 
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-7 h-7 flex items-center justify-center hover:bg-neutral-50 rounded-r-full text-neutral-500 transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer / Checkout */}
            {items.length > 0 && (
              <div className="p-5 border-t border-neutral-100 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-neutral-500">Subtotal</span>
                  <span className="text-lg font-black text-black">৳{subtotal.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-neutral-400 mb-4 uppercase tracking-widest text-center">Taxes & shipping calculated at checkout</p>
                <div className="space-y-2">
                  <Link href="/checkout" onClick={closeCart} className="block w-full">
                    <button className="w-full bg-black text-white h-14 rounded-full flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest hover:bg-black/90 transition-colors group">
                      Proceed to Checkout <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                  <Link href="/cart" onClick={closeCart} className="block w-full text-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-black transition-colors py-1 inline-block">
                      View Bag
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
