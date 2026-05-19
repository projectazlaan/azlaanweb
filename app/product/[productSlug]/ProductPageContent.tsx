'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Heart, Ruler, ChevronLeft, ChevronRight, Eye, Zap, Lock, Minus, Plus 
} from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { useProductStore } from '@/store/productStore';
import { trackEvent } from '@/lib/analytics';
import ProductGallery from '@/components/product/ProductGallery';
import ScarcityUrgency from '@/components/product/ScarcityUrgency';
import ProductCard from '@/components/product/ProductCard';
import TrustBadges from '@/app/[categorySlug]/TrustBadges';
import FabricSelectionUI from '@/components/product/FabricSelectionUI';
import productsData from '@/data/products.json';

interface ProductGridSectionProps {
  title: string;
  viewAllUrl: string;
  products: Product[];
}

function ProductGridSection({ title, viewAllUrl, products }: ProductGridSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // If expanded, show all; otherwise, show at most 8 products (2 rows)
  const displayProducts = isExpanded ? products : products.slice(0, 8);

  if (displayProducts.length === 0) return null;

  return (
    <div className="w-full py-2 border-b border-neutral-100/50 last:border-b-0">
      <div className="mb-6 px-2 md:px-0 flex flex-col items-center text-center justify-center">
        <h3 className="text-lg md:text-xl tracking-[0.12em] uppercase text-neutral-900 font-extrabold font-sans flex flex-col items-center gap-1">
          <span>You May Also Like</span>
          <span className="font-serif italic lowercase text-neutral-500 font-light normal-case text-[15px] md:text-[17px]">
            in same category
          </span>
        </h3>
        <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-neutral-300 to-transparent mt-3" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6 md:gap-x-6 md:gap-y-8">
        {displayProducts.map((p, idx) => (
          <div 
            key={p.id} 
            className={`transition-all duration-300 hover:translate-y-[-4px] ${(idx >= 4 && !isExpanded) ? 'hidden md:block' : 'block'}`}
          >
            <ProductCard product={p} viewMode="grid" />
          </div>
        ))}
      </div>

      {products.length > 8 && (
        <div className="flex justify-center mt-8">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-6 py-2.5 rounded-full border border-neutral-200 hover:border-neutral-900 text-neutral-700 hover:text-neutral-900 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 active:scale-95 bg-white shadow-sm hover:shadow-md cursor-pointer"
          >
            {isExpanded ? 'Show Less' : 'See All Collection'}
          </button>
        </div>
      )}
    </div>
  );
}

interface ProductPageContentProps {
  product: Product;
  recommended: Product[];
}

export default function ProductPageContent({ product, recommended }: ProductPageContentProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || '');
  const [quantity, setQuantity] = useState(1);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('desc');

  // Filter products for "You May Also Like in same category" (same categorySlug, excluding current product)
  const sameCategoryProducts = (productsData as any[]).filter(
    (p) => p.categorySlug === product.categorySlug && p.id !== product.id
  ) as Product[];
  
  const productDescription = product.description || `Experience the ultimate sophistication with our premium ${product.name}. Carefully handcrafted from the finest ${product.fabric || 'cotton'} and cut in a refined ${product.fit || 'classic'} profile. Features intricate artisan craftsmanship, tailored edges, and an exquisite finish perfect for standard or elite celebrations. Fully breathable, durable, and designed to offer unmatched style and all-day comfort.`;
  
  const buyButtonRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { addItem } = useCartStore();
  const { addToRecentlyViewed, toggleWishlist, isInWishlist } = useProductStore();
  const isWished = isInWishlist(product.id);
  
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // Scroll detection for sticky bar (Desktop only)
  useEffect(() => {
    const handleScroll = () => {
      if (!buyButtonRef.current) return;
      const rect = buyButtonRef.current.getBoundingClientRect();
      setShowStickyBar(rect.top < 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    addToRecentlyViewed(product);
    trackEvent('view_item', {
      item_id: product.id,
      item_name: product.name,
      item_category: product.categorySlug,
      price: product.price
    });
  }, [product, addToRecentlyViewed]);

  const handleAddToCart = () => {
    addItem(product, quantity, selectedSize, selectedColor);
    trackEvent('add_to_cart', {
      item_id: product.id,
      item_name: product.name,
      quantity,
      size: selectedSize,
      color: selectedColor,
      price: product.price
    });
  };

  const handleBuyNow = () => {
    addItem(product, quantity, selectedSize, selectedColor);
    trackEvent('begin_checkout', {
      item_id: product.id,
      item_name: product.name,
      quantity,
      size: selectedSize,
      color: selectedColor,
      price: product.price
    });
    router.push('/checkout');
  };

  const toggleAccordion = (name: string) => {
    setOpenAccordion(prev => prev === name ? null : name);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  const handleLengthChange = (val: number) => {
    const newLen = Math.max(0.5, Math.min(10, val));
    setQuantity(newLen);
  };

  const recommendations = [
    { label: 'Panjabi', length: 3 },
    { label: 'Formal Shirt', length: 2.5 },
    { label: 'Saree', length: 5.5 },
    { label: 'Suiting', length: 3.5 },
  ];

  return (
    <main className="min-h-screen bg-white">

      {/* ── Glassmorphic Floating Pill Console (Desktop sticky only) ── */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div 
            initial={{ y: -100, opacity: 0, scale: 0.95 }}
            animate={{ y: 20, opacity: 1, scale: 1 }}
            exit={{ y: -100, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="fixed top-0 left-0 right-0 z-[60] px-4 hidden lg:block"
          >
            <div className="max-w-4xl mx-auto bg-neutral-900/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-full px-6 py-2.5 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-10 rounded-md overflow-hidden border border-white/10 relative shrink-0">
                  <Image src={(product.images && product.images[0]) || ''} alt={product.name} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="text-[9px] font-bold uppercase tracking-widest text-neutral-300 truncate max-w-[150px]">{product.name}</h3>
                  <p className="text-xs font-semibold text-white mt-0.5">
                    ৳{product.isSoldByLength ? (product.price * quantity).toLocaleString() : product.price.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-lg border border-white/5">
                   {product.sizes?.map(s => {
                     const isSelected = selectedSize === s;
                     return (
                       <button 
                         key={s} 
                         onClick={() => setSelectedSize(s)}
                         className="relative px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest transition-colors duration-300"
                       >
                         {isSelected && (
                           <motion.div 
                             layoutId="stickySizeBg"
                             className="absolute inset-0 bg-white rounded-md shadow-sm"
                             transition={{ type: "spring", stiffness: 380, damping: 30 }}
                           />
                         )}
                         <span className={`relative z-10 transition-colors ${isSelected ? 'text-neutral-900' : 'text-neutral-400'}`}>
                           {s}
                         </span>
                       </button>
                     );
                   })}
                   {product.isSoldByLength && (
                     <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 px-2">
                        {quantity}m Selected
                     </p>
                   )}
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={handleAddToCart}
                    className="bg-white/10 border border-white/15 text-white hover:bg-white/15 px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.15em] transition-all flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Cart
                  </button>
                  <button 
                    onClick={handleBuyNow}
                    className="bg-white text-neutral-900 hover:bg-neutral-50 px-5 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.15em] transition-all flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    Buy
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Unified Responsive Layout (Mobile Locked, PC Adaptive) ── */}
      <div className="bg-white min-h-screen w-full">
        <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-16 max-w-[1400px] mx-auto px-0 lg:px-8 pt-0 lg:pt-12 items-start w-full">
          
          {/* Left Column: Gallery (Handles Mobile swipe & Desktop stack internally) */}
          <div className="w-full lg:col-span-7 relative">
            <ProductGallery 
              images={product.images} 
              name={product.name} 
              isWished={isWished}
              onWishlistToggle={() => toggleWishlist(product.id)}
            />
          </div>

          {/* Right Column: Details (Sticky on PC) */}
          <div className="w-full lg:col-span-5 px-5 lg:px-0 pt-3.5 pb-8 space-y-6 lg:sticky lg:top-[100px]">

            {/* Desktop Only: Breadcrumbs, Badges, and Title (Mobile displays title inside Gallery overlay) */}
            <div className="hidden lg:block space-y-4 mb-6">
              <nav className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.25em] text-neutral-400">
                <Link href="/" className="hover:text-neutral-800 transition-colors">Home</Link>
                <ChevronRight className="w-3 h-3 text-neutral-300" />
                <Link href={`/shop?categorySlug=${product.categorySlug}`} className="hover:text-neutral-800 transition-colors">{product.categorySlug}</Link>
                <ChevronRight className="w-3 h-3 text-neutral-300" />
                <span className="text-neutral-600">{product.name}</span>
              </nav>
              <div className="flex flex-wrap items-center gap-2.5">
                {product.badge && (
                  <span className="bg-neutral-900 text-white text-[8px] font-bold uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full shadow-sm">
                    {product.badge}
                  </span>
                )}
                <span className="border border-neutral-200 text-neutral-500 text-[8px] font-bold uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full flex items-center gap-2">
                  <Eye className="w-3 h-3 text-neutral-400" /> {product.viewersCount || 42} Collectors Interested
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 font-sans leading-tight">
                {product.name}
              </h1>
            </div>

            <div className="flex items-start justify-between gap-6 pt-1 select-none">
              {/* Left: Product Short Description */}
              <p className="text-[11px] font-normal text-neutral-500 leading-relaxed font-sans flex-1">
                {product.description ? (product.description.length > 95 ? product.description.slice(0, 95) + '...' : product.description) : 'Premium custom-woven lifestyle companion designed for the modern wardrobe.'}
              </p>
            {/* Right: Highly Visible Price */}
            <div className="flex flex-col items-end shrink-0 text-right pr-4">
              <span className="text-3xl font-black text-neutral-950 font-sans tracking-tight leading-none">
                ৳{(product.price * quantity).toLocaleString()}
              </span>
              {product.originalPrice && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-neutral-400 line-through text-[11px] font-sans leading-none">
                    ৳{(product.originalPrice * quantity).toLocaleString()}
                  </span>
                  <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded uppercase tracking-wider font-sans leading-none shrink-0">
                    {discountPercentage}% OFF
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Side-by-side Selection grid (Left Color, Right Size) */}
          <div className="grid grid-cols-2 gap-8 items-start">
            {/* Left Column: Color options */}
            <div>
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">Color: {selectedColor}</p>
                  <div className="flex flex-wrap gap-2.5 items-center">
                    {product.colors.map(c => {
                      const isSel = selectedColor === c.name;
                      return (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c.name)}
                          className="relative p-0.5 shrink-0"
                        >
                          {isSel && <motion.div layoutId="mColRing" className="absolute -inset-1 rounded-full border border-neutral-950" />}
                          <div className="w-7 h-7 rounded-full shadow-inner relative z-10" style={{ backgroundColor: c.value }} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Size options */}
            <div>
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center pr-2">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">Size: <span className="text-neutral-900 font-bold ml-1">{selectedSize}</span></p>
                    <button className="text-[9px] font-bold text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-1 uppercase tracking-widest">
                      <Ruler className="w-3 h-3" /> Size Guide
                    </button>
                  </div>
                  <div className="flex w-full gap-1 p-1 bg-neutral-100/60 rounded-lg border border-neutral-200/80">
                    {product.sizes.map(s => {
                      const isSel = selectedSize === s;
                      return (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className="relative flex-1 py-2 text-[10.5px] font-bold uppercase tracking-wider transition-colors text-center shrink-0"
                        >
                          {isSel && <motion.div layoutId="mSizeBg" className="absolute inset-0 bg-neutral-950 rounded shadow-md" />}
                          <span className={`relative z-10 transition-colors ${isSel ? 'text-white font-black' : 'text-neutral-700 hover:text-neutral-950'}`}>{s}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Custom Fabric Ruler (Shown full width under selectors if sold by length) */}
          {product.isSoldByLength && (
            <div className="space-y-3 pt-2">
              <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">Fabric Length</p>
              <div className="relative bg-neutral-50 border border-neutral-100 rounded-xl p-3.5 overflow-hidden shadow-inner select-none h-12 flex items-center">
                <div className="absolute top-0 bottom-0 left-1/2 w-[1.5px] bg-neutral-950 z-20" />
                <motion.div 
                  className="absolute flex items-end gap-[14px] h-full bottom-0"
                  animate={{ x: `calc(50% - ${(quantity - 0.5) * 26}px - 7px)` }}
                  transition={{ type: "spring", stiffness: 220, damping: 26 }}
                >
                  {Array.from({ length: 20 }, (_, i) => {
                    const val = 0.5 + i * 0.5;
                    const isWhole = val % 1 === 0;
                    const isSelected = quantity === val;
                    return (
                      <div 
                        key={val} 
                        onClick={() => handleLengthChange(val)}
                        className="flex flex-col items-center justify-end h-6 cursor-pointer w-[14px] shrink-0"
                      >
                        <span className={`text-[7px] font-mono mb-1 transition-colors ${isSelected ? 'text-neutral-950 font-bold' : 'text-neutral-300'}`}>
                          {isWhole ? `${val}.0` : `${val}`}
                        </span>
                        <div className={`w-[1px] ${isSelected ? 'h-3.5 bg-neutral-950 w-[1.5px]' : 'h-2 bg-neutral-200'}`} />
                      </div>
                    );
                  })}
                </motion.div>
              </div>

              <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
                {recommendations.map(r => (
                  <button 
                    key={r.label}
                    onClick={() => handleLengthChange(r.length)}
                    className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest shrink-0 transition-all ${
                      quantity === r.length ? 'bg-neutral-950 text-white' : 'bg-neutral-50 border border-neutral-100 text-neutral-400'
                    }`}
                  >
                    {r.label} ({r.length}m)
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cart options - Placed inline immediately below the selectors */}
          <div className="flex gap-3 pt-2">
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-white border border-neutral-950 text-neutral-950 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              <ShoppingBag className="w-4 h-4" /> Add to Cart
            </button>
            <button 
              onClick={handleBuyNow}
              className="flex-1 bg-neutral-950 text-white py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-md"
            >
              <Zap className="w-4 h-4 fill-current" /> Buy It Now
            </button>
          </div>

          <div className="h-[0.5px] w-full bg-neutral-100 my-6" />

          {/* User Spec: Rating Input Star Option directly below cart options */}
          <div className="bg-white border border-neutral-200/60 rounded-2xl p-5 select-none shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-800 flex items-center gap-2 font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 animate-pulse" />
                YOUR IMPRESSION
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 font-mono">
                {userRating !== null ? `RATED ${userRating}/5` : 'TAP TO RATE'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isHovered = hoverRating !== null && hoverRating >= star;
                  const isSelected = userRating !== null && userRating >= star;
                  return (
                    <button
                      key={star}
                      onClick={() => setUserRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="text-neutral-200 active:scale-90 transition-all hover:scale-110 duration-200 cursor-pointer"
                    >
                      <svg 
                        className={`w-6 h-6 transition-all duration-200 ${
                          isHovered || isSelected ? 'text-amber-400 fill-current filter drop-shadow-[0_0_4px_rgba(251,191,36,0.2)]' : 'text-neutral-200 fill-none stroke-current stroke-[1.25px]'
                        }`} 
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    </button>
                  );
                })}
              </div>
              <AnimatePresence mode="wait">
                {userRating !== null ? (
                  <motion.span 
                    key="thankyou"
                    initial={{ opacity: 0, y: 3 }} 
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50/60 border border-emerald-100/50 px-2.5 py-1 rounded-lg leading-none shrink-0"
                  >
                    {userRating === 5 ? 'EXQUISITE' : userRating === 4 ? 'IMPECCABLE' : userRating === 3 ? 'SUPERB' : userRating === 2 ? 'FINE' : 'FAIR'}
                  </motion.span>
                ) : (
                  <span className="text-[9px] font-semibold uppercase tracking-widest text-neutral-400 font-sans leading-none">Verified Collector Feedback</span>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* User Spec: Real-time Urgency indicators / browsing counter placed under the Rating option */}
          <div className="flex items-center gap-4 bg-neutral-50/70 border border-neutral-100/50 p-3.5 rounded-2xl mt-4">
            <div className="flex items-center text-[9px] font-bold uppercase tracking-widest text-neutral-500">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{product.viewersCount || 42} browsing</span>
            </div>
            {product.stockCount < 15 && (
              <div className="flex items-center text-[9px] font-bold uppercase tracking-widest text-amber-700 ml-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
                <span>Only {product.stockCount} remain</span>
              </div>
            )}
          </div>

          {/* User Spec: Super modern & dynamic designed Accordion Panel block below the browsing counter */}
          <div className="space-y-3 mt-5">
            {/* Accordion 1: Product Description */}
            <div className={`border rounded-2xl overflow-hidden transition-all duration-300 group cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.02)] ${openAccordion === 'desc' ? 'border-neutral-950 bg-white ring-1 ring-neutral-950' : 'border-neutral-200/70 bg-white/70 hover:bg-white hover:border-neutral-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]'}`}>
              <button 
                onClick={() => toggleAccordion('desc')}
                className="w-full px-5 py-4 flex items-center justify-between text-left select-none cursor-pointer"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-800 flex items-center gap-2.5 font-sans transition-colors group-hover:text-neutral-950">
                  <span className={`w-1.5 h-1.5 rounded-full transition-colors ${openAccordion === 'desc' ? 'bg-neutral-950' : 'bg-neutral-400 group-hover:bg-neutral-900'}`} />
                  01. Product Description
                </span>
                <div className={`w-6.5 h-6.5 rounded-full border flex items-center justify-center transition-all duration-300 shrink-0 ${openAccordion === 'desc' ? 'bg-neutral-950 border-neutral-950 text-white shadow-sm' : 'bg-neutral-50/50 border-neutral-200/80 text-neutral-500 group-hover:bg-neutral-950 group-hover:border-neutral-950 group-hover:text-white shadow-sm'}`}>
                  <motion.span 
                    animate={{ rotate: openAccordion === 'desc' ? 45 : 0 }} 
                    className="font-light text-xs flex items-center justify-center leading-none"
                  >
                    +
                  </motion.span>
                </div>
              </button>
              <AnimatePresence initial={false}>
                {openAccordion === 'desc' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 280, damping: 28 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1 text-[11.5px] text-neutral-600 leading-relaxed font-sans font-normal border-t border-neutral-100/50 bg-white/40">
                      {productDescription}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 2: Fabric & Care */}
            <div className={`border rounded-2xl overflow-hidden transition-all duration-300 group cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.02)] ${openAccordion === 'fabric' ? 'border-neutral-950 bg-white ring-1 ring-neutral-950' : 'border-neutral-200/70 bg-white/70 hover:bg-white hover:border-neutral-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]'}`}>
              <button 
                onClick={() => toggleAccordion('fabric')}
                className="w-full px-5 py-4 flex items-center justify-between text-left select-none cursor-pointer"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-800 flex items-center gap-2.5 font-sans transition-colors group-hover:text-neutral-950">
                  <span className={`w-1.5 h-1.5 rounded-full transition-colors ${openAccordion === 'fabric' ? 'bg-neutral-950' : 'bg-neutral-400 group-hover:bg-neutral-900'}`} />
                  02. Fabric & Care
                </span>
                <div className={`w-6.5 h-6.5 rounded-full border flex items-center justify-center transition-all duration-300 shrink-0 ${openAccordion === 'fabric' ? 'bg-neutral-950 border-neutral-950 text-white shadow-sm' : 'bg-neutral-50/50 border-neutral-200/80 text-neutral-500 group-hover:bg-neutral-950 group-hover:border-neutral-950 group-hover:text-white shadow-sm'}`}>
                  <motion.span 
                    animate={{ rotate: openAccordion === 'fabric' ? 45 : 0 }} 
                    className="font-light text-xs flex items-center justify-center leading-none"
                  >
                    +
                  </motion.span>
                </div>
              </button>
              <AnimatePresence initial={false}>
                {openAccordion === 'fabric' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 280, damping: 28 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1 text-[11.5px] text-neutral-600 leading-relaxed font-sans font-normal border-t border-neutral-100/50 bg-white/40 space-y-2">
                      <div className="flex justify-between py-1.5 border-b border-neutral-100/40 font-sans">
                        <span className="font-semibold text-neutral-800">Composition</span>
                        <span>100% Organic Cotton</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-neutral-100/40 font-sans">
                        <span className="font-semibold text-neutral-800">Loom Weave</span>
                        <span>Artisan Weaving Pattern</span>
                      </div>
                      <div className="flex justify-between py-1.5 font-sans">
                        <span className="font-semibold text-neutral-800">Care Advice</span>
                        <span>Dry clean or gentle hand wash cold</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 3: Exchange, Return & Refund */}
            <div className={`border rounded-2xl overflow-hidden transition-all duration-300 group cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.02)] ${openAccordion === 'sizing' ? 'border-neutral-950 bg-white ring-1 ring-neutral-950' : 'border-neutral-200/70 bg-white/70 hover:bg-white hover:border-neutral-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]'}`}>
              <button 
                onClick={() => toggleAccordion('sizing')}
                className="w-full px-5 py-4 flex items-center justify-between text-left select-none cursor-pointer"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-800 flex items-center gap-2.5 font-sans transition-colors group-hover:text-neutral-950">
                  <span className={`w-1.5 h-1.5 rounded-full transition-colors ${openAccordion === 'sizing' ? 'bg-neutral-950' : 'bg-neutral-400 group-hover:bg-neutral-900'}`} />
                  03. Exchange, Return & Refund
                </span>
                <div className={`w-6.5 h-6.5 rounded-full border flex items-center justify-center transition-all duration-300 shrink-0 ${openAccordion === 'sizing' ? 'bg-neutral-950 border-neutral-950 text-white shadow-sm' : 'bg-neutral-50/50 border-neutral-200/80 text-neutral-500 group-hover:bg-neutral-950 group-hover:border-neutral-950 group-hover:text-white shadow-sm'}`}>
                  <motion.span 
                    animate={{ rotate: openAccordion === 'sizing' ? 45 : 0 }} 
                    className="font-light text-xs flex items-center justify-center leading-none"
                  >
                    +
                  </motion.span>
                </div>
              </button>
              <AnimatePresence initial={false}>
                {openAccordion === 'sizing' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 280, damping: 28 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1 text-[11.5px] text-neutral-600 leading-relaxed font-sans font-normal border-t border-neutral-100/50 bg-white/40 space-y-2">
                      <p>We offer a 7-day complimentary return or exchange period for all unworn garments with original tags attached.</p>
                      <p>Refunds will be processed back to your original payment method or via mobile banking within 3-5 business days.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 4: Delivery Details */}
            <div className={`border rounded-2xl overflow-hidden transition-all duration-300 group cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.02)] ${openAccordion === 'shipping' ? 'border-neutral-950 bg-white ring-1 ring-neutral-950' : 'border-neutral-200/70 bg-white/70 hover:bg-white hover:border-neutral-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]'}`}>
              <button 
                onClick={() => toggleAccordion('shipping')}
                className="w-full px-5 py-4 flex items-center justify-between text-left select-none cursor-pointer"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-800 flex items-center gap-2.5 font-sans transition-colors group-hover:text-neutral-950">
                  <span className={`w-1.5 h-1.5 rounded-full transition-colors ${openAccordion === 'shipping' ? 'bg-neutral-950' : 'bg-neutral-400 group-hover:bg-neutral-900'}`} />
                  04. Delivery Details
                </span>
                <div className={`w-6.5 h-6.5 rounded-full border flex items-center justify-center transition-all duration-300 shrink-0 ${openAccordion === 'shipping' ? 'bg-neutral-950 border-neutral-950 text-white shadow-sm' : 'bg-neutral-50/50 border-neutral-200/80 text-neutral-500 group-hover:bg-neutral-950 group-hover:border-neutral-950 group-hover:text-white shadow-sm'}`}>
                  <motion.span 
                    animate={{ rotate: openAccordion === 'shipping' ? 45 : 0 }} 
                    className="font-light text-xs flex items-center justify-center leading-none"
                  >
                    +
                  </motion.span>
                </div>
              </button>
              <AnimatePresence initial={false}>
                {openAccordion === 'shipping' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 280, damping: 28 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1 text-[11.5px] text-neutral-600 leading-relaxed font-sans font-normal border-t border-neutral-100/50 bg-white/40 space-y-2">
                      <p><strong>Inside Dhaka:</strong> Delivery within 2-3 business days (Fee: ৳80).</p>
                      <p><strong>Outside Dhaka:</strong> Delivery within 3-5 business days (Fee: ৳150).</p>
                      <p>Worldwide insured shipping available (5-7 business days).</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        </div>

        {/* Full Width Bottom Elements (Below Grid) */}
        <div className="w-full max-w-[1400px] mx-auto px-0 lg:px-8 pb-12 lg:pb-24 pt-8 lg:pt-16">
          <div className="px-5 lg:px-0">
            <ProductGridSection 
              title="You May Also Like in same category"
              viewAllUrl={`/shop?categorySlug=${product.categorySlug}`}
              products={sameCategoryProducts}
            />
          </div>
          <div className="px-5 lg:px-0 border-t border-neutral-100 mt-8 pt-8">
            <TrustBadges />
          </div>
        </div>
      </div>
    </main>
  );
}
