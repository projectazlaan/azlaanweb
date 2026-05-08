'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  ShoppingBag, Heart, Share2, Ruler, ShieldCheck, 
  Truck, RefreshCw, Star, ArrowRight, CheckCircle2,
  ChevronRight, Eye, Zap, Lock, CreditCard
} from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { useProductStore } from '@/store/productStore';
import { trackEvent } from '@/lib/analytics';
import ProductGallery from '@/components/product/ProductGallery';
import ScarcityUrgency from '@/components/product/ScarcityUrgency';
import SocialProofToast from '@/components/product/SocialProofToast';
import BundleBuilder from '@/components/product/BundleBuilder';
import ProductCard from '@/components/product/ProductCard';
import TrustBadges from '@/app/[categorySlug]/TrustBadges';

import FabricSelectionUI from '@/components/product/FabricSelectionUI';

interface ProductPageContentProps {
  product: Product;
  recommended: Product[];
}

export default function ProductPageContent({ product, recommended }: ProductPageContentProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || '');
  const [quantity, setQuantity] = useState(1);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const buyButtonRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { addItem, clearCart } = useCartStore();
  const { addToRecentlyViewed, toggleWishlist, isInWishlist } = useProductStore();

  const isWished = isInWishlist(product.id);

  // Scroll detection for sticky bar
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

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <main className="min-h-screen bg-white">
      {/* Social Proof Notification */}
      <SocialProofToast purchases={product.recentPurchases || []} />

      {/* ── Sticky Purchase Bar (The WOW Factor) ── */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-0 left-0 right-0 z-[60] bg-white/90 backdrop-blur-xl border-b border-black/5 shadow-xl py-3 px-4 md:px-8 hidden md:block"
          >
            <div className="max-w-[1400px] mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-black/5 relative">
                  <Image src={(product.images && product.images[0]) || ''} alt={product.name} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-primary">{product.name}</h3>
                  <p className="text-sm font-bold text-blue-600">
                    ৳{product.isSoldByLength ? (product.price * quantity).toLocaleString() : product.price.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 mr-4">
                   {product.sizes?.map(s => (
                     <button 
                       key={s} 
                       onClick={() => setSelectedSize(s)}
                       className={`text-[9px] font-black uppercase tracking-tighter w-7 h-7 rounded-full border transition-all ${selectedSize === s ? 'bg-black text-white border-black' : 'border-black/10 text-black/40 hover:border-black/20'}`}
                     >
                       {s}
                     </button>
                   ))}
                   {product.isSoldByLength && (
                     <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                        {quantity} {quantity > 1 ? 'Meters' : 'Meter'} Selected
                     </p>
                   )}
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="bg-gray-100 text-black px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-gray-200 transition-all flex items-center gap-2"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Cart
                </button>
                <button 
                  onClick={handleBuyNow}
                  className="bg-black text-white px-8 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-transform flex items-center gap-2"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  Buy Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="max-w-[1400px] mx-auto px-4 pt-8 md:pt-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-24">

          {/* Left: Product Gallery (Col-7) */}
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <ProductGallery images={product.images} name={product.name} />

            </motion.div>
          </div>

          {/* Right: Product Info (Col-5) */}
          <div className="lg:col-span-5 flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Breadcrumbs */}
              <nav className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-black/20 mb-6">
                <Link href="/" className="hover:text-black transition-colors">Home</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href={`/${product.categorySlug}`} className="hover:text-black transition-colors">{product.categorySlug}</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-black/60">{product.name}</span>
              </nav>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-100'}`} />
                  ))}
                </div>
                <span className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em]">
                  {product.reviewCount} Reviews • {product.isSoldByLength ? 'Premium Textile' : 'Heritage Series'}
                </span>
              </div>

              {/* Luxury Badges (Moved from image overlay) */}
              <div className="flex flex-wrap gap-2 mb-6">
                {product.badge && (
                  <span className="bg-black text-white text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-lg">
                    {product.badge}
                  </span>
                )}
                <span className="bg-blue-50 text-blue-600 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-blue-100 flex items-center gap-2">
                  <Eye className="w-3 h-3" /> {product.viewersCount || 42} Viewing Now
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-primary leading-[0.85] mb-6">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-4xl font-black text-[#1D1D1F]">
                  ৳{product.isSoldByLength ? product.price.toLocaleString() + ' / meter' : product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <div className="flex items-center gap-3">
                    <span className="text-xl text-black/20 line-through font-bold">
                      ৳{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      -{discountPercentage}% Off
                    </span>
                  </div>
                )}
              </div>

              <div className="h-px w-full bg-black/5 mb-8" />
            </motion.div>

            {/* Urgency Widget */}
            <ScarcityUrgency 
              stockCount={product.stockCount} 
              viewersCount={product.viewersCount || 0} 
              offerEndsAt={product.offerEndsAt}
            />

            {/* Selectors / Fabric UI */}
            <div className="space-y-10 my-10">
              {product.isSoldByLength ? (
                <FabricSelectionUI 
                  product={product} 
                  onLengthChange={(len) => setQuantity(len)} 
                />
              ) : (
                <>
                  {/* Color Selector */}
                  {product.colors && product.colors.length > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                      <div className="flex justify-between items-baseline mb-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-black/40">Color <span className="text-black ml-2">{selectedColor}</span></p>
                        <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest border border-blue-100 px-2 py-1 rounded">Artisan Dyed</span>
                      </div>
                      <div className="flex gap-4">
                        {product.colors.map((color) => (
                          <button
                            key={color.name}
                            onClick={() => setSelectedColor(color.name)}
                            className={`w-12 h-12 rounded-full border-2 p-1 transition-all duration-300 ${
                              selectedColor === color.name ? 'border-black scale-110 shadow-xl' : 'border-transparent opacity-40 hover:opacity-100'
                            }`}
                          >
                            <div className="w-full h-full rounded-full shadow-inner" style={{ backgroundColor: color.value }} />
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Size Selector */}
                  {product.sizes && product.sizes.length > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                      <div className="flex justify-between items-baseline mb-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-black/40">Select Size <span className="text-black ml-2">{selectedSize}</span></p>
                        <button className="text-[9px] font-black text-black/60 hover:text-black transition-colors flex items-center gap-1.5 uppercase tracking-widest">
                          <Ruler className="w-3.5 h-3.5" /> Size Guide
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`min-w-[64px] h-12 flex items-center justify-center text-[12px] font-black uppercase tracking-widest border-2 transition-all duration-300 rounded-xl ${
                              selectedSize === size
                                ? 'border-black bg-black text-white shadow-2xl scale-105'
                                : 'border-black/5 text-black/40 hover:border-black/20 hover:bg-gray-50'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-col gap-4 mt-4" ref={buyButtonRef}>
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-white border-2 border-black text-black py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-3 hover:bg-gray-50 transition-all active:scale-95"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Add to Cart
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`px-6 border-2 rounded-2xl transition-all hover:bg-gray-50 flex items-center justify-center ${
                    isWished ? 'border-red-100 bg-red-50 text-red-500' : 'border-black/5 text-black/20'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isWished ? 'fill-current' : ''}`} />
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full bg-black text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[12px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex items-center justify-center gap-3 hover:bg-[#1D1D1F] transition-all hover:-translate-y-1 active:translate-y-0"
              >
                <Zap className="w-5 h-5 fill-current text-yellow-400" />
                Buy It Now
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-green-600 bg-green-50/50 py-3 rounded-xl border border-green-100">
               <CheckCircle2 className="w-3.5 h-3.5" /> Secure Checkout Verified
            </div>

            {/* Style Tip Box */}
            <div className="mt-12 p-6 bg-blue-50/30 rounded-3xl border border-blue-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                <ShoppingBag className="w-20 h-20 text-blue-600" />
              </div>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                <ArrowRight className="w-3 h-3" /> Designer's Note
              </p>
              <p className="text-[13px] font-medium text-blue-900/80 leading-relaxed italic relative z-10">
                "Pair this {selectedColor} masterpiece with our 
                <span className="font-bold underline cursor-pointer mx-1 text-blue-600">Signature White Chinos</span> for a clean, high-editorial look that commands attention."
              </p>
            </div>

            {/* Secure Checkout Badge */}
            <div className="mt-12 flex flex-col items-center gap-4 bg-gray-50 py-6 rounded-3xl border border-black/[0.03]">
               <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-black/30">
                  <Lock className="w-3 h-3" /> Secure Payment Guaranteed
               </div>
               <img src="https://securepay.com.bd/images/payment_methods.png" alt="Payment Methods" className="h-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" />
            </div>
          </div>
        </div>

        {/* ── Immersive Details Sections ── */}
        <section className="mt-32">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col gap-4">
                 <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mb-2 shadow-xl">
                    <Truck className="w-6 h-6" />
                 </div>
                 <h4 className="text-sm font-black uppercase tracking-widest">Global Shipping</h4>
                 <p className="text-xs text-black/50 leading-relaxed">Experience worldwide delivery with our premium logistics partners. Fully tracked and insured.</p>
              </div>
              <div className="flex flex-col gap-4">
                 <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mb-2 shadow-xl">
                    <RefreshCw className="w-6 h-6" />
                 </div>
                 <h4 className="text-sm font-black uppercase tracking-widest">Hassle-Free Returns</h4>
                 <p className="text-xs text-black/50 leading-relaxed">Not the perfect fit? Enjoy our 7-day no-questions-asked return policy for total peace of mind.</p>
              </div>
              <div className="flex flex-col gap-4">
                 <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mb-2 shadow-xl">
                    <ShieldCheck className="w-6 h-6" />
                 </div>
                 <h4 className="text-sm font-black uppercase tracking-widest">Heritage Quality</h4>
                 <p className="text-xs text-black/50 leading-relaxed">Each piece is crafted using long-staple fibers and artisan techniques passed through generations.</p>
              </div>
           </div>
        </section>

        {/* Complete the Look Bundle Builder */}
        <div className="mt-32">
          <BundleBuilder mainProduct={product} />
        </div>

        {/* Recommended Products */}
        <section className="mt-32">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">You May Also Like</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20 mt-2">Curated Recommendations</p>
            </div>
            <Link href="/shop" className="text-[10px] font-black uppercase tracking-widest hover:underline">View All →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {recommended.map((p) => (
              <ProductCard key={p.id} product={p} viewMode="grid" />
            ))}
          </div>
        </section>
      </section>

      <TrustBadges />
    </main>
  );
}
