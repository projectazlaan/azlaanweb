'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Heart, Eye, Star } from 'lucide-react';
import { Product, ViewMode } from '@/types';
import { toast } from 'react-hot-toast';
import { useCartStore } from '@/store/cartStore';

interface ProductCardProps {
  product: Product;
  viewMode: ViewMode;
  onQuickView?: () => void;
}

const BADGE_STYLES: Record<string, string> = {
  new: 'bg-black text-white',
  bestseller: 'bg-amber-500 text-white',
  limited: 'bg-red-600 text-white',
};

const BADGE_LABELS: Record<string, string> = {
  new: 'New Arrival',
  bestseller: 'Bestseller',
  limited: 'Limited',
};

export default function ProductCard({ product, viewMode, onQuickView }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [rating, setRating] = useState(4.5);
  const [isRatingMode, setIsRatingMode] = useState(false);

  const displayImage = product.images[activeImage] ?? product.image;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  // Render static stars
  const renderStars = (val: number, size = 10) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`w-${size / 4} h-${size / 4}`}
            style={{ width: size, height: size }}
            fill={s <= val ? "#fbbf24" : "transparent"}
            stroke={s <= val ? "#fbbf24" : "#d1d5db"}
          />
        ))}
      </div>
    );
  };

  if (viewMode === 'list') {
    return (
      <Link
        href={`/product/${product.slug}`}
        className="group flex gap-4 border-b border-black/5 pb-6"
      >
        <div className="relative w-28 h-36 shrink-0 overflow-hidden bg-gray-50">
          <Image
            src={displayImage}
            alt={product.name}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
        <div className="flex flex-col justify-center gap-1.5">
          {product.badge && (
            <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm w-fit ${BADGE_STYLES[product.badge]}`}>
              {BADGE_LABELS[product.badge]}
            </span>
          )}
          <h3 className="text-black text-sm font-medium tracking-tight uppercase">{product.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-black font-bold text-sm">{product.priceDisplay}</span>
            {hasDiscount && (
              <span className="text-black/30 text-xs line-through">
                ৳{product.originalPrice?.toLocaleString()}
              </span>
            )}
          </div>
          {!product.isInStock && (
            <span className="text-[9px] text-red-500 font-bold uppercase tracking-widest">Out of Stock</span>
          )}
        </div>
      </Link>
    );
  }

  // Grid View
  return (
    <Link 
      href={`/product/${product.slug}`} 
      className="group flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500 border border-black/5"
    >
      {/* Image Container */}
      <div
        className="relative aspect-[3/4] overflow-hidden bg-gray-50"
        onMouseLeave={() => setActiveImage(0)}
      >
        <Image
          src={displayImage}
          alt={product.name}
          fill
          unoptimized
          className="object-cover group-hover:scale-110 transition-transform duration-[1500ms] ease-out"
          sizes="(max-width: 768px) 50vw, 25vw"
        />

        {/* Image Switcher — hover over sub-images */}
        {product.images.length > 1 && (
          <div className="absolute bottom-2 left-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {product.images.slice(0, 3).map((_, i) => (
              <button
                key={i}
                onMouseEnter={() => setActiveImage(i)}
                className={`flex-1 h-0.5 rounded-full transition-all ${i === activeImage ? 'bg-white' : 'bg-white/40'}`}
              />
            ))}
          </div>
        )}

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3">
            <span className={`text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm shadow-lg ${BADGE_STYLES[product.badge]}`}>
              {BADGE_LABELS[product.badge]}
            </span>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {!product.isInStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-black/60 bg-white px-4 py-2">
              Out of Stock
            </span>
          </div>
        )}

        {/* Wishlist, Quick View & Rating Buttons */}
        <div className="absolute top-3 inset-x-3 flex justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
          {/* Rating Trigger (Left) */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsRatingMode(!isRatingMode);
            }}
            className={`p-2 rounded-full backdrop-blur-sm shadow-lg hover:scale-110 transition-transform ${isRatingMode ? 'bg-amber-500 text-white' : 'bg-white/80 text-black'}`}
            aria-label="Rate product"
          >
            <Star className={`w-3.5 h-3.5 ${isRatingMode ? 'fill-white' : ''}`} />
          </button>

          <div className="flex flex-col gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsWishlisted(!isWishlisted);
              }}
              className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:scale-110 transition-transform"
              aria-label="Add to wishlist"
            >
              <Heart
                className={`w-3.5 h-3.5 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-black'}`}
              />
            </button>
            
            {onQuickView && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onQuickView();
                }}
                className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:scale-110 transition-transform"
                aria-label="Quick view"
              >
                <Eye className="w-3.5 h-3.5 text-black" />
              </button>
            )}
          </div>
        </div>

        {/* Interactive Rating Overlay */}
        {isRatingMode && (
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-md z-20 flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in duration-300"
            onClick={(e) => {
              e.preventDefault();
              setIsRatingMode(false);
            }}
          >
            <span className="text-white text-[10px] font-black uppercase tracking-widest">Rate this product</span>
            <div className="flex gap-2 p-4 bg-white/10 rounded-2xl border border-white/20">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setRating(s);
                    setIsRatingMode(false);
                  }}
                  className="hover:scale-125 transition-transform"
                >
                  <Star 
                    className="w-8 h-8 md:w-10 md:h-10" 
                    fill={s <= (rating || 0) ? "#fbbf24" : "transparent"} 
                    stroke={s <= (rating || 0) ? "#fbbf24" : "white"} 
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Info Container */}
      <div className="bg-white p-2.5 md:p-3.5 flex flex-col gap-0.5 relative">
        {/* Product Name (Black - Proportionally Sized) */}
        <h3 className="text-black text-[11px] md:text-[15px] font-bold tracking-tight leading-tight truncate">
          {product.name}
        </h3>
        
        {/* Category Name & Rating Display (Compact) */}
        <div className="flex items-center gap-1.5 md:gap-2">
          <p className="text-gray-400 text-[8px] md:text-[9px] font-semibold tracking-wide uppercase">
            {(!product.subcategory || product.subcategory === 'All') 
              ? (product.category || product.categorySlug) 
              : product.subcategory}
          </p>
          <div className="w-[1px] h-2 bg-gray-100" />
          <div className="scale-[0.7] md:scale-[0.85] origin-left flex items-center">
            {renderStars(rating)}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-1 md:mt-2">
          {/* Price Section (Compact) */}
          <div className="flex items-baseline gap-1">
            <span className="text-black font-black text-sm md:text-lg tracking-tight">
              ৳{product.price.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-gray-300 text-[8px] md:text-[9px] line-through font-medium">
                ৳{product.originalPrice?.toLocaleString()}
              </span>
            )}
          </div>

          {/* Add to Cart Outline Button (Compact & Fit) */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const { addItem } = useCartStore.getState();
              addItem(product, 1, product.sizes?.[0], product.colors?.[0]?.name);
              trackEvent('add_to_cart', {
                item_id: product.id,
                item_name: product.name,
                price: product.price
              });
              toast.success(`Item added to bag`, {
                position: 'bottom-center',
                duration: 1500,
                style: {
                  background: '#000',
                  color: '#fff',
                  fontSize: '9px',
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  borderRadius: '0px',
                  padding: '12px 24px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                },
              });
            }}
            className="shrink-0 bg-transparent border border-black text-black px-2.5 py-1 md:px-4 md:py-1.5 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-[0.05em] whitespace-nowrap hover:bg-black hover:text-white transition-all active:scale-95"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}
