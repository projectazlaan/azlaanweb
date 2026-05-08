'use client';
import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause,
  RotateCcw,
  RotateCw,
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  Volume2, 
  VolumeX,
  Maximize2,
  X,
  ArrowUp,
  ArrowDown,
  Heart,
  MessageCircle,
  Bookmark,
  Send,
  MoreVertical
} from 'lucide-react';
const REEL_LINKS = [
  'https://www.facebook.com/reel/1134307095487597',
  'https://www.facebook.com/reel/1259544982273036',
  'https://www.facebook.com/reel/1446643340499772',
  'https://www.facebook.com/reel/1680066329645105',
  'https://www.facebook.com/reel/1426742389142332',
  'https://www.facebook.com/reel/1521778248931006',
  'https://www.facebook.com/reel/1611200360066814',
  'https://www.facebook.com/reel/1134307095487597',
];
export default function ReelsPanel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenIndex, setFullScreenIndex] = useState(0);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  // Social States
  const [likedReels, setLikedReels] = useState<Record<number, boolean>>({});
  const [savedReels, setSavedReels] = useState<Record<number, boolean>>({});
  // Mock Comments
  const MOCK_COMMENTS = [
    { user: 'Samiul Islam', text: 'This looks incredibly premium! 🔥', time: '2m' },
    { user: 'Farhana Ahmed', text: 'Love the quality and the style. Azlaan is best! ❤️', time: '15m' },
    { user: 'Rakib Hasan', text: 'Where can I get this collection?', time: '1h' },
    { user: 'Azlaan Official', text: 'Coming soon to our flagship stores! 🚀', time: '30m', isBrand: true },
  ];
  const [commentsList, setCommentsList] = useState(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState('');
  // Lazy Load Architecture: Only load the first two reels initially for super fast rendering
  const [loadedIframes, setLoadedIframes] = useState<Record<number, boolean>>({
    0: true,
    1: true,
  });
  const [isMuted, setIsMuted] = useState(true);
  const playerRefs = useRef<Record<number, any>>({});
  const modalPlayerRefs = useRef<Record<number, any>>({});
  const lastActiveIndex = useRef<number>(activeIndex);
  const activeIndexRef = useRef<number>(activeIndex);
  const fullScreenIndexRef = useRef<number>(fullScreenIndex);
  const modalScrollRef = useRef<HTMLDivElement>(null);
  // Sync Modal Scroll Position to prevent wrong video showing
  useEffect(() => {
    if (isFullScreen && modalScrollRef.current) {
      setTimeout(() => {
        if (modalScrollRef.current) {
          modalScrollRef.current.scrollTop = fullScreenIndex * modalScrollRef.current.offsetHeight;
        }
      }, 10);
    }
  }, [isFullScreen]);
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);
  useEffect(() => {
    fullScreenIndexRef.current = fullScreenIndex;
  }, [fullScreenIndex]);
  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({});
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCapturedPosition = useRef<number>(0);
  const isTransitioningToFull = useRef<boolean>(false);
  const pendingSeek = useRef<number | null>(null);
  const triggerControls = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 2000);
  }, []);
  useEffect(() => {
    triggerControls();
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isFullScreen, activeIndex, fullScreenIndex, triggerControls]);
  const handlePlayPause = (idx: number, isModal = false) => {
    const key = isModal ? `modal-${idx}` : `carousel-${idx}`;
    const player = isModal ? modalPlayerRefs.current[idx] : playerRefs.current[idx];
    if (player) {
      try {
        const state = player.getState ? player.getState() : (isPlaying[key] ? 'playing' : 'paused');
        if (state === 'playing') {
          player.pause();
          setIsPlaying(prev => ({ ...prev, [key]: false }));
        } else {
          player.play();
          setIsPlaying(prev => ({ ...prev, [key]: true }));
        }
      } catch (e) {
        // Fallback toggle
        if (isPlaying[key]) {
          player.pause();
          setIsPlaying(prev => ({ ...prev, [key]: false }));
        } else {
          player.play();
          setIsPlaying(prev => ({ ...prev, [key]: true }));
        }
      }
    }
    triggerControls();
  };
  const handleSeek = (idx: number, seconds: number, isModal = false) => {
    const player = isModal ? modalPlayerRefs.current[idx] : playerRefs.current[idx];
    if (player) {
      try {
        const currentPos = player.getCurrentPosition();
        player.seek(currentPos + seconds);
        setTimeout(() => player.play(), 50);
      } catch (e) {}
    }
    triggerControls();
  };
  const toggleLike = (idx: number) => {
    setLikedReels(prev => ({ ...prev, [idx]: !prev[idx] }));
  };
  const toggleSave = (idx: number) => {
    setSavedReels(prev => ({ ...prev, [idx]: !prev[idx] }));
  };
  const handleShare = async (link: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Check out this reel from Azlaan', url: link });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(link);
      alert('Link copied to clipboard!');
    }
  };
  // Intersection observer to track centred slide
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setActiveIndex(index);
            // Preload current, next and previous
            setLoadedIframes(prev => ({
              ...prev,
              [index]: true,
              [index + 1]: true,
              [index - 1]: true
            }));
          }
        });
      },
      { root: container, rootMargin: '0px -40% 0px -40%', threshold: 0 }
    );
    container.querySelectorAll('.reel-slide').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  const scrollTo = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const clamped = Math.max(0, Math.min(index, REEL_LINKS.length - 1));
    const slide = container.querySelector<HTMLElement>(`.reel-slide[data-index="${clamped}"]`);
    if (slide) {
      slide.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    setActiveIndex(clamped);
  }, []);
  const prev = () => scrollTo(activeIndex - 1);
  const next = () => scrollTo(activeIndex + 1);
  const getReelId = (url: string) => url.split('/').pop() || '';
  // Load FB SDK and subscribe to events
  const fbSubscribed = useRef(false);
  useEffect(() => {
    const initFB = () => {
      if (!(window as any).FB) return;
      (window as any).FB.XFBML.parse();
      if (fbSubscribed.current) return;
      fbSubscribed.current = true;
      // Subscribe once to ready event to capture player instances
      (window as any).FB.Event.subscribe('xfbml.ready', (msg: any) => {
          if (msg.type === 'video' && msg.id) {
            const isModal = msg.id.includes('modal');
            const idx = parseInt(msg.id.split('-').pop() || '0');
            if (!isNaN(idx)) {
              if (isModal) {
                modalPlayerRefs.current[idx] = msg.instance;
                if (isMuted) msg.instance.mute(); else msg.instance.unmute();
                msg.instance.subscribe('startedPlaying', () => {
                  setIsPlaying(prev => ({ ...prev, [`modal-${idx}`]: true }));
                  // Handle seamless seek when playback actually starts
                  if (pendingSeek.current !== null && idx === fullScreenIndexRef.current) {
                    try {
                      msg.instance.seek(pendingSeek.current);
                      pendingSeek.current = null;
                    } catch (e) {}
                  }
                });
                msg.instance.subscribe('paused', () => {
                  setIsPlaying(prev => ({ ...prev, [`modal-${idx}`]: false }));
                });
                msg.instance.subscribe('finishedPlaying', () => {
                  setIsPlaying(prev => ({ ...prev, [`modal-${idx}`]: false }));
                  if (idx === fullScreenIndexRef.current && idx < REEL_LINKS.length - 1) {
                    setFullScreenIndex(idx + 1);
                  }
                });
                if (idx === fullScreenIndexRef.current) {
                  setTimeout(() => { try { msg.instance.play(); } catch(e) {} }, 500);
                }
              } else {
                playerRefs.current[idx] = msg.instance;
                msg.instance.mute(); // Compliance
                msg.instance.subscribe('startedPlaying', () => {
                  setIsPlaying(prev => ({ ...prev, [`carousel-${idx}`]: true }));
                });
                msg.instance.subscribe('paused', () => {
                  setIsPlaying(prev => ({ ...prev, [`carousel-${idx}`]: false }));
                });
                msg.instance.subscribe('finishedPlaying', () => {
                  setIsPlaying(prev => ({ ...prev, [`carousel-${idx}`]: false }));
                  if (idx === activeIndexRef.current && idx < REEL_LINKS.length - 1) {
                    scrollTo(idx + 1);
                  }
                });
                if (idx === activeIndexRef.current && !isFullScreen) {
                  setTimeout(() => { try { msg.instance.play(); } catch(e) {} }, 500);
                }
              }
            }
          }
        });
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
      initFB();
    }
  }, [isFullScreen, scrollTo]);
  // Dynamic parsing for newly lazy-loaded iframes
  useEffect(() => {
    if ((window as any).FB) {
      // Trigger parse immediately for the active index when it changes or loads
      try { 
        (window as any).FB.XFBML.parse(); 
      } catch(e) {}
    }
  }, [loadedIframes, activeIndex]);
  // Main Carousel Playback Control
  useEffect(() => {
    if (isFullScreen) {
      Object.values(playerRefs.current).forEach(p => p.pause());
      return;
    }
    const isIndexChanged = lastActiveIndex.current !== activeIndex;
    lastActiveIndex.current = activeIndex;
    Object.keys(playerRefs.current).forEach((key) => {
      const idx = parseInt(key);
      const player = playerRefs.current[idx];
      if (!player) return;
      try {
        if (idx === activeIndex) {
          if (isIndexChanged) player.play();
        } else {
          player.pause();
        }
      } catch (e) {}
    });
  }, [activeIndex, isFullScreen]);
  // Modal Playback Control (Seamless Seek)
  useEffect(() => {
    if (!isFullScreen) return;
    const player = modalPlayerRefs.current[fullScreenIndex];
    if (player) {
      try {
        if (isMuted) player.mute(); else player.unmute();
        // If we just opened full screen, mark for pending seek
        if (isTransitioningToFull.current && lastCapturedPosition.current > 0) {
          pendingSeek.current = lastCapturedPosition.current;
          isTransitioningToFull.current = false; // Reset
        }
        player.play();
        // Polling guardian for the first 2 seconds to ensure it stays playing
        let count = 0;
        const interval = setInterval(() => {
          if (count++ > 20 || !isFullScreen) clearInterval(interval);
          if (player.getState && player.getState() !== 'playing') {
            player.play();
          }
        }, 100);
        // Pause others
        Object.keys(modalPlayerRefs.current).forEach((key) => {
          const idx = parseInt(key);
          if (idx !== fullScreenIndex) {
            modalPlayerRefs.current[idx]?.pause();
          }
        });
      } catch (e) {}
    }
  }, [fullScreenIndex, isFullScreen, isMuted]);
  // Section visibility observer
  useEffect(() => {
    const section = containerRef.current?.closest('section');
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          // Pause everything when section is hidden
          Object.values(playerRefs.current).forEach(p => { try { p.pause(); } catch(e) {} });
          Object.values(modalPlayerRefs.current).forEach(p => { try { p.pause(); } catch(e) {} });
        } else {
          // Resume current active reel
          const targetPlayer = isFullScreen 
            ? modalPlayerRefs.current[fullScreenIndex] 
            : playerRefs.current[activeIndex];
          if (targetPlayer) {
            try { targetPlayer.play(); } catch(e) {}
          }
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [isFullScreen, activeIndex, fullScreenIndex]);
  const handleMuteToggle = (e: React.MouseEvent, idx: number, isModal = false) => {
    e.stopPropagation();
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    const key = isModal ? `modal-${idx}` : `carousel-${idx}`;
    const player = isModal ? modalPlayerRefs.current[idx] : playerRefs.current[idx];
    // Apply global mute state to ALL active players
    Object.values(playerRefs.current).forEach(p => { try { if (newMuted) p.mute(); else p.unmute(); } catch(e) {} });
    Object.values(modalPlayerRefs.current).forEach(p => { try { if (newMuted) p.mute(); else p.unmute(); } catch(e) {} });
    if (player) {
      if (!newMuted) {
        // SYNCHRONOUS UNMUTE: Must be in the direct call stack of the click event
        // to bypass the browser's audio auto-play restrictions.
        try {
          player.unmute();
          player.play();
          setIsPlaying(prev => ({ ...prev, [key]: true }));
        } catch(e) {}
        // Safety post-triggers (ensure playback stays active)
        [100, 250, 500, 800].forEach(ms => {
          setTimeout(() => {
            try {
              if (player.getState && player.getState() !== 'playing') {
                player.play();
                setIsPlaying(prev => ({ ...prev, [key]: true }));
              }
            } catch(e) {}
          }, ms);
        });
      }
    }
  };
  const openFullScreen = (index: number, showComments = false) => {
    // Capture position for seamless handover
    const currentPlayer = playerRefs.current[activeIndex];
    if (currentPlayer) {
      try {
        lastCapturedPosition.current = currentPlayer.getCurrentPosition() || 0;
      } catch (e) {
        lastCapturedPosition.current = 0;
      }
    }
    setFullScreenIndex(index);
    setIsFullScreen(true);
    setIsCommentOpen(showComments);
    // Pause main carousel instantly and repeatedly to ensure it stops
    [0, 100, 300].forEach(ms => {
      setTimeout(() => {
        Object.values(playerRefs.current).forEach(p => { try { p.pause(); } catch(e) {} });
      }, ms);
    });
    // Instantly seek and play modal (preserves interaction context for audio)
    setTimeout(() => {
      const modalPlayer = modalPlayerRefs.current[index];
      if (modalPlayer) {
        try {
          if (!isMuted) modalPlayer.unmute();
          modalPlayer.seek(lastCapturedPosition.current);
          modalPlayer.play();
        } catch (e) {}
      }
    }, 50);
  };
  return (
    <section className="pt-4 md:pt-6 pb-0 bg-white overflow-hidden relative">
      <div id="fb-root"></div>
      <div className="max-w-full mx-auto relative">
        {/* ── Header ── */}
        <div className="text-center mb-3 md:mb-4 px-4 relative flex flex-col items-center">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center leading-[0.85] md:leading-[0.8]"
          >
            <span className="font-serif italic text-2xl md:text-3xl text-gray-400 font-light tracking-wider pr-8 md:pr-12 -mb-1 md:-mb-2 z-10">
              Style
            </span>
            <span className="font-sans text-4xl md:text-5xl font-bold tracking-tighter text-primary uppercase drop-shadow-sm">
              Editorials
            </span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex items-center justify-center gap-3 md:gap-4 mt-4 md:mt-5"
          >
            <div className="h-[1px] w-4 md:w-8 bg-gray-400" />
            <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] md:tracking[0.4em] uppercase text-gray-600">
              Watch & Buy
            </span>
            <div className="h-[1px] w-4 md:w-8 bg-gray-400" />
          </motion.div>
        </div>
        {/* ── Carousel wrapper ── */}
        <div className="relative">
          {/* Prev Arrow — desktop only */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            disabled={activeIndex === 0}
            className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-[50] w-11 h-11 items-center justify-center rounded-full bg-white shadow-lg border border-black/10 hover:bg-black hover:text-white transition-all disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          {/* Next Arrow — desktop only */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            disabled={activeIndex === REEL_LINKS.length - 1}
            className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-[50] w-11 h-11 items-center justify-center rounded-full bg-white shadow-lg border border-black/10 hover:bg-black hover:text-white transition-all disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          {/* Carousel */}
          <div
            ref={containerRef}
            className="flex overflow-x-auto gap-[2px] md:gap-5 px-[5vw] md:px-[calc(50vw-140px)] pb-4 scrollbar-hide snap-x snap-mandatory items-center scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {REEL_LINKS.map((link, idx) => {
              const isActive = activeIndex === idx;
              const reelId = getReelId(link);
              const thumbnailUrL = `https://www.facebook.com/plugins/video/thumbnail/?href=${encodeURIComponent(link)}`;
              return (
                <motion.div
                  key={`${link}-${idx}`}
                  data-index={idx}
                  className="reel-slide min-w-[70vw] md:min-w-[280px] w-[70vw] md:w-[280px] aspect-[9/16] flex-shrink-0 snap-center snap-stop-always relative transition-all duration-[400ms] group"
                  onMouseMove={triggerControls}
                  onTouchStart={triggerControls}
                  animate={{
                    scale:   isActive ? 1    : 0.85,
                    opacity: isActive ? 1    : 0.6,
                    filter:  isActive ? 'blur(0px)' : 'blur(2px)',
                    y:       isActive ? 0    : 5,
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20,
                    mass: 0.5
                  }}
                  style={{ willChange: 'transform, opacity' }}
                >
                  <div 
                    className="w-full h-full rounded-2xl md:rounded-3xl overflow-hidden bg-black shadow-2xl relative border border-gray-800"
                    style={{
                      backgroundImage: `url(${thumbnailUrL})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {/* Maximize Button */}
                    {isActive && (
                      <button
                        onClick={() => openFullScreen(idx)}
                        className="absolute top-6 right-6 z-[60] bg-black/40 backdrop-blur-md text-white p-2.5 rounded-full hover:bg-black/60 transition-all border border-white/10 shadow-lg"
                      >
                        <Maximize2 className="w-5 h-5" />
                      </button>
                    )}
                    {/* Facebook Video Plugin (XFBML) - ONLY LOAD IF ACTIVE FOR PERFORMANCE */}
                    {isActive && loadedIframes[idx] && (
                      <div 
                        id={`fb-player-${idx}`}
                        className="fb-video absolute inset-0 w-full h-full opacity-100"
                        data-href={link}
                        data-width="500"
                        data-allowfullscreen="true"
                        data-autoplay="false"
                        data-show-text="false"
                        style={{ 
                          background: 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      />
                    )}
                    {/* Minimal Carousel Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-16 right-2 flex flex-col items-center gap-3 z-[60]">
                      {/* Like */}
                      <div className="flex flex-col items-center gap-0.5 scale-75">
                        <motion.button
                          whileTap={{ scale: 0.8 }}
                          onClick={(e) => { e.stopPropagation(); toggleLike(idx); }}
                          className={`p-2 rounded-full backdrop-blur-xl border transition-all ${likedReels[idx] ? 'bg-red-500 border-red-500 text-white' : 'bg-black/30 border-white/10 text-white'}`}
                        >
                          <Heart className={`w-5 h-5 ${likedReels[idx] ? 'fill-white' : ''}`} />
                        </motion.button>
                        <span className="text-white text-[9px] font-bold shadow-sm">{likedReels[idx] ? '1.3k' : '1.2k'}</span>
                      </div>
                      {/* Comment */}
                      <div className="flex flex-col items-center gap-0.5 scale-75">
                        <button 
                          onClick={(e) => { e.stopPropagation(); openFullScreen(idx, true); }}
                          className="p-2 rounded-full bg-black/30 backdrop-blur-xl border border-white/10 text-white hover:bg-black/50 transition-all"
                        >
                          <MessageCircle className="w-5 h-5" />
                        </button>
                        <span className="text-white text-[9px] font-bold shadow-sm">248</span>
                      </div>
                      {/* Favorite */}
                      <div className="flex flex-col items-center gap-0.5 scale-75">
                        <motion.button
                          whileTap={{ scale: 0.8 }}
                          onClick={(e) => { e.stopPropagation(); toggleSave(idx); }}
                          className={`p-2 rounded-full backdrop-blur-xl border transition-all ${savedReels[idx] ? 'bg-yellow-500 border-yellow-500 text-white' : 'bg-black/30 border-white/10 text-white'}`}
                        >
                          <Bookmark className={`w-5 h-5 ${savedReels[idx] ? 'fill-white' : ''}`} />
                        </motion.button>
                        <span className="text-white text-[9px] font-bold shadow-sm">1.1k</span>
                      </div>
                      {/* Share */}
                      <div className="flex flex-col items-center gap-0.5 scale-75">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleShare(REEL_LINKS[idx]); }}
                          className="p-2 rounded-full bg-black/30 backdrop-blur-xl border border-white/10 text-white hover:bg-black/50 transition-all"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                        <span className="text-white text-[9px] font-bold shadow-sm">Share</span>
                      </div>
                    </div>
                    {/* Compact User Info (Bottom Left) */}
                    <div className="absolute bottom-4 left-3 right-12 z-[60] pointer-events-none">
                      <div className="flex items-center gap-2 mb-1">
                        <img 
                          src="/og-image.png" 
                          alt="Azlaan"
                          className="w-6 h-6 rounded-full border border-white/50 object-cover bg-black"
                        />
                        <span className="text-white font-bold text-[10px] drop-shadow-md">Azlaan</span>
                      </div>
                      <p className="text-white text-[9px] drop-shadow-md line-clamp-1 opacity-90">
                        Modern elegance with our latest collection. #Azlaan
                      </p>
                    </div>
                    {/* Sound Toggle (Only for Active Reel) */}
                    {isActive && (
                      <button 
                        onClick={(e) => handleMuteToggle(e, idx)}
                        className="absolute bottom-4 right-3 bg-black/40 backdrop-blur-md text-white p-2 rounded-full border border-white/10 shadow-lg active:scale-90 transition-all z-[60]"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        {/* ── Dot Indicators ── */}
        <div className="hidden md:flex justify-center items-center gap-2 mt-4 mb-2">
          {REEL_LINKS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              className={`rounded-full transition-all duration-300 ${activeIndex === idx ? 'w-6 h-2 bg-black' : 'w-2 h-2 bg-black/20'}`}
            />
          ))}
        </div>
        {/* ── Cinematic Audio/Video Wave Portal ── */}
        <div className="flex justify-center mt-6 md:mt-2 pb-6">
          <Link 
            href="/visuals" 
            className="group relative h-[36px] w-[140px] rounded-full bg-white border border-black/10 flex items-center justify-center gap-2 overflow-hidden hover:w-[165px] transition-all duration-500 cursor-pointer shadow-lg hover:shadow-xl"
            title="Explore Watch & Buy"
          >
            {/* Play Icon - Always Visible */}
            <div className="w-4 opacity-100 flex justify-center overflow-hidden z-10">
              <Play className="w-3.5 h-3.5 fill-black text-black ml-[1px]" />
            </div>
            {/* See More Text with Wave Animation */}
            <div className="flex items-center justify-center h-full px-1 z-10 overflow-hidden">
              <motion.span 
                className="text-[10px] font-extrabold text-black tracking-widest uppercase flex gap-[1px]"
              >
                {['S','E','E',' ','M','O','R','E'].map((char, i) => (
                  <motion.span
                    key={i}
                    animate={{ 
                      y: [0, -4, 0],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity, 
                      delay: i * 0.1,
                      ease: "easeInOut" 
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </motion.span>
            </div>
            {/* Subtle Cinematic Glow Orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40px] h-[40px] bg-[#0071E3]/30 blur-[15px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          </Link>
        </div>
      </div>
      {/* ── Full Screen Reels Modal (Persistent for Audio Context) ── */}
      <div
        className={`fixed inset-0 bg-black transition-all duration-500 ease-in-out ${
          isFullScreen ? 'opacity-100 z-[1000] pointer-events-auto scale-100' : 'opacity-0 z-[-10] pointer-events-none scale-95'
        }`}
      >
            {/* Close Button */}
            <button
              onClick={() => {
                setIsFullScreen(false);
                // Aggressive Kill Switch: Force MUTE and PAUSE immediately & repeatedly
                const killModalPlayers = () => {
                  Object.values(modalPlayerRefs.current).forEach(p => { 
                    try { 
                      p.mute(); // Instantly kill sound to prevent overlap
                      p.pause(); // Stop playback
                    } catch(e) {} 
                  });
                };
                killModalPlayers();
                setTimeout(killModalPlayers, 50);
                setTimeout(killModalPlayers, 200);
                setTimeout(killModalPlayers, 500);
                // Capture position for seamless return
                const currentModalPlayer = modalPlayerRefs.current[fullScreenIndex];
                if (currentModalPlayer) {
                  try {
                    const pos = currentModalPlayer.getCurrentPosition() || 0;
                    const carouselPlayer = playerRefs.current[fullScreenIndex];
                    if (carouselPlayer) {
                      carouselPlayer.seek(pos);
                      setTimeout(() => {
                        try { 
                          if (!isMuted) carouselPlayer.unmute();
                          carouselPlayer.play(); 
                        } catch(e) {}
                      }, 100);
                    }
                  } catch (e) {}
                }
                scrollTo(fullScreenIndex);
                setIsFullScreen(false);
              }}
              className="absolute top-6 right-6 z-[1100] bg-white/10 backdrop-blur-xl text-white p-3 rounded-full hover:bg-white/20 transition-all shadow-xl"
            >
              <X className="w-6 h-6" />
            </button>
            {/* Vertical Scroll Container */}
            <div 
              ref={modalScrollRef}
              className="h-full w-full overflow-y-auto snap-y snap-mandatory scrollbar-hide"
              onMouseMove={triggerControls}
              onTouchStart={triggerControls}
              onScroll={(e) => {
                const container = e.currentTarget;
                const index = Math.round(container.scrollTop / container.offsetHeight);
                if (index !== fullScreenIndex) {
                  setFullScreenIndex(index);
                  triggerControls();
                }
              }}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {REEL_LINKS.map((link, idx) => {
                const thumbnailUrL = `https://www.facebook.com/plugins/video/thumbnail/?href=${encodeURIComponent(link)}`;
                return (
                  <div 
                    key={`modal-${idx}`}
                    className="h-full w-full snap-start snap-stop-always relative flex items-center justify-center bg-black"
                  >
                    <div 
                      className="w-full h-full md:max-w-[500px] md:h-[90vh] md:rounded-3xl overflow-hidden relative bg-black shadow-2xl group"
                      style={{
                        backgroundImage: `url(${thumbnailUrL})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      {idx === fullScreenIndex && loadedIframes[idx] && (
                        <div 
                          id={`fb-player-modal-${idx}`}
                          className="fb-video absolute inset-0 w-full h-full"
                          data-href={link}
                          data-width="500"
                          data-allowfullscreen="true"
                          data-autoplay="false"
                          data-show-text="false"
                          style={{ background: 'transparent' }}
                        />
                      )}
                      {/* Modal Modern Minimal Controls */}
                      <AnimatePresence>
                        {idx === fullScreenIndex && showControls && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-[1000] flex items-center justify-center gap-10 pointer-events-none"
                          >
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleSeek(idx, -5, true); }}
                              className="p-4 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-black/40 active:scale-90 transition-all pointer-events-auto"
                            >
                              <RotateCcw className="w-6 h-6" />
                              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold">5s</span>
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handlePlayPause(idx, true); }}
                              className="p-6 rounded-full bg-white/20 backdrop-blur-lg border border-white/20 text-white hover:bg-white/30 active:scale-90 transition-all pointer-events-auto"
                            >
                              {isPlaying[`modal-${idx}`] ? <Pause className="w-8 h-8 fill-white" /> : <Play className="w-8 h-8 fill-white" />}
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleSeek(idx, 5, true); }}
                              className="p-4 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-black/40 active:scale-90 transition-all pointer-events-auto"
                            >
                              <RotateCw className="w-6 h-6" />
                              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold">5s</span>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    {/* Modal Social Sidebar */}
                    <div className="absolute bottom-24 right-4 flex flex-col items-center gap-5 z-[1050]">
                      {/* Like */}
                      <div className="flex flex-col items-center gap-1">
                        <motion.button
                          whileTap={{ scale: 0.8 }}
                          onClick={() => toggleLike(idx)}
                          className={`p-3 rounded-full backdrop-blur-xl border transition-all ${likedReels[idx] ? 'bg-red-500 border-red-500 text-white' : 'bg-black/30 border-white/10 text-white'}`}
                        >
                          <Heart className={`w-6 h-6 ${likedReels[idx] ? 'fill-white' : ''}`} />
                        </motion.button>
                        <span className="text-white text-[10px] font-bold shadow-sm">{likedReels[idx] ? '1.3k' : '1.2k'}</span>
                      </div>
                      {/* Comment */}
                      <div className="flex flex-col items-center gap-1">
                        <button 
                          onClick={() => setIsCommentOpen(!isCommentOpen)}
                          className="p-3 rounded-full bg-black/30 backdrop-blur-xl border border-white/10 text-white hover:bg-black/50 transition-all"
                        >
                          <MessageCircle className="w-6 h-6" />
                        </button>
                        <span className="text-white text-[10px] font-bold shadow-sm">248</span>
                      </div>
                      {/* Favorite */}
                      <div className="flex flex-col items-center gap-1">
                        <motion.button
                          whileTap={{ scale: 0.8 }}
                          onClick={() => toggleSave(idx)}
                          className={`p-3 rounded-full backdrop-blur-xl border transition-all ${savedReels[idx] ? 'bg-yellow-500 border-yellow-500 text-white' : 'bg-black/30 border-white/10 text-white'}`}
                        >
                          <Bookmark className={`w-6 h-6 ${savedReels[idx] ? 'fill-white' : ''}`} />
                        </motion.button>
                        <span className="text-white text-[10px] font-bold shadow-sm">1.1k</span>
                      </div>
                      {/* Share */}
                      <div className="flex flex-col items-center gap-1">
                        <button 
                          onClick={() => handleShare(link)}
                          className="p-3 rounded-full bg-black/30 backdrop-blur-xl border border-white/10 text-white hover:bg-black/50 transition-all"
                        >
                          <Send className="w-6 h-6" />
                        </button>
                        <span className="text-white text-[10px] font-bold shadow-sm">Share</span>
                      </div>
                    </div>
                    {/* Modal Comment Panel (Slide Up) */}
                    <AnimatePresence>
                      {isCommentOpen && (
                        <motion.div
                          initial={{ y: "100%" }}
                          animate={{ y: 0 }}
                          exit={{ y: "100%" }}
                          transition={{ type: "spring", damping: 25, stiffness: 200 }}
                          className="absolute bottom-0 left-0 right-0 h-[60vh] bg-black/60 backdrop-blur-2xl rounded-t-[32px] border-t border-white/20 z-[1200] flex flex-col overflow-hidden"
                        >
                          {/* Panel Header */}
                          <div className="p-5 border-b border-white/10 flex items-center justify-between">
                            <span className="text-white font-bold">Comments (248)</span>
                            <button 
                              onClick={() => setIsCommentOpen(false)}
                              className="text-white/60 hover:text-white"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          {/* Comments List */}
                          <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hide">
                            {commentsList.map((c, i) => (
                              <div key={i} className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-xs">
                                  {c.user[0]}
                                </div>
                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-2">
                                    <span className={`text-[11px] font-bold ${c.isBrand ? 'text-blue-400' : 'text-white/60'}`}>
                                      {c.user} {c.isBrand && '✓'}
                                    </span>
                                    <span className="text-white/30 text-[10px]">{c.time}</span>
                                  </div>
                                  <p className="text-white text-xs leading-relaxed">{c.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          {/* Comment Input Box */}
                          <div className="p-4 border-t border-white/10 bg-black/40">
                            <form 
                              onSubmit={(e) => {
                                e.preventDefault();
                                if (!newComment.trim()) return;
                                setCommentsList([{ user: 'You', text: newComment, time: 'Just now' }, ...commentsList]);
                                setNewComment('');
                              }}
                              className="flex items-center gap-3 bg-white/10 rounded-full px-4 py-2 border border-white/10"
                            >
                              <input 
                                type="text" 
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="bg-transparent text-white text-xs outline-none flex-1"
                              />
                              <button 
                                type="submit" 
                                disabled={!newComment.trim()}
                                className="text-blue-400 text-xs font-bold disabled:opacity-50 transition-opacity"
                              >
                                Post
                              </button>
                            </form>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {/* Modal Controls Overlay (Bottom Right) */}
                    <div className="absolute bottom-6 right-4 z-[1050]">
                      <button
                        onClick={(e) => handleMuteToggle(e, idx, true)}
                        className="bg-black/40 backdrop-blur-md text-white p-3 rounded-full border border-white/10 shadow-lg active:scale-90 transition-all"
                      >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                    </div>
                    {/* User Info Overlay (Bottom Left) */}
                    <div className="absolute bottom-6 left-6 right-20 z-[1050] flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-lg bg-black flex items-center justify-center">
                          <img 
                            src="/og-image.png" 
                            alt="Azlaan"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <span className="text-white font-bold text-sm drop-shadow-md">Azlaan Official</span>
                            <div className="bg-blue-500 rounded-full p-0.5">
                              <Play className="w-2 h-2 text-white fill-white" /> {/* Mock verified badge */}
                            </div>
                          </div>
                          <span className="text-white/80 text-[10px]">Premium Editorial</span>
                        </div>
                        <button className="ml-2 px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white text-[10px] font-bold hover:bg-white/40 transition-all">
                          Follow
                        </button>
                      </div>
                      <p className="text-white text-xs drop-shadow-md line-clamp-2 leading-relaxed">
                        Discover the essence of modern elegance with our latest collection. #Azlaan #Premium #Style
                      </p>
                      <div className="flex items-center gap-2 text-white/90">
                        <div className="animate-spin-slow">
                          <Play className="w-3 h-3 fill-white" />
                        </div>
                        <div className="overflow-hidden whitespace-nowrap w-32">
                          <p className="text-[10px] animate-marquee font-medium">Original Audio - Azlaan Visuals 2024</p>
                        </div>
                      </div>
                    </div>
                    {/* Navigation Hints */}
                    {idx > 0 && (
                      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white/40 animate-bounce z-[1050]">
                        <ArrowUp className="w-6 h-6" />
                      </div>
                    )}
                    {idx < REEL_LINKS.length - 1 && (
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 animate-bounce z-[1050]">
                        <ArrowDown className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            </div>
          </div>
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
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 10s linear infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
      `}</style>
    </section>
  );
}
