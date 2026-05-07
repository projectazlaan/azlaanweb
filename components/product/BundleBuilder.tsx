'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus, Check, ShoppingBag, Sparkles } from 'lucide-react';
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
    <section className="my-12 p-6 md:p-8 bg-gray-50 rounded-3xl border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary rounded-xl">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-black uppercase tracking-tight text-primary">
            {mainProduct.completeTheLook?.title || 'Complete The Look'}
          </h3>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">
            Expert-curated bundle for you
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Visual Stack */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="relative w-24 h-32 md:w-32 md:h-44 rounded-xl overflow-hidden border-2 border-primary shadow-lg">
              <Image src={(mainProduct.images && mainProduct.images[0]) || ''} alt={mainProduct.name || 'Product'} fill className="object-cover" unoptimized />
            </div>
            <div className="absolute -top-2 -right-2 bg-primary text-white p-1 rounded-full">
              <Check className="w-3 h-3" />
            </div>
          </div>

          <Plus className="w-6 h-6 text-gray-300" />

          <div className="flex -space-x-12 md:-space-x-16">
            {bundleItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`relative w-24 h-32 md:w-32 md:h-44 rounded-xl overflow-hidden border-2 transition-all shadow-md hover:z-20 ${
                  selectedIds.includes(item.id) ? 'border-primary opacity-100 scale-105' : 'border-transparent opacity-40 scale-95'
                }`}
                style={{ zIndex: 10 - idx }}
              >
                <Image src={(item.images && item.images[0]) || ''} alt={item.name || 'Product'} fill className="object-cover" unoptimized />
                {selectedIds.includes(item.id) && (
                  <div className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full z-30">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex-1 w-full md:w-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Bundle Total</p>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-primary">৳{totalPrice.toLocaleString()}</span>
              {originalTotalPrice > totalPrice && (
                <span className="text-lg text-gray-300 line-through">৳{originalTotalPrice.toLocaleString()}</span>
              )}
            </div>
            {originalTotalPrice > totalPrice && (
              <p className="text-[11px] font-bold text-green-600 mt-1 uppercase tracking-wider">
                You Save ৳{(originalTotalPrice - totalPrice).toLocaleString()} (Bundle Discount Applied)
              </p>
            )}
          </div>

          <button
            onClick={handleAddBundle}
            className="w-full bg-primary text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-black transition-colors active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            Add Bundle to Cart
          </button>
          
          <p className="text-center text-[10px] text-gray-400 mt-4 uppercase font-medium tracking-widest">
            {selectedIds.length} items selected in this set
          </p>
        </div>
      </div>
    </section>
  );
}
