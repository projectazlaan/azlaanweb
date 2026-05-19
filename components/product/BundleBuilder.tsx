'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { getProductById } from '@/lib/data';
import { trackEvent } from '@/lib/analytics';

interface BundleBuilderProps {
  mainProduct: Product;
}

export default function BundleBuilder({ mainProduct }: BundleBuilderProps) {
  const [bundleItems, setBundleItems] = useState<Product[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([mainProduct.id]);
  const { addItem } = useCartStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBundle() {
      if (!mainProduct.completeTheLook) {
        setLoading(false);
        return;
      }
      const items = await Promise.all(
        mainProduct.completeTheLook.items.map(item => getProductById(item.productId))
      );
      const validItems = items.filter((item): item is Product => item !== null);
      setBundleItems(validItems);
      // Auto-select mandatory/suggested items
      setSelectedIds([mainProduct.id, ...validItems.map(item => item.id)]);
      setLoading(false);
    }
    loadBundle();
  }, [mainProduct]);

  const toggleItem = (id: string) => {
    if (id === mainProduct.id) return; // Main product is mandatory
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const totalPrice = [mainProduct, ...bundleItems]
    .filter(item => selectedIds.includes(item.id))
    .reduce((sum, item) => sum + item.price, 0);

  const originalTotalPrice = [mainProduct, ...bundleItems]
    .filter(item => selectedIds.includes(item.id))
    .reduce((sum, item) => sum + (item.originalPrice || item.price), 0);

  const handleAddBundle = () => {
    const selectedProducts = [mainProduct, ...bundleItems].filter(item => selectedIds.includes(item.id));
    selectedProducts.forEach(product => {
      addItem(product, 1, product.sizes?.[0], product.colors?.[0]?.name);
    });
    trackEvent('add_to_cart_bundle', {
      main_product_id: mainProduct.id,
      bundle_size: selectedProducts.length,
      total_price: totalPrice
    });
  };

  if (loading || (!mainProduct.completeTheLook && bundleItems.length === 0)) return null;

  return (
    <section className="my-24 py-16 border-t border-b border-neutral-100 w-full">
      {/* Section Header */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-neutral-400">Curated Silhouette</span>
        <h3 className="text-2xl md:text-3xl font-light tracking-tight text-neutral-900 font-serif mt-2">
          {mainProduct.completeTheLook?.title || 'Style The Silhouette'}
        </h3>
        <p className="text-[11px] text-neutral-500 max-w-md mx-auto mt-2.5 leading-relaxed">
          Expertly selected pieces designed to layer and style perfectly with your garment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Visual Stack (Col-7) */}
        <div className="lg:col-span-7 flex flex-wrap justify-center items-center gap-6 md:gap-8">
          {/* Main Item */}
          <div 
            onClick={() => toggleItem(mainProduct.id)}
            className="relative cursor-pointer group flex flex-col items-center select-none"
          >
            <div className="relative w-28 h-36 md:w-36 md:h-48 rounded-xl overflow-hidden border border-neutral-200/50 shadow-sm transition-all duration-300 group-hover:scale-[1.02]">
              <Image src={(mainProduct.images && mainProduct.images[0]) || ''} alt={mainProduct.name || 'Product'} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/5" />
            </div>
            <div className="absolute top-3 right-3 bg-neutral-950 text-white p-1 rounded-full shadow-md z-10">
              <Check className="w-2.5 h-2.5" />
            </div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 mt-3 text-center">This Piece</p>
          </div>

          <Plus className="w-4 h-4 text-neutral-300 shrink-0 animate-pulse" />

          {/* Styled Items */}
          {bundleItems.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className="relative cursor-pointer group flex flex-col items-center select-none"
              >
                <div className={`relative w-28 h-36 md:w-36 md:h-48 rounded-xl overflow-hidden border transition-all duration-500 group-hover:scale-[1.02] ${
                  isSelected ? 'border-neutral-950 shadow-md' : 'border-neutral-200/50 opacity-40 hover:opacity-75'
                }`}>
                  <Image src={(item.images && item.images[0]) || ''} alt={item.name || 'Product'} fill className="object-cover" />
                  {isSelected && <div className="absolute inset-0 bg-black/5" />}
                </div>
                {/* Checkmark indicator */}
                <div className={`absolute top-3 right-3 p-1 rounded-full transition-all shadow-md z-10 ${
                  isSelected ? 'bg-neutral-950 text-white scale-100' : 'bg-white text-neutral-400 border border-neutral-200 scale-90 opacity-0 group-hover:opacity-100'
                }`}>
                  <Check className="w-2.5 h-2.5" />
                </div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-500 mt-3 text-center max-w-[100px] truncate">
                  {item.name}
                </p>
              </div>
            );
          })}
        </div>

        {/* Price & Action (Col-5) */}
        <div className="lg:col-span-5 bg-neutral-50/50 border border-neutral-100/50 p-8 rounded-2xl relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/40 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
          <div className="mb-6 relative z-10">
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Complete Package Price</span>
            <div className="flex items-baseline gap-3 mt-1.5 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span 
                  key={totalPrice}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -15, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="text-3xl font-medium tracking-tight text-neutral-950 font-serif"
                >
                  ৳{totalPrice.toLocaleString()}
                </motion.span>
              </AnimatePresence>
              {originalTotalPrice > totalPrice && (
                <span className="text-base text-neutral-300 line-through">৳{originalTotalPrice.toLocaleString()}</span>
              )}
            </div>
            {originalTotalPrice > totalPrice && (
              <p className="text-[9px] font-bold text-neutral-600 mt-2.5 uppercase tracking-widest border border-neutral-200/50 rounded px-2.5 py-1 bg-white/50 inline-block">
                Exclusive Bundle Savings: ৳{(originalTotalPrice - totalPrice).toLocaleString()}
              </p>
            )}
          </div>

          <button
            onClick={handleAddBundle}
            className="w-full bg-neutral-950 hover:bg-neutral-900 text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2.5 shadow-sm active:scale-[0.98] relative z-10"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Add Silhouette to Cart
          </button>

          <p className="text-center text-[9px] text-neutral-400 mt-4.5 uppercase font-semibold tracking-widest relative z-10">
            {selectedIds.length} items styled in this package
          </p>
        </div>
      </div>
    </section>
  );
}
