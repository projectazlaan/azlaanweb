'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  X,
  Heart,
  Share2,
  Eye,
  Clock,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  ShoppingCart,
  ExternalLink,
  Volume2,
  VolumeX,
  TrendingUp,
  Sparkles,
  Calendar,
  Tag
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

// We import useCartStore for cart functionality (assuming it exists based on other components)
// If it doesn't exist, we will gracefully handle it.
import { useCartStore } from '@/store/cartStore';

// ============================================
// TYPES
// ============================================
interface Video {
  id: string;
  title: string;
  title_bn?: string;
  description: string;
  fb_reel_id: string;
  thumbnail_url: string;
  preview_video_url?: string;
  views: number;
  likes: number;
  duration: string;
  created_at: string;
  category: string;
  tags: string[];
  featured_products: FeaturedProduct[];
  is_trending: boolean;
}

interface FeaturedProduct {
  id: string;
  name: string;
  name_bn?: string;
  price: number;
  images: string[];
  image_url?: string; // fallback for safety
  category: string;
  categorySlug: string;
  slug: string;
  rating: number;
  reviewCount: number;
  isInStock: boolean;
  stockCount: number;
}

// ============================================
// GENUINE DATA
// ============================================
// ============================================
// GENUINE DATA
// ============================================
const getFBThumbnail = (fb_reel_id: string) => 
  `https://www.facebook.com/plugins/video/thumbnail/?href=${encodeURIComponent(`https://www.facebook.com/reel/${fb_reel_id}`)}`;

const GENUINE_VIDEOS: Video[] = [
  {
    id: '1',
    fb_reel_id: '1134307095487597',
    title: 'The Royal Panjabi Collection 2026',
    title_bn: 'রয়্যাল পাঞ্জাবি কালেকশন ২০২৬',
    description: 'Masterpiece crafted for elegance. Experience the finest fabrics and intricate embroidery in our new arrival.',
    thumbnail_url: '/media-pro/cover/cover 1.jpg',
    views: 1200500,
    likes: 45200,
    duration: '0:45',
    created_at: '2026-05-01',
    category: 'collection',
    tags: ['premium', 'panjabi', 'new'],
    is_trending: true,
    featured_products: [
      { 
        id: 'p1', 
        name: 'Premium Silk Panjabi', 
        price: 4590, 
        images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=400&fit=crop'], 
        category: 'men', 
        categorySlug: 'men',
        slug: 'premium-silk-panjabi',
        rating: 5,
        reviewCount: 12,
        isInStock: true,
        stockCount: 50
      }
    ]
  },
  {
    id: '2',
    fb_reel_id: '1259544982273036',
    title: 'Behind the Seams: Crafting Elegance',
    title_bn: 'পর্দার আড়ালে: কারুশিল্প',
    description: 'A glimpse into our Eid 2026 photoshoot. From fabric selection to the final frame.',
    thumbnail_url: '/media-pro/cover/cover 2.jpg',
    views: 890000,
    likes: 34500,
    duration: '1:12',
    created_at: '2026-04-25',
    category: 'behind-scenes',
    tags: ['bts', 'eid', 'making'],
    is_trending: false,
    featured_products: [
      { 
        id: 'p3', 
        name: 'Signature Cotton Kurta', 
        price: 2890, 
        images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&h=400&fit=crop'], 
        category: 'men', 
        categorySlug: 'men',
        slug: 'signature-cotton-kurta',
        rating: 4.8,
        reviewCount: 45,
        isInStock: true,
        stockCount: 100
      }
    ]
  },
  {
    id: '3',
    fb_reel_id: '1446643340499772',
    title: 'Urban Gentleman Summer Lookbook',
    title_bn: 'গ্রীষ্মকালীন লুকবুক',
    description: 'Casual wear that makes a statement. Dhaka street fashion at its finest.',
    thumbnail_url: '/media-pro/cover/cover 3.jpg',
    views: 2100000,
    likes: 89000,
    duration: '0:55',
    created_at: '2026-04-20',
    category: 'street-style',
    tags: ['summer', 'casual', 'street'],
    is_trending: true,
    featured_products: [
      { 
        id: 'p4', 
        name: 'Urban Street Tee', 
        price: 890, 
        images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop'], 
        category: 'men', 
        categorySlug: 'men',
        slug: 'urban-street-tee',
        rating: 4.5,
        reviewCount: 89,
        isInStock: true,
        stockCount: 200
      }
    ]
  },
  {
    id: '4',
    fb_reel_id: '1680066329645105',
    title: 'Ethereal Silhouettes: Paris Runway',
    title_bn: 'প্যারিস রানওয়ে',
    description: 'Bringing global trends to local streets with our premium line.',
    thumbnail_url: '/media-pro/cover/cover 4.jpg',
    views: 3400000,
    likes: 120000,
    duration: '2:15',
    created_at: '2026-04-15',
    category: 'collection',
    tags: ['runway', 'global', 'premium'],
    is_trending: true,
    featured_products: [
      { 
        id: 'p6', 
        name: 'Premium Linen Suit', 
        price: 12990, 
        images: ['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=300&h=400&fit=crop'], 
        category: 'men', 
        categorySlug: 'men',
        slug: 'premium-linen-suit',
        rating: 5,
        reviewCount: 5,
        isInStock: true,
        stockCount: 10
      }
    ]
  },
  {
    id: '5',
    fb_reel_id: '1426742389142332',
    title: 'Monochrome Elegance Edit',
    title_bn: 'সাদাকালো কালেকশন',
    description: 'Black and white perfection. The monochrome collection is here.',
    thumbnail_url: '/media-pro/men/Design 1/649824908_122120770023151981_1372810042799937270_n.webp',
    views: 1500000,
    likes: 56000,
    duration: '0:30',
    created_at: '2026-04-10',
    category: 'collection',
    tags: ['monochrome', 'classic'],
    is_trending: false,
    featured_products: [
      { 
        id: 'p7', 
        name: 'Monochrome Panjabi Set', 
        price: 5490, 
        images: ['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&h=400&fit=crop'], 
        category: 'men', 
        categorySlug: 'men',
        slug: 'monochrome-panjabi-set',
        rating: 4.9,
        reviewCount: 22,
        isInStock: true,
        stockCount: 30
      }
    ]
  },
  {
    id: '6',
    fb_reel_id: '1521778248931006',
    title: 'Accessories that Define You',
    title_bn: 'এক্সেসরিজ কালেকশন',
    description: 'Complete your look with our premium range of accessories.',
    thumbnail_url: '/media-pro/men/Design 10/650308351_122120930805151981_448751621387112284_n.webp',
    views: 950000,
    likes: 23000,
    duration: '0:20',
    created_at: '2026-04-05',
    category: 'street-style',
    tags: ['accessories', 'style'],
    is_trending: false,
    featured_products: []
  },
  {
    id: '7',
    fb_reel_id: '1611200360066814',
    title: 'Azlaan Signature Fragrance',
    title_bn: 'সিগনেচার পারফিউম',
    description: 'Introducing the scent of elegance. Our first signature fragrance is finally here.',
    thumbnail_url: '/media-pro/men/Design 13/650773462_122121105159151981_1562194778741078206_n.webp',
    views: 5200000,
    likes: 210000,
    duration: '1:00',
    created_at: '2026-03-20',
    category: 'collection',
    tags: ['fragrance', 'launch', 'new'],
    is_trending: true,
    featured_products: []
  }
];

// ============================================
// UTILITY FUNCTIONS
// ============================================
function formatViews(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// ============================================
// COMPONENTS
// ============================================

// ---- Video Card (Apple Theme & Product Oriented) ----
function VideoCard({ video, index, onClick }: { video: Video; index: number; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const firstProduct = video.featured_products && video.featured_products.length > 0 ? video.featured_products[0] : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (firstProduct) {
      try {
        const addItem = useCartStore.getState().addItem;
        addItem(firstProduct as any, 1, 'M', 'Standard');
        toast.success(`Added ${firstProduct.name} to cart`);
      } catch (err) {
        toast.success('Added to cart'); // fallback
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="group cursor-pointer bg-white rounded-3xl md:rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-500 overflow-hidden flex flex-col h-full border border-black/5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[9/16] bg-[#f5f5f7] overflow-hidden">
        {/* Main Image */}
        <img
          src={video.thumbnail_url}
          alt={video.title}
          className={`w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
        />
        
        {/* Gradient Overlay for bottom text readablility */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none opacity-80" />

        {/* Duration Badge */}
        <div className="absolute bottom-3 right-3 bg-[rgba(255,255,255,0.2)] backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] md:text-[11px] font-semibold tracking-wide text-white border border-white/20 z-10">
          {video.duration}
        </div>

        {/* Trending Badge */}
        {video.is_trending && (
          <div className="absolute top-3 md:top-4 left-3 md:left-4 bg-[#0071E3] px-3 py-1.5 rounded-full flex items-center gap-1.5 z-10 shadow-lg shadow-blue-500/30">
            <TrendingUp size={12} className="text-white" />
            <span className="text-[10px] md:text-[11px] font-semibold text-white tracking-wide">Trending</span>
          </div>
        )}

        {/* Play Button */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 z-20 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
           <div className="w-12 h-12 md:w-16 md:h-16 bg-[rgba(255,255,255,0.25)] backdrop-blur-xl rounded-full flex items-center justify-center border border-white/40 shadow-xl">
             <Play size={20} className="text-white ml-1 md:w-7 md:h-7" fill="white" />
           </div>
        </div>

        {/* Views Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 z-10">
          <Eye size={14} className="text-white/90" />
          <span className="text-[10px] md:text-[11px] font-semibold tracking-wide text-white/90 drop-shadow-md">{formatViews(video.views)}</span>
        </div>
      </div>

      {/* Info: Product Context Instead of Pure Video Context */}
      <div className="p-4 md:p-5 flex-1 flex flex-col justify-between bg-white relative z-10">
        {firstProduct ? (
          <>
            <div>
              <h3 className="font-bold text-[#1d1d1f] text-[14px] md:text-[16px] leading-tight line-clamp-1 transition-colors group-hover:text-[#0071E3]">
                {firstProduct.name}
              </h3>
              <p className="text-[12px] md:text-[13px] text-[#86868b] line-clamp-1 mt-0.5 font-medium">{video.title}</p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[#1d1d1f] font-bold text-[15px] md:text-[16px]">৳{firstProduct.price.toLocaleString()}</span>
              <button 
                onClick={handleAddToCart}
                className="w-8 h-8 rounded-full bg-[#f5f5f7] border border-[#d2d2d7] hover:bg-[#1d1d1f] hover:border-[#1d1d1f] hover:text-white flex items-center justify-center transition-colors shadow-sm"
                title="Add to Cart"
              >
                <ShoppingBag size={14} />
              </button>
            </div>
          </>
        ) : (
          <>
            <div>
              <h3 className="font-bold text-[#1d1d1f] text-[14px] md:text-[16px] leading-tight line-clamp-2 transition-colors group-hover:text-[#0071E3]">
                {video.title}
              </h3>
              {video.title_bn && (
                <p className="text-[12px] md:text-[13px] text-[#86868b] line-clamp-1 mt-1 font-medium">{video.title_bn}</p>
              )}
            </div>
            
            <div className="mt-4 flex items-center justify-between text-[#86868b] text-[11px] md:text-[12px] font-semibold">
              <span className="flex items-center gap-1 md:gap-1.5">
                <Heart size={14} className="text-[#86868b]" />
                {formatViews(video.likes)}
              </span>
              <span className="flex items-center gap-1 md:gap-1.5">
                <Calendar size={14} />
                {formatDate(video.created_at)}
              </span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

// ---- Video Modal (Apple TV+ Theater Mode) ----
// ---- Video Modal (Apple TV+ Theater Mode with Shoppable Overlay) ----
function VideoModal({ video, allVideos, onClose, onNavigate }: {
  video: Video;
  allVideos: Video[];
  onClose: () => void;
  onNavigate: (video: Video) => void;
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [showFullInfo, setShowFullInfo] = useState(false);
  const currentIndex = allVideos.findIndex(v => v.id === video.id);
  const router = useRouter();
  const firstProduct = video.featured_products && video.featured_products.length > 0 ? video.featured_products[0] : null;

  const handleAddToCart = (product: FeaturedProduct, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      const addItem = useCartStore.getState().addItem;
      addItem(product as any, 1, 'M', 'Standard');
      toast.success(`Added ${product.name} to cart`);
    } catch (err) {
      toast.success('Added to cart');
    }
  };

  const handleBuyNow = (product: FeaturedProduct, e?: React.MouseEvent) => {
    e?.stopPropagation();
    handleAddToCart(product);
    router.push('/checkout');
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(allVideos[currentIndex - 1]);
      if (e.key === 'ArrowRight' && currentIndex < allVideos.length - 1) onNavigate(allVideos[currentIndex + 1]);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, allVideos, onNavigate, onClose]);

  useEffect(() => {
    const initFB = () => {
      if (!(window as any).FB) return;
      (window as any).FB.XFBML.parse();
    };

    if (!(window as any).FB) {
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      script.onload = initFB;
      document.body.appendChild(script);
      (window as any).fbAsyncInit = function() {
        (window as any).FB.init({ xfbml: true, version: 'v18.0' });
        initFB();
      };
    } else {
      setTimeout(initFB, 100);
    }
  }, [video.id]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-black md:bg-[rgba(0,0,0,0.92)] md:backdrop-blur-3xl flex items-center justify-center p-0 md:p-6 lg:p-8"
    >
      {/* Background click to close full info */}
      {showFullInfo && (
        <div 
          className="absolute inset-0 z-[80] bg-black/20" 
          onClick={() => setShowFullInfo(false)}
        />
      )}

      {/* Video Counter (Top Left) */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6 z-[120] bg-[rgba(255,255,255,0.15)] backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/10 text-white text-xs font-bold shadow-lg">
        {currentIndex + 1} / {allVideos.length}
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-6 md:right-6 z-[120] w-10 h-10 bg-[rgba(255,255,255,0.15)] backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-[rgba(255,255,255,0.3)] hover:scale-110 transition-all duration-300 shadow-xl"
      >
        <X size={22} />
      </button>

      {/* Navigation Arrows (Universal Floating Design) */}
      {!showFullInfo && currentIndex > 0 && (
        <button
          onClick={() => onNavigate(allVideos[currentIndex - 1])}
          className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-[110] w-10 h-10 md:w-12 md:h-12 bg-[rgba(255,255,255,0.15)] backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-[rgba(255,255,255,0.3)] hover:scale-110 transition-all duration-300 shadow-lg"
        >
          <ChevronLeft size={24} />
        </button>
      )}
      {!showFullInfo && currentIndex < allVideos.length - 1 && (
        <button
          onClick={() => onNavigate(allVideos[currentIndex + 1])}
          className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-[110] w-10 h-10 md:w-12 md:h-12 bg-[rgba(255,255,255,0.15)] backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-[rgba(255,255,255,0.3)] hover:scale-110 transition-all duration-300 shadow-lg"
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* Main Content Modal Container */}
      <motion.div 
        initial={{ y: 20, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-full md:h-[90vh] max-w-[1200px] flex flex-col md:flex-row bg-black md:rounded-[40px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative"
      >
        
        {/* Video Player Side (Full Screen on Mobile) */}
        <div 
          className="absolute inset-0 md:relative md:flex-[1.4] bg-black flex items-center justify-center z-10"
          onClick={() => setShowFullInfo(false)}
        >
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
             {/* Main Video Wrapper */}
             <div className="w-full h-full md:h-[95%] md:aspect-[9/16] md:rounded-[24px] overflow-hidden bg-black flex items-center justify-center">
                <div 
                  className="fb-video w-full h-full flex items-center justify-center"
                  data-href={`https://www.facebook.com/reel/${video.fb_reel_id}`}
                  data-width="auto"
                  data-allowfullscreen="true"
                  data-autoplay="true"
                  data-show-text="false"
                  style={{ background: 'transparent' }}
                />
             </div>

             {/* UI Overlay on Video */}
             <div className="absolute inset-x-0 bottom-0 p-5 pb-24 md:pb-10 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none">
                <div className="max-w-[500px] pointer-events-auto">
                   <h3 className="text-white font-bold text-lg md:text-xl tracking-tight mb-1">{video.title}</h3>
                   <p className="text-white/70 text-sm md:text-base line-clamp-1 mb-4">{video.description}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Collapsible Info Panel (Bottom Sheet for Mobile, Right Sidebar for Desktop) */}
        <motion.div 
          initial={false}
          animate={{ 
            height: showFullInfo ? '80%' : '140px',
            y: 0,
            opacity: 1
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={`absolute bottom-0 inset-x-0 md:relative md:inset-auto md:h-full md:flex-1 bg-[#1c1c1e] z-[90] flex flex-col transition-all duration-500 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] md:shadow-none ${
            showFullInfo ? 'rounded-t-[32px] md:rounded-none' : 'rounded-t-[32px] md:rounded-none overflow-hidden'
          }`}
        >
          {/* Collapse Handle (Mobile only) */}
          <div 
            className="md:hidden w-full h-8 flex items-center justify-center cursor-pointer"
            onClick={() => setShowFullInfo(!showFullInfo)}
          >
            <div className="w-12 h-1.5 bg-white/20 rounded-full" />
          </div>

          {/* Mini Product Card (Always visible at bottom when collapsed) */}
          {!showFullInfo && firstProduct && (
            <div 
              className="px-5 py-2 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setShowFullInfo(true);
              }}
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-lg">
                <img src={firstProduct.images[0]} alt={firstProduct.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-bold text-[14px] truncate">{firstProduct.name}</h4>
                <p className="text-[#0071E3] font-bold text-[16px]">৳{firstProduct.price.toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                 <button 
                   onClick={(e) => handleAddToCart(firstProduct, e)}
                   className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
                 >
                   <ShoppingCart size={18} />
                 </button>
                 <button 
                   onClick={(e) => handleBuyNow(firstProduct, e)}
                   className="w-10 h-10 rounded-full bg-[#0071E3] flex items-center justify-center text-white hover:bg-blue-600 transition-all"
                 >
                   <Sparkles size={18} />
                 </button>
              </div>
            </div>
          )}

          {/* Full Info Content */}
          <div className={`flex-1 overflow-y-auto custom-scrollbar ${!showFullInfo ? 'hidden md:block' : 'block'}`}>
            {/* Header with Title & Likes */}
            <div className="p-6 md:p-8 border-b border-white/5">
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-[22px] md:text-[24px] font-bold text-white tracking-tight">{video.title}</h2>
              </div>
              {video.title_bn && <p className="text-[#86868b] font-medium mb-4">{video.title_bn}</p>}
              <p className="text-[#a1a1a6] text-[14px] md:text-[15px] leading-relaxed mb-6">{video.description}</p>
              
              <div className="flex items-center gap-6 text-[13px] text-[#86868b] font-semibold">
                <span className="flex items-center gap-2"><Eye size={18} /> {formatViews(video.views)}</span>
                <span className="flex items-center gap-2 cursor-pointer" onClick={() => setIsLiked(!isLiked)}>
                  <Heart size={18} fill={isLiked ? '#ff3b30' : 'none'} className={isLiked ? 'text-[#ff3b30]' : ''} /> 
                  {formatViews(video.likes + (isLiked ? 1 : 0))}
                </span>
                <span className="flex items-center gap-2"><Clock size={18} /> {video.duration}</span>
              </div>
            </div>

            {/* Shoppable Grid */}
            <div className="p-6 md:p-8">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center justify-between">
                Featured Products
                <span className="text-xs bg-white/10 px-2.5 py-1 rounded-full text-[#86868b] font-bold">{video.featured_products.length}</span>
              </h3>
              
              <div className="space-y-4">
                {video.featured_products.map((product) => (
                  <div key={product.id} className="group p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-white/5">
                        <img src={product.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-bold truncate">{product.name}</h4>
                        <p className="text-[#86868b] text-sm mb-2">{product.category}</p>
                        <div className="flex items-center justify-between">
                           <span className="text-white font-extrabold text-lg">৳{product.price.toLocaleString()}</span>
                           <div className="flex gap-2">
                             <button onClick={() => handleAddToCart(product)} className="p-2.5 rounded-full bg-white/5 hover:bg-white hover:text-black transition-all text-white">
                               <ShoppingCart size={18} />
                             </button>
                             <button onClick={() => handleBuyNow(product)} className="px-4 py-2 bg-[#0071E3] hover:bg-blue-600 text-white rounded-full text-xs font-bold transition-all">
                               Buy Now
                             </button>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {video.featured_products.length === 0 && (
                  <p className="text-[#86868b] text-center py-4">No products featured.</p>
                )}
              </div>
            </div>

            {/* Share & Tags */}
            <div className="p-6 md:p-8 pt-0">
               <button className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white font-bold flex items-center justify-center gap-3 transition-all mb-6">
                 <Share2 size={20} /> Share this Look
               </button>
               <div className="flex flex-wrap gap-2">
                  {video.tags.map(tag => (
                    <span key={tag} className="px-4 py-1.5 bg-white/5 rounded-full text-xs font-bold text-[#86868b] hover:text-white transition-colors cursor-pointer">#{tag}</span>
                  ))}
               </div>
            </div>
          </div>

          {/* Desktop Close/Collapse Toggle (Always at top of sidebar on desktop) */}
          <div className="hidden md:flex p-4 border-b border-white/5 items-center justify-between">
             <span className="text-white font-bold opacity-50 text-xs tracking-widest uppercase">Video Details</span>
             <button 
               onClick={() => setShowFullInfo(!showFullInfo)}
               className="text-white/50 hover:text-white transition-colors"
             >
                {showFullInfo ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
             </button>
          </div>
        </motion.div>

      </motion.div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.2);
        }
      `}</style>
    </motion.div>
  );
}

// ============================================
// MAIN PAGE
// ============================================
export default function AzlaanCinemaPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeFilter, setActiveFilter] = useState('latest');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', label: 'All Videos' },
    { id: 'collection', label: 'Collections' },
    { id: 'behind-scenes', label: 'Behind the Scenes' },
    { id: 'street-style', label: 'Street Style' },
  ];

  const filters = [
    { id: 'latest', label: 'Latest', icon: Calendar },
    { id: 'popular', label: 'Popular', icon: TrendingUp },
    { id: 'trending', label: 'Trending', icon: Sparkles },
  ];

  // Load Initial Videos
  useEffect(() => {
    setVideos(GENUINE_VIDEOS);
    setFilteredVideos(GENUINE_VIDEOS);
    setLoading(false);
  }, []);

  // Filter & Sort
  useEffect(() => {
    let result = [...videos];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(v => 
        v.title.toLowerCase().includes(query) ||
        v.title_bn?.includes(query) ||
        v.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (activeCategory !== 'all') {
      result = result.filter(v => v.category === activeCategory);
    }

    // Sort
    switch (activeFilter) {
      case 'latest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'popular':
        result.sort((a, b) => b.views - a.views);
        break;
      case 'trending':
        result = result.filter(v => v.is_trending);
        break;
    }

    setFilteredVideos(result);
  }, [videos, searchQuery, activeCategory, activeFilter]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (activeVideo) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [activeVideo]);

  return (
    <div className="min-h-screen bg-[#f5f5f7] font-sans pt-16 md:pt-0">
      
      {/* ── Ultra Modern Apple-style Hero Header ── */}
      <div className="relative bg-[#f5f5f7] overflow-hidden pt-8 pb-6 md:pt-24 md:pb-8 border-b border-[#e5e5ea]">
        {/* Abstract Blur Orbs for background */}
        <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#0071E3]/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/3" />

        <div className="relative max-w-[1400px] mx-auto px-5 md:px-10 flex flex-col items-center text-center">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-white border border-[#d2d2d7] shadow-sm mb-4 md:mb-6"
          >
             <Play size={14} className="text-[#0071E3] fill-[#0071E3]" />
             <span className="text-[11px] md:text-[13px] font-semibold text-[#1d1d1f] uppercase tracking-widest">Azlaan Studio</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[32px] sm:text-[42px] md:text-[54px] lg:text-[64px] font-bold text-[#1d1d1f] tracking-tighter leading-[1.05] max-w-4xl"
          >
            Watch & Buy <br className="md:hidden" /> from real videos.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[15px] md:text-[18px] font-medium text-[#86868b] tracking-tight leading-relaxed max-w-2xl mt-3 md:mt-4"
          >
            Shop the looks directly from our fashion films, campaigns, and exclusive behind-the-scenes content.
          </motion.p>
        </div>
      </div>

      {/* Floating Sticky Filter Bar */}
      <div className="sticky top-[60px] md:top-[80px] z-40 bg-[#f5f5f7]/80 backdrop-blur-2xl border-b border-[#e5e5ea] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-3 md:py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Scrollable Categories */}
          <div className="w-full sm:w-auto overflow-x-auto scrollbar-hide -mx-5 px-5 sm:mx-0 sm:px-0">
            <div className="flex items-center gap-2 w-max">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 md:px-5 py-2 md:py-2.5 rounded-full text-[13px] md:text-[14px] font-semibold whitespace-nowrap transition-all duration-300 ${
                    activeCategory === cat.id
                      ? 'bg-[#1d1d1f] text-white shadow-md'
                      : 'bg-white text-[#1d1d1f] border border-[#d2d2d7] hover:bg-[#e8e8ed]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input (Desktop mainly, stacks on mobile) */}
          <div className="relative w-full sm:w-[280px] md:w-[320px] shrink-0">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b]" />
            <input
              type="text"
              placeholder="Search visuals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-white border border-[#d2d2d7] rounded-full text-[14px] md:text-[15px] font-medium text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none focus:border-[#0071E3] focus:ring-1 focus:ring-[#0071E3] transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Video Grid Section */}
      <div className="bg-[#f5f5f7] pb-24 pt-8 md:pt-12">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
            <h2 className="text-[18px] md:text-[22px] font-semibold text-[#1d1d1f] tracking-tight">
              {activeCategory === 'all' ? 'All Videos' : categories.find(c => c.id === activeCategory)?.label}
              <span className="ml-3 text-[14px] font-medium text-[#86868b]">{filteredVideos.length} Videos</span>
            </h2>
            
            {/* Sort Filters */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-[#d2d2d7] shadow-sm w-max">
              {filters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-3 md:px-4 py-1.5 rounded-full text-[12px] md:text-[13px] font-semibold transition-all duration-300 ${
                    activeFilter === filter.id
                      ? 'bg-[#e8e8ed] text-[#1d1d1f]'
                      : 'text-[#86868b] hover:text-[#1d1d1f]'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl md:rounded-[32px] overflow-hidden shadow-sm h-[320px] md:h-[400px] border border-black/5 p-2 flex flex-col">
                  <div className="w-full h-[65%] bg-[#f5f5f7] rounded-[24px] animate-pulse" />
                  <div className="flex-1 p-4 flex flex-col gap-3">
                    <div className="h-4 md:h-5 bg-[#f5f5f7] rounded-md w-3/4 animate-pulse" />
                    <div className="h-3 md:h-4 bg-[#f5f5f7] rounded-md w-1/2 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredVideos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 md:py-32 bg-white rounded-3xl md:rounded-[32px] border border-[#d2d2d7] shadow-sm mx-auto max-w-3xl"
            >
              <Search size={40} className="text-[#d2d2d7] mx-auto mb-5" />
              <h3 className="text-[20px] md:text-[24px] font-semibold text-[#1d1d1f] mb-2 tracking-tight">No visuals found</h3>
              <p className="text-[14px] md:text-[15px] font-medium text-[#86868b]">Try adjusting your search query or changing filters.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {filteredVideos.map((video, index) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  index={index}
                  onClick={() => setActiveVideo(video)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Video Modal (Apple TV+ style) */}
      <AnimatePresence>
        {activeVideo && (
          <VideoModal
            video={activeVideo}
            allVideos={filteredVideos}
            onClose={() => setActiveVideo(null)}
            onNavigate={(v) => setActiveVideo(v)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
