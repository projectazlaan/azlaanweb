'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  X, 
  Heart, 
  Share2, 
  Eye,
  Clock,
  MoreVertical,
  Search,
  MessageCircle
} from 'lucide-react';

// Premium Mock Video Data
const VIDEOS = [
  {
    id: 1,
    title: 'The Royal Panjabi Collection 2026 - Masterpiece',
    category: 'Latest',
    views: '1.2M',
    duration: '0:45',
    date: '2 days ago',
    link: 'https://www.facebook.com/reel/1134307095487597',
    thumbnail: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Behind the Seams: Crafting Elegance',
    category: 'Popular',
    views: '890K',
    duration: '1:12',
    date: '1 week ago',
    link: 'https://www.facebook.com/reel/1259544982273036',
    thumbnail: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Urban Gentleman Summer Lookbook 🔥',
    category: 'Latest',
    views: '2.1M',
    duration: '0:30',
    date: '2 weeks ago',
    link: 'https://www.facebook.com/reel/1446643340499772',
    thumbnail: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'Ethereal Silhouettes: Paris Runway',
    category: 'Popular',
    views: '3.4M',
    duration: '2:15',
    date: '3 weeks ago',
    link: 'https://www.facebook.com/reel/1680066329645105',
    thumbnail: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 5,
    title: 'Monochrome Elegance Edit',
    category: 'Oldest',
    views: '1.5M',
    duration: '0:55',
    date: '1 month ago',
    link: 'https://www.facebook.com/reel/1426742389142332',
    thumbnail: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 6,
    title: 'Accessories that Define You 👑',
    category: 'Oldest',
    views: '950K',
    duration: '0:20',
    date: '2 months ago',
    link: 'https://www.facebook.com/reel/1521778248931006',
    thumbnail: 'https://images.unsplash.com/photo-1523293115678-d2906198d3b4?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 7,
    title: 'Azlaan Signature Fragrance Launch',
    category: 'Popular',
    views: '5.2M',
    duration: '1:00',
    date: '3 months ago',
    link: 'https://www.facebook.com/reel/1611200360066814',
    thumbnail: 'https://images.unsplash.com/photo-1550614000-4b95d4ebf076?q=80&w=800&auto=format&fit=crop',
  }
];

const CATEGORIES = ['Latest', 'Popular', 'Oldest'];
const TABS = ['Home', 'Videos', 'Shorts', 'Playlists', 'Posts'];

export default function AzlaanCinemaPage() {
  const [activeCategory, setActiveCategory] = useState('Latest');
  const [activeVideo, setActiveVideo] = useState<typeof VIDEOS[0] | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  const gridVideos = activeCategory === 'Latest' 
    ? [...VIDEOS].sort((a, b) => b.id - a.id) // Mock sort
    : VIDEOS.filter(v => v.category === activeCategory);

  // Load Facebook SDK only when modal opens
  useEffect(() => {
    if (activeVideo && !isScriptLoaded) {
      if (!(window as any).FB) {
        const script = document.createElement('script');
        script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0';
        script.async = true;
        script.defer = true;
        script.onload = () => setIsScriptLoaded(true);
        document.body.appendChild(script);
      } else {
        setIsScriptLoaded(true);
      }
    } else if (activeVideo && isScriptLoaded) {
      setTimeout(() => {
        if ((window as any).FB) {
          try { (window as any).FB.XFBML.parse(); } catch(e) {}
        }
      }, 100);
    }
  }, [activeVideo, isScriptLoaded]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (activeVideo) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [activeVideo]);

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#F1F1F1] pt-24 pb-20 selection:bg-blue-500/30 font-sans">
      
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        
        {/* ── Channel Profile Header (YouTube Style) ── */}
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8 mb-8 items-start md:items-center">
          {/* Profile Picture */}
          <div className="w-[120px] h-[120px] md:w-[160px] md:h-[160px] rounded-full overflow-hidden bg-black shrink-0 shadow-lg border border-white/5">
            <img src="/og-image.png" alt="Azlaan" className="w-full h-full object-cover scale-110" />
          </div>
          
          {/* Channel Details */}
          <div className="flex-1">
            <h1 className="text-[28px] md:text-[36px] font-bold text-white mb-1.5 tracking-tight">Azlaan</h1>
            
            <div className="flex flex-wrap items-center gap-2 text-[#AAAAAA] text-[14px] mb-3">
              <span className="font-medium text-white/80">@AzlaanOfficial</span>
              <span>•</span>
              <span>1.2M subscribers</span>
              <span>•</span>
              <span>142 videos</span>
            </div>
            
            <p className="text-[#AAAAAA] text-[14px] max-w-2xl mb-5 line-clamp-2 leading-relaxed">
              Unscripted, unbiased content on premium menswear. Immerse yourself in our world of campaigns, exclusive behind-the-scenes, and cinematic fashion films. <span className="text-white cursor-pointer hover:underline">...more</span>
            </p>
            
            {/* Actions */}
            <div className="flex items-center gap-3">
              <button className="bg-[#F1F1F1] text-[#0F0F0F] font-semibold text-[14px] px-5 py-2 rounded-full hover:bg-[#D9D9D9] transition-colors">
                Subscribe
              </button>
              <button className="bg-white/10 text-[#F1F1F1] font-semibold text-[14px] px-5 py-2 rounded-full hover:bg-white/20 transition-colors flex items-center gap-2">
                <Search className="w-4 h-4" /> Community
              </button>
            </div>
          </div>
        </div>

        {/* ── Navigation Tabs ── */}
        <div className="flex items-center gap-8 border-b border-white/10 mb-6 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`pb-3 text-[15px] font-medium whitespace-nowrap transition-colors relative ${
                tab === 'Shorts' 
                  ? 'text-white' 
                  : 'text-[#AAAAAA] hover:text-white'
              }`}
            >
              {tab}
              {tab === 'Shorts' && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#F1F1F1] rounded-t-sm" />
              )}
            </button>
          ))}
        </div>

        {/* ── Filter Pills ── */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-[14px] font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat 
                  ? 'bg-[#F1F1F1] text-[#0F0F0F]' 
                  : 'bg-white/10 text-[#F1F1F1] hover:bg-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Vertical Shorts Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-2 gap-y-8 md:gap-x-4">
          <AnimatePresence mode="popLayout">
            {gridVideos.map((video) => (
              <motion.div
                key={video.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col group cursor-pointer"
                onClick={() => setActiveVideo(video)}
              >
                {/* 9:16 Vertical Thumbnail */}
                <div className="w-full aspect-[9/16] relative rounded-xl md:rounded-2xl overflow-hidden bg-black mb-3">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  
                  {/* Hover Overlay with Play Icon */}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                      <Play className="w-5 h-5 text-white ml-1 fill-white" />
                    </div>
                  </div>
                </div>
                
                {/* Meta Data (Below Thumbnail) */}
                <div className="flex items-start justify-between gap-2 px-1">
                  <div className="flex-1">
                    <h3 className="text-[#F1F1F1] font-semibold text-[14px] md:text-[15px] leading-snug line-clamp-2 mb-1 group-hover:text-blue-400 transition-colors">
                      {video.title}
                    </h3>
                    <div className="text-[#AAAAAA] text-[13px] font-medium">
                      {video.views} views
                    </div>
                  </div>
                  <button className="pt-0.5 text-[#F1F1F1] opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>

      {/* ── Theater Mode Modal ── */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-8"
          >
            {/* Close Button */}
            <button 
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Content Grid */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-[400px] lg:max-w-6xl max-h-[90vh] flex flex-col lg:flex-row bg-[#0F0F0F] rounded-[24px] border border-white/10 overflow-hidden shadow-2xl"
            >
              {/* Left: Video Player */}
              <div className="relative flex-1 bg-black min-h-[50vh] lg:min-h-[80vh] flex items-center justify-center">
                <div className="relative z-10 w-full h-full flex items-center justify-center bg-black">
                  <div 
                    className="fb-video" 
                    data-href={activeVideo.link}
                    data-width="auto" 
                    data-show-text="false"
                    data-autoplay="true"
                    style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}
                  ></div>
                </div>
              </div>

              {/* Right: Info Panel (Only visible on desktop/large screens) */}
              <div className="hidden lg:flex w-[350px] flex-col border-l border-white/10 bg-[#151515]">
                <div className="p-6 flex-1 overflow-y-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <img src="/og-image.png" alt="Azlaan" className="w-10 h-10 rounded-full border border-white/10 bg-black object-cover" />
                    <div>
                      <h3 className="font-bold text-[#F1F1F1] text-[15px]">Azlaan</h3>
                      <p className="text-[#AAAAAA] text-[12px]">{activeVideo.date}</p>
                    </div>
                  </div>
                  
                  <h2 className="text-[16px] font-semibold text-[#F1F1F1] leading-snug mb-3">
                    {activeVideo.title}
                  </h2>
                  
                  <div className="flex items-center gap-4 text-[#AAAAAA] text-[13px] font-medium mb-6 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4" />
                      {activeVideo.views}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {activeVideo.duration}
                    </div>
                  </div>

                  {/* YT Style Actions */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 gap-2">
                    <button className="flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors">
                      <Heart className="w-5 h-5" />
                      <span className="text-[12px] font-medium">Like</span>
                    </button>
                    <button className="flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-[12px] font-medium">Comment</span>
                    </button>
                    <button className="flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors">
                      <Share2 className="w-5 h-5" />
                      <span className="text-[12px] font-medium">Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .fb-video iframe {
          width: 100% !important;
          height: 100% !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          object-fit: cover !important;
        }
        .fb-video > span {
          width: 100% !important;
          height: 100% !important;
        }
      `}</style>
    </div>
  );
}
