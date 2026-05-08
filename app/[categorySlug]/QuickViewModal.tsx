'use client';
import { Product } from '@/types';
import Image from 'next/image';
import { X, ShoppingBag, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCartStore } from '@/store/cartStore';
interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}
export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);
  if (!isOpen || !mounted) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl flex flex-col md:flex-row z-10 animate-in fade-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur-md rounded-full text-black hover:bg-black hover:text-white transition-colors shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>
        {/* Image Gallery */}
        <div className="w-full md:w-1/2 bg-gray-50 p-6 flex flex-col gap-4">
          <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-white shadow-sm">
            <Image
              src={(product.images && product.images[activeImage]) || product.image || ''}
              alt={product.name || 'Product Image'}
              fill
              className="object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm">
                {product.badge === 'new' ? 'New Arrival' : product.badge === 'bestseller' ? 'Bestseller' : 'Limited'}
              </span>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-16 h-20 shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                    activeImage === idx ? 'border-black' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img || ''} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Product Details */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
          <p className="text-[10px] text-black/40 font-bold uppercase tracking-[0.2em] mb-2">
            {product.category} {product.subcategory !== 'All' ? `/ ${product.subcategory}` : ''}
          </p>
          <h2 className="text-2xl md:text-3xl font-sans font-extrabold tracking-tight mb-2 uppercase">
            {product.name}
          </h2>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xl font-bold text-black">{product.priceDisplay}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-black/40 line-through">
                ৳{product.originalPrice.toLocaleString()}
              </span>
            )}
            {product.rating > 0 && (
              <span className="flex items-center gap-1 text-[11px] font-bold bg-black/5 px-2 py-1 rounded-full">
                ⭐ {product.rating} <span className="text-black/40">({product.reviewCount})</span>
              </span>
            )}
          </div>
          <div className="prose prose-sm text-black/70 font-light mb-8 line-clamp-4">
            {/* TODO: User to fill [Bangla/English] content for product description */}
            <p>{product.description || 'Premium quality product tailored to perfection. Experience the ultimate comfort and style with Azlaan.'}</p>
          </div>
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-3">Select Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button key={size} className="w-10 h-10 border border-black/10 rounded-full text-xs font-bold hover:border-black transition-colors">
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="mt-auto pt-6 border-t border-black/5 flex items-center gap-3">
            <button 
              onClick={() => {
                const { addItem } = useCartStore.getState();
                addItem(product, 1, product.sizes?.[0]);
                onClose();
              }}
              className="flex-1 bg-black text-white py-4 rounded-sm font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-black/80 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Cart
            </button>
            <button 
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="p-4 border border-black/10 rounded-sm hover:border-black transition-colors"
            >
              <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-black'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
