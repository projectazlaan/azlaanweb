'use client';
import { useRouter } from 'next/navigation';
import { useMemo, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ArrowRight, ShoppingBag, ArrowDownUp, SlidersHorizontal, LayoutGrid, List as ListIcon, User, Menu, Scissors, Sparkles, Award, Star, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent } from '@/lib/analytics';
import { Category, Product, Language } from '@/types';
import { useCategoryStore } from '@/store/categoryStore';
import { useCartStore } from '@/store/cartStore';
import { useSidebar } from '@/context/SidebarContext';
import FilterBar, { Icons } from './FilterBar';
import MobileFilterDrawer from './MobileFilterDrawer';
import ProductGrid from './ProductGrid';
import ProductCard from '@/components/product/ProductCard';
import ActiveFilterChips from './ActiveFilterChips';
import SortSelect from './SortSelect';
import ViewToggle from './ViewToggle';
import TrustBadges from './TrustBadges';
import PersonalizedRecs from './PersonalizedRecs';
import HeroSection from '@/components/HeroSection';
import SubCategoryCards from './SubCategoryCards';
import PromoBanner from '@/components/PromoBanner';
// Craftsmanship and details data map for different subcategories
const craftsmanshipData: Record<string, {
  image: string;
  details: Array<{ title: string; desc: string; iconName: string }>;
}> = {
  'Panjabi': {
    image: '/media-pro/men/Design 5/650905571_122120824035151981_4320891712881698677_n.webp',
    details: [
      { title: 'ATELIER STITCHING', desc: 'Sews at an ultra-fine 18 Stitches Per Inch (SPI) with double-felled seams for timeless longevity.', iconName: 'Scissors' },
      { title: 'HAND-LOOMED COTTON', desc: 'Crafted from 100% premium long-staple Egyptian cotton yarn with superior breathability.', iconName: 'Sparkles' },
      { title: 'SIGNATURE EMBROIDERY', desc: 'Intricate micro-embroidery meticulously hand-guided on collars and cuffs using silk thread.', iconName: 'Award' }
    ]
  },
  'Classic Kurtas': {
    image: '/media-pro/men/Design 11/650770969_122120920443151981_7419337193691681295_n.webp',
    details: [
      { title: 'LINEN-COTTON WEAVE', desc: 'A rich slub-textured linen and cotton blend offering natural cooling and structural elegance.', iconName: 'Sparkles' },
      { title: 'MOTHER-OF-PEARL BUTTONS', desc: 'Accented with genuine ocean-sourced mother-of-pearl buttons, hand-stitched for a pristine luster.', iconName: 'Award' },
      { title: 'CLASSIC PLACKET', desc: 'Features a reinforced minimalist placket with premium double-cuff closures.', iconName: 'Scissors' }
    ]
  },
  'Formal Shirts': {
    image: '/media-pro/men/Design 14/651337020_122121225477151981_322056965429338679_n.webp',
    details: [
      { title: 'TWO-PLY GIZA COTTON', desc: 'Woven from premium Giza 87 long-staple cotton, offering unmatched silky softness and durability.', iconName: 'Sparkles' },
      { title: 'STIFFENED INTERLINING', desc: 'Fused using high-end German interlining to ensure collars and cuffs retain their sharp structure.', iconName: 'Scissors' },
      { title: 'SINGLE-NEEDLE STITCHING', desc: 'Precision single-needle tailoring for clean, flat side-seams that lay smooth against the skin.', iconName: 'Award' }
    ]
  },
  'Saree': {
    image: '/media-pro/women/Design 1/673191812_122125962327151981_8385571386878315506_n.webp',
    details: [
      { title: 'PURE MULBERRY SILK', desc: 'Loomed from 100% grade-A mulberry silk, renowned for its luminous sheen and feather-light fall.', iconName: 'Sparkles' },
      { title: 'REAL GOLD ZARI', desc: 'Border and pallu hand-woven with fine silver thread plated in genuine 18-karat gold.', iconName: 'Award' },
      { title: 'HERITAGE JAMDANI LOOM', desc: 'Created on traditional wooden pit looms using ancient hand-weaving techniques.', iconName: 'Scissors' }
    ]
  },
  'Luxury Pret': {
    image: '/media-pro/women/Design 2/672121181_122125885095151981_7790861692313383598_n.webp',
    details: [
      { title: 'ORGANZA EMBELLISHMENTS', desc: 'Layers of premium silk organza meticulously hand-embroidered with micro-pearls and sequins.', iconName: 'Award' },
      { title: 'TAILORED SILHOUETTES', desc: 'Specifically cut to offer a modern, flowing drape that balances elegance and everyday comfort.', iconName: 'Scissors' },
      { title: 'PREMIUM BEMBERG LINING', desc: 'Fully lined with breathable Bemberg silk for an ultra-smooth, irritation-free feel.', iconName: 'Sparkles' }
    ]
  }
};

// Styling lookbook builder outfits data
const stylistOutfits: Record<string, {
  image: string;
  accessoryName: string;
  accessoryPrice: number;
  accessoryImage: string;
  tagline: string;
  tip: string;
}> = {
  'Panjabi': {
    image: '/media-pro/men/Design 5/650905571_122120824035151981_4320891712881698677_n.webp',
    accessoryName: 'Royal Silk Aligarhi Pajama & Nagra Set',
    accessoryPrice: 2850,
    accessoryImage: '/media-pro/men/Design 6/650061703_122120930277151981_1200600818769491462_n.webp',
    tagline: 'The Royal Sovereign Ensemble',
    tip: 'Pair this premium Panjabi with silk Aligarhi pajama trousers and hand-crafted leather nagra shoes for an unforgettable heritage posture.'
  },
  'Classic Kurtas': {
    image: '/media-pro/men/Design 11/650770969_122120920443151981_7419337193691681295_n.webp',
    accessoryName: 'Artisanal Linen Trousers',
    accessoryPrice: 2450,
    accessoryImage: '/media-pro/men/Design 12/651225702_122121211317151981_899219807548154935_n.webp',
    tagline: 'Contemporary Linen Ease',
    tip: 'Perfect the modern ethnic posture by styling our classic Kurta with tailored cream linen trousers and minimalist leather sandals.'
  },
  'Formal Shirts': {
    image: '/media-pro/men/Design 14/651337020_122121225477151981_322056965429338679_n.webp',
    accessoryName: 'Premium Tailored Chino Pants',
    accessoryPrice: 3250,
    accessoryImage: '/media-pro/men/Design 12/651225702_122121211317151981_899219807548154935_n.webp',
    tagline: 'The Boardroom Classic',
    tip: 'Tuck this Egyptian cotton shirt into our signature slim-fit beige chinos, accessorized with a dark tan leather belt and monk straps.'
  },
  'Saree': {
    image: '/media-pro/women/Design 1/673191812_122125962327151981_8385571386878315506_n.webp',
    accessoryName: 'Hand-Embellished Silk Blouse Piece',
    accessoryPrice: 3500,
    accessoryImage: '/media-pro/women/Design 2/672121181_122125885095151981_7790861692313383598_n.webp',
    tagline: 'Imperial Grace Silhouette',
    tip: 'Style this silk saree with a contrasting, intricately hand-embroidered raw silk blouse and gold choker to command the evening room.'
  },
  'Luxury Pret': {
    image: '/media-pro/women/Design 2/672121181_122125885095151981_7790861692313383598_n.webp',
    accessoryName: 'Silk Organza Dupatta',
    accessoryPrice: 1950,
    accessoryImage: '/media-pro/women/Design 1/673949386_122125962357151981_1889495426070156223_n.webp',
    tagline: 'Sartorial Pret Perfection',
    tip: 'Complete your modern ready-to-wear silhouette by draping this flowing silk organza dupatta over your shoulders for added depth and motion.'
  }
};

const subSubCategoryData: Record<string, { image: string; tag: string }> = {
  // Men - Panjabi Sub-Subcategories
  'Premium': {
    image: '/media-pro/men/Design 5/650905571_122120824035151981_4320891712881698677_n.webp',
    tag: 'Long-staple polished cotton with delicate detailing.'
  },
  'Royal Heritage': {
    image: '/media-pro/men/Design 1/649824908_122120770023151981_1372810042799937270_n.webp',
    tag: 'Traditional embroidery inspired by royal courts.'
  },
  'Signature': {
    image: '/media-pro/men/Design 6/650061703_122120930277151981_1200600818769491462_n.webp',
    tag: 'Minimalist contemporary cuts for versatile elegance.'
  },
  // Men - Classic Kurtas
  'Basic': {
    image: '/media-pro/men/Design 11/650770969_122120920443151981_7419337193691681295_n.webp',
    tag: 'Effortless solid kurtas in breathable seasonal weaves.'
  },
  'Embroidered': {
    image: '/media-pro/men/Design 11/650770969_122120920443151981_7419337193691681295_n.webp',
    tag: 'Intricate threadwork on premium linen and silk blends.'
  },
  // Men - Formal Shirts
  'Oxford': {
    image: '/media-pro/men/Design 14/651337020_122121225477151981_322056965429338679_n.webp',
    tag: 'Heavyweight weaves with structured button-down collars.'
  },
  'Tuxedo': {
    image: '/media-pro/men/Design 14/651337020_122121225477151981_322056965429338679_n.webp',
    tag: 'Formal double-cuff shirts for your black-tie occasions.'
  },
  'Linen': {
    image: '/media-pro/men/Design 14/651337020_122121225477151981_322056965429338679_n.webp',
    tag: 'Breathable, relaxed-weave linens for refined warm-weather comfort.'
  },
  // Women - Saree Sub-Subcategories
  'Silk': {
    image: '/media-pro/women/Design 1/673191812_122125962327151981_8385571386878315506_n.webp',
    tag: 'Lustrous mulberry silks woven with heritage golden Zari.'
  },
  'Jamdani': {
    image: '/media-pro/women/Design 1/673949386_122125962357151981_1889495426070156223_n.webp',
    tag: 'Feather-light handwoven jamdani motifs of pure elegance.'
  },
  'Chiffon': {
    image: '/media-pro/women/Design 2/672121181_122125885095151981_7790861692313383598_n.webp',
    tag: 'Sheer flowing silhouettes in rich, curated pastel palettes.'
  },
  // Women - Luxury Pret
  'Evening Wear': {
    image: '/media-pro/women/Design 2/672121181_122125885095151981_7790861692313383598_n.webp',
    tag: 'Dazzling hand-embellished wear for your sunset gatherings.'
  },
  'Formal': {
    image: '/media-pro/women/Design 3/670896434_122125960101151981_3029998908890020858_n.webp',
    tag: 'Sleek structural co-ords in high-thread-count premium linen.'
  },
  // Women - Bridal
  'Lehenga': {
    image: '/media-pro/women/Design 3/670896434_122125960101151981_3029998908890020858_n.webp',
    tag: 'Couture lehengas featuring complex handwork and layered tulles.'
  },
  'Sharara': {
    image: '/media-pro/women/Design 1/673949386_122125962357151981_1889495426070156223_n.webp',
    tag: 'Timeless royal shararas adorned with traditional Gota-Patti.'
  }
};

const renderDetailIcon = (name: string) => {
  switch (name) {
    case 'Scissors': return <Scissors className="w-5 h-5 text-amber-500" strokeWidth={1.5} />;
    case 'Sparkles': return <Sparkles className="w-5 h-5 text-amber-500" strokeWidth={1.5} />;
    case 'Award': return <Award className="w-5 h-5 text-amber-500" strokeWidth={1.5} />;
    default: return <Sparkles className="w-5 h-5 text-amber-500" strokeWidth={1.5} />;
  }
};

const PRODUCTS_PER_PAGE = 12;
interface CategoryContentProps {
  category: Category;
  initialProducts: Product[];
  isSubcategoryPage?: boolean;
  activeSubcategory?: string;
  activeSubSubCategory?: string;
  overrideHero?: string;
  overrideTitle?: string;
  overrideDesc?: string;
}
export default function CategoryContent({ 
  category, 
  initialProducts, 
  isSubcategoryPage = false,
  activeSubcategory = 'All',
  activeSubSubCategory = 'All',
  overrideHero,
  overrideTitle,
  overrideDesc
}: CategoryContentProps) {
  const router = useRouter();
  const { filters, sortBy, viewMode, currentPage, setFilter, setActiveSection, setViewMode, clearAllFilters } = useCategoryStore();
  const { itemsCount, addItem } = useCartStore();
  const { openSidebar } = useSidebar();
  const [isSticky, setIsSticky] = useState(false);
  const [lang] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);
  const [addingLook, setAddingLook] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  // ─── Scroll Spy & Sticky Detection ────────────────────────────
  useEffect(() => {
    if (!mounted) return;
    // 2. Scroll Spy for Sub-sections
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          const sectionId = entry.target.getAttribute('data-section');
          if (sectionId) setActiveSection(sectionId);
        }
      });
    }, { threshold: [0.5], rootMargin: '-10% 0px -40% 0px' });
    const sections = document.querySelectorAll('[data-section]');
    sections.forEach(s => sectionObserver.observe(s));
    return () => {
      sectionObserver.disconnect();
    };
  }, [setActiveSection, mounted]);
  // Initial Sync for Subcategory Page or Main Category Page
  useEffect(() => {
    if (mounted) {
      if (isSubcategoryPage && activeSubcategory) {
        setFilter('subcategory', activeSubcategory);
        if (activeSubSubCategory && activeSubSubCategory !== 'All') {
          setFilter('subSubCategory', activeSubSubCategory);
        }
        setActiveSection(activeSubcategory);
      } else if (!isSubcategoryPage) {
        // Force 'All' for main category pages
        setFilter('subcategory', 'All');
        setFilter('subSubCategory', 'All');
        setActiveSection('All');
      }
    }
  }, [isSubcategoryPage, activeSubcategory, activeSubSubCategory, setFilter, setActiveSection, mounted]);
  // ... (Filter Logic)
  // ─── Filter Logic ─────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    // During hydration, the store might still be 'All', so we use activeSubcategory prop as a fallback
    const effectiveSubcategory = (mounted ? filters.subcategory : activeSubcategory) || 'All';
    const effectiveSubSubCategory = (mounted ? filters.subSubCategory : activeSubSubCategory) || 'All';
    return initialProducts.filter((p) => {
      // Subcategory check
      if (effectiveSubcategory !== 'All' && p.subcategory !== effectiveSubcategory) return false;
      // Sub-Subcategory check (if applicable, mapping to occasion or another field if not present)
      // For now, let's assume we filter by occasion if subSubCategory is set
      if (effectiveSubSubCategory !== 'All' && p.occasion !== effectiveSubSubCategory && (p as any).badge !== effectiveSubSubCategory) {
        // Fallback: search in name/desc if it matches
        const matches = p.name.includes(effectiveSubSubCategory) || p.subcategory === effectiveSubSubCategory;
        if (!matches) return false;
      }
      // Advanced Filters
      if (filters.size.length > 0 && !filters.size.some((s) => p.sizes?.includes(s))) return false;
      if (filters.color.length > 0 && !filters.color.some((c) => p.colors?.some((pc) => pc.name === c))) return false;
      if (filters.fabric.length > 0 && !filters.fabric.includes(p.fabric ?? '')) return false;
      if (filters.fit.length > 0 && !filters.fit.includes(p.fit ?? '')) return false;
      if (filters.occasion.length > 0 && !filters.occasion.includes(p.occasion ?? '')) return false;
      if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;
      if (filters.rating > 0 && p.rating < filters.rating) return false;
      return true;
    });
  }, [initialProducts, filters, activeSubcategory, mounted]);
  const [isMobile, setIsMobile] = useState(false);
  // ─── Responsive Detection ──────────────────────────────────────
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  // ─── Best Sellers (Exactly 2 Rows) ─────────────────────────────
  const bestSellersCount = isMobile ? 4 : 10;
  const bestSellers = useMemo(() => {
    return filteredProducts.slice(0, bestSellersCount);
  }, [filteredProducts, bestSellersCount]);
  const remainingProducts = useMemo(() => {
    if (filters.subcategory !== 'All') return filteredProducts;
    return filteredProducts.slice(bestSellersCount);
  }, [filteredProducts, filters.subcategory, bestSellersCount]);

  const discountedProducts = useMemo(() => {
    const discounted = filteredProducts.filter(p => p.originalPrice && p.originalPrice > p.price);
    return discounted.length >= 4 ? discounted : filteredProducts.slice(bestSellersCount, bestSellersCount * 2);
  }, [filteredProducts, bestSellersCount]);

  const [showAllDiscount, setShowAllDiscount] = useState(false);
  const discountProductsToDisplay = showAllDiscount ? discountedProducts : discountedProducts.slice(0, bestSellersCount);
  // ─── Sort & Pagination ────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  // ─── Search Logic ─────────────────────────────────────────────
  const suggestions = useMemo(() => {
    if (!searchQuery) return [];
    return category.searchKeywords.filter(k => 
      k.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);
  }, [searchQuery, category.searchKeywords]);
  const searchedProducts = useMemo(() => {
    if (!searchQuery) return filteredProducts;
    return filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [filteredProducts, searchQuery]);
  // Update sortedProducts to use searchedProducts
  const finalProducts = useMemo(() => {
    const sorted = [...searchedProducts];
    switch (sortBy) {
      case 'price_asc': return sorted.sort((a, b) => a.price - b.price);
      case 'price_desc': return sorted.sort((a, b) => b.price - a.price);
      case 'rating_desc': return sorted.sort((a, b) => b.rating - a.rating);
      case 'newest':
      default: return sorted; // Assuming products are already in some order
    }
  }, [searchedProducts, sortBy]);
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    // Dynamic initialization for exactly 2-row (line) grid display: 4 items for mobile (2x2), 8 items for desktop (4x2)
    if (mounted) {
      setVisibleCount(isMobile ? 4 : 8);
    }
  }, [isMobile, mounted]);

  const displayProducts = finalProducts.slice(0, visibleCount);
  
  const handleLoadMore = () => {
    const increment = isMobile ? 4 : 8;
    setVisibleCount(prev => prev + increment);
    trackEvent('select_item', {
      action: 'load_more',
      category: category.name,
      new_count: visibleCount + increment
    });
  };
  // ─── Analytics: View Item List ────────────────────────────────
  useEffect(() => {
    if (mounted) {
      trackEvent('view_item_list', {
        item_list_id: category.slug,
        item_list_name: category.name,
        items: displayProducts.map(p => ({ item_id: p.id, item_name: p.name }))
      });
    }
  }, [category.slug, category.name, displayProducts, mounted]);
  // ... (Keep existing layout but update product grid calls)
  // ─── Expandable Sections State ────────────────────────────────
  const [showAllBestSellers, setShowAllBestSellers] = useState(false);
  const [showAllTopChoices, setShowAllTopChoices] = useState(false);
  const bestSellersToDisplay = useMemo(() => {
    return showAllBestSellers ? filteredProducts.slice(0, 24) : bestSellers;
  }, [showAllBestSellers, filteredProducts, bestSellers]);
  const topChoicesToDisplay = useMemo(() => {
    return showAllTopChoices ? remainingProducts.slice(0, 24) : remainingProducts.slice(0, bestSellersCount);
  }, [showAllTopChoices, remainingProducts, bestSellersCount]);
  // ─── Dynamic Context Mapping ───────────────────────────────
  const subHeroMap: Record<string, { hero: string; desc: string }> = {
    'Panjabi': {
      hero: '/media-pro/men/Design 5/650905571_122120824035151981_4320891712881698677_n.webp',
      desc: 'Heritage craftsmanship meets modern luxury. Our signature Panjabi collection is tailored for the discerning individual.'
    },
    'Classic Kurtas': {
      hero: '/media-pro/men/Design 11/650770969_122120920443151981_7419337193691681295_n.webp',
      desc: 'Refined simplicity and artisanal details. The Azlaan Kurta collection redefines contemporary ethnic wear for the modern man.'
    },
    'Formal Shirts': {
      hero: '/media-pro/men/Design 14/651337020_122121225477151981_322056965429338679_n.webp',
      desc: 'Elevate your daily ensemble with our precision-fit shirts, crafted from the worlds finest long-staple cotton.'
    },
    'Chino Pants': {
      hero: '/media-pro/men/Design 12/651225702_122121211317151981_899219807548154935_n.webp',
      desc: 'Modern tailoring for the urban landscape. Our chinos offer the perfect balance of comfort and sophistication.'
    },
    'Casual Edit': {
      hero: '/media-pro/men/Design 6/650061703_122120930277151981_1200600818769491462_n.webp',
      desc: 'Effortless style for every day. Discover our range of premium casual wear designed for versatile living.'
    },
    'Saree': {
      hero: '/media-pro/women/Design 1/673191812_122125962327151981_8385571386878315506_n.webp',
      desc: 'The epitome of grace. Our handcrafted silk sarees celebrate centuries of artisanal heritage.'
    },
    'Luxury Pret': {
      hero: '/media-pro/women/Design 2/672121181_122125885095151981_7790861692313383598_n.webp',
      desc: 'Sophisticated ready-to-wear for the modern woman. Elegance redefined for every occasion.'
    },
    'Unstitched': {
      hero: '/media-pro/women/Design 1/673949386_122125962357151981_1889495426070156223_n.webp',
      desc: 'Canvas for your creativity. Premium unstitched fabrics with intricate embroideries.'
    },
    'Bridal': {
      hero: '/media-pro/women/Design 3/670896434_122125960101151981_3029998908890020858_n.webp',
      desc: 'Couture for your special day. Exquisite bridal ensembles crafted with timeless artistry.'
    }
  };
  const currentSub = mounted ? filters.subcategory : activeSubcategory;
  const isSubActive = currentSub && currentSub !== 'All';
  const displayTitle = isSubActive 
    ? `${category.name} ${currentSub}` 
    : (overrideTitle || (lang === 'bn' ? category.nameBn : category.name));
  const displayDesc = isSubActive
    ? (subHeroMap[currentSub as string]?.desc || `Explore our exclusive ${currentSub} collection.`)
    : (overrideDesc || (lang === 'bn' ? category.descriptionBn : category.description));
  const displayHero = (isSubActive
    ? (subHeroMap[currentSub as string]?.hero || overrideHero || category.heroImage)
    : (overrideHero || category.heroImage)) || '/media-pro/men/Design 1/649824908_122120770023151981_1372810042799937270_n.webp';


  return (
    <main className="min-h-screen bg-white">
        <section className="relative h-[65vh] md:h-[85vh] w-full overflow-hidden bg-black">
          <motion.div 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={displayHero}
              alt={displayTitle}
              fill
              priority
              quality={100}
              className="object-cover"
              sizes="100vw"
            />
          </motion.div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          
          {/* Editorial Vertical Label (Desktop) */}
          <div className="hidden md:block absolute left-8 top-1/2 -translate-y-1/2 -rotate-90 origin-left">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 0.2, x: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="text-[10px] font-black uppercase tracking-[0.5em] text-white whitespace-nowrap"
            >
              ESTABLISHED 2024 • AZLAAN LUXURY
            </motion.span>
          </div>

          <div className="absolute bottom-16 left-6 md:left-24 right-6">
            <motion.nav 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-3 text-white/40 text-[9px] md:text-[10px] font-black uppercase tracking-[0.25em] mb-8"
            >
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <Link href={`/${category.slug}`} className="hover:text-white transition-colors">
                {lang === 'bn' ? category.nameBn : category.name}
              </Link>
              {isSubActive && (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <span className="text-white">{currentSub}</span>
                </>
              )}
            </motion.nav>

            <div className="max-w-5xl">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-white text-6xl md:text-[12rem] font-sans font-black tracking-tighter leading-[0.8] mb-8 uppercase"
              >
                {displayTitle.split(' ')[0]}
                {displayTitle.split(' ').length > 1 && (
                  <span className="block text-[0.45em] font-serif italic font-light tracking-normal opacity-80 mt-[-4px] md:mt-[-28px] lowercase">
                    {displayTitle.split(' ').slice(1).join(' ')}
                  </span>
                )}
              </motion.h1>
              
              <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-16">
                <div className="flex flex-col gap-2 max-w-md">
                  {isSubcategoryPage && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                      className="text-[9px] font-black tracking-[0.35em] text-amber-400 uppercase font-sans mb-1 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      Atelier Notes • Craftsmanship No. 08
                    </motion.span>
                  )}
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="text-white text-xs md:text-sm leading-relaxed tracking-wide font-medium uppercase italic"
                  >
                    {displayDesc}
                  </motion.p>
                </div>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1, duration: 1.5 }}
                  className="hidden md:block flex-1 h-[0.5px] bg-white/20 mb-2" 
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 }}
                  className="hidden md:flex items-center gap-4 text-white/40"
                >
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black uppercase tracking-widest">Scroll</span>
                    <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent mt-2" />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      {/* ── Unified Sticky Header (Filter Bar is the Header) ── */}
      <div className="sticky top-[56px] md:top-[68px] z-50 bg-white/95 backdrop-blur-md border-b border-black/[0.03] shadow-sm py-1 md:py-2">
        <div className="w-full flex items-center justify-between px-2 md:px-8 gap-2 md:gap-4">
          {/* Left: The Text Bar (FilterBar) */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <FilterBar 
              category={category} 
              variant="compact" 
              items={category.subcategories}
              activeItem={filters.subcategory}
              onItemSelect={(item) => {
                const toSlug = (s: string) => s.toLowerCase().replace(/ /g, '-');
                if (item === 'All') {
                  router.push(`/${category.slug}`);
                  setFilter('subcategory', 'All');
                  setFilter('subSubCategory', 'All');
                } else {
                  router.push(`/${category.slug}/${toSlug(item)}`);
                  setFilter('subcategory', item);
                  setFilter('subSubCategory', 'All');
                }
              }}
            />
          </div>

          {/* Right: Sort & Filter Icons */}
          <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
            <MobileFilterDrawer category={category} />
          </div>
        </div>
        {/* Bottom row for active chips (if any) */}
        <div className="px-4 md:px-8 bg-white/50">
          <ActiveFilterChips />
        </div>
      </div>
      {/* ========================================== */}
      {/* ── SUBCATEGORY PAGE LAYOUT (`isSubcategoryPage === true`) ── */}
      {/* ========================================== */}
      {isSubcategoryPage && filters.subSubCategory === 'All' && !searchQuery && (
        <div className="space-y-16 md:space-y-24 py-8 md:py-12 pb-16">
          
          {/* 1. New Collection */}
          {bestSellers.length > 0 && (
            <section className="max-w-[1600px] mx-auto px-4 md:px-6">
              <div className="flex flex-col items-center text-center mb-8 md:mb-12">
                <h2 className="flex flex-col items-center justify-center leading-[0.85] md:leading-[0.8]">
                  <span className="font-serif italic text-2xl md:text-3xl text-gray-400 font-light tracking-wider pr-8 md:pr-12 -mb-1 md:-mb-2 z-10">
                    New
                  </span>
                  <span className="font-sans text-4xl md:text-5xl font-bold tracking-tighter text-black uppercase drop-shadow-sm">
                    Collection
                  </span>
                </h2>
                <div className="flex items-center justify-center gap-3 md:gap-4 mt-4 md:mt-6">
                  <div className="h-[1px] w-4 md:w-8 bg-black/20" />
                  <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-gray-500">
                    Fresh Arrivals
                  </span>
                  <div className="h-[1px] w-4 md:w-8 bg-black/20" />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-x-4 gap-y-12">
                {bestSellersToDisplay.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode="grid" />
                ))}
              </div>
            </section>
          )}

          {/* 2. Discount Collection */}
          {discountedProducts.length > 0 && (
            <section className="max-w-[1600px] mx-auto px-4 md:px-6">
              <div className="mb-8 md:mb-12 last:mb-0 bg-[#faf9f6]/70 rounded-[2rem] overflow-hidden border border-black/[0.03] border-b-[3px] border-b-amber-400/30 shadow-[0_8px_30px_rgb(0,0,0,0.02)] backdrop-blur-sm flex flex-col">
                
                {/* Top Column: Elegant Header Banner */}
                <div className="relative w-full h-[180px] md:h-[240px] flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={category.heroImage || '/media-pro/cover/cover 3.jpg'}
                      alt="Discount Offers"
                      fill
                      className="object-cover transition-transform duration-[10000ms] ease-out scale-100 hover:scale-105"
                      sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-black/50 z-10" />
                  </div>

                  <div className="relative z-20 flex flex-col items-center justify-center text-center px-4">
                    <div className="flex items-center gap-2 mb-2 md:mb-3">
                      <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-amber-400" />
                      <span className="text-[9px] md:text-[11px] font-black text-amber-400 uppercase tracking-[0.4em]">
                        Special Offers
                      </span>
                    </div>
                    
                    <div className="flex items-baseline justify-center gap-3 md:gap-4 drop-shadow-lg">
                      <h3 className="text-4xl md:text-5xl lg:text-6xl font-sans font-black text-white tracking-tighter uppercase leading-none">
                        UPTO
                      </h3>
                      <span className="font-serif italic font-bold tracking-tight text-amber-400 text-5xl md:text-6xl lg:text-7xl leading-none">
                        30%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Column: Dynamic Grid (2 Lines) */}
                <div className="w-full p-4 md:p-6 lg:p-8 pt-6 md:pt-8">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
                    {discountProductsToDisplay.map((product) => (
                      <ProductCard key={product.id} product={product} viewMode="grid" />
                    ))}
                  </div>

                  {discountedProducts.length > bestSellersCount && (
                    <div className="flex justify-center mt-8 md:mt-10">
                      <button
                        onClick={() => setShowAllDiscount(!showAllDiscount)}
                        className="group flex items-center gap-2.5 px-6 py-2.5 border border-black/10 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-300 shadow-sm bg-white"
                      >
                        <span>{showAllDiscount ? 'Show Less' : 'View All Offers'}</span>
                        <ArrowRight className={`w-3.5 h-3.5 transition-transform duration-300 ${showAllDiscount ? '-rotate-90' : 'group-hover:translate-x-1'}`} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* 3. Sub-Subcategory Panels */}
          {category.subSubCategories?.[currentSub as string] && (
            <div className="space-y-16 md:space-y-24">
              {category.subSubCategories[currentSub as string].filter(subSub => subSub !== 'All').map((subSub) => {
                const subSubProducts = initialProducts.filter(p => p.subSubCategory === subSub || p.subcategory === subSub);
                const displaySubSub = subSubProducts.length > 0 ? subSubProducts.slice(0, bestSellersCount) : initialProducts.slice(0, bestSellersCount);
                
                return (
                  <section key={subSub} className="max-w-[1600px] mx-auto px-4 md:px-6">
                    <div className="flex flex-col items-center text-center mb-8 md:mb-12">
                      <h2 className="flex flex-col items-center justify-center leading-[0.85] md:leading-[0.8]">
                        <span className="font-serif italic text-2xl md:text-3xl text-gray-400 font-light tracking-wider pr-8 md:pr-12 -mb-1 md:-mb-2 z-10">
                          {subSub}
                        </span>
                        <span className="font-sans text-4xl md:text-5xl font-bold tracking-tighter text-black uppercase drop-shadow-sm">
                          Collection
                        </span>
                      </h2>
                      <div className="flex items-center justify-center gap-3 md:gap-4 mt-4 md:mt-6">
                        <div className="h-[1px] w-4 md:w-8 bg-black/20" />
                        <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-gray-500">
                          Curated Variation
                        </span>
                        <div className="h-[1px] w-4 md:w-8 bg-black/20" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-x-4 gap-y-12">
                      {displaySubSub.map((product) => (
                        <ProductCard key={product.id} product={product} viewMode="grid" />
                      ))}
                    </div>
                    <div className="flex justify-center mt-10">
                      <button
                        onClick={() => {
                          setFilter('subSubCategory', subSub);
                          document.getElementById('main-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        className="group flex items-center gap-3 px-8 py-3 border border-black/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-500"
                      >
                        <span>Explore {subSub}</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-500 group-hover:translate-x-1" />
                      </button>
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* ── MAIN CATEGORY PAGE LAYOUT (`!isSubcategoryPage`) ── */}
      {/* ========================================== */}
      {!isSubcategoryPage && filters.subcategory === 'All' && !searchQuery && (
        <>
          {/* ── Best Sellers Panel ─────────────────── */}
          {bestSellers.length > 0 && (
            <section className="max-w-[1600px] mx-auto px-4 md:px-6 mt-[15px]">
              <div className="py-[5px] flex items-baseline gap-2.5 border-b border-black/[0.03]">
                <h3 className="text-xl md:text-3xl font-sans font-black text-black leading-none tracking-tight">
                  Best Selling {displayTitle}
                </h3>
                <span className="text-[10px] md:text-[11px] font-sans font-black uppercase tracking-[0.2em] text-gray-400 leading-none">
                  Featured Selection
                </span>
              </div>
              <div className="pt-[4px] pb-6 grid grid-cols-2 md:grid-cols-5 gap-x-4 gap-y-8">
                {bestSellersToDisplay.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode="grid" />
                ))}
              </div>

              {filteredProducts.length > bestSellersCount && (
                <div className="flex justify-center pb-8 md:pb-12">
                  <button
                    onClick={() => setShowAllBestSellers(!showAllBestSellers)}
                    className="group flex items-center gap-3 px-8 py-3 border border-black/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-500"
                  >
                    <span>{showAllBestSellers ? 'Show Less' : 'See More'}</span>
                    <ArrowRight className={`w-3.5 h-3.5 transition-transform duration-500 ${showAllBestSellers ? '-rotate-90' : 'group-hover:translate-x-1'}`} />
                  </button>
                </div>
              )}
            </section>
          )}

          {/* ── Promotional Discount Banner ── */}
          <div className="my-4 md:my-8">
            <PromoBanner />
          </div>


      {/* ── Individual Subcategory Sections (Carousel Model) ── */}
      {filters.subcategory === 'All' && !searchQuery && (
        <section className="bg-white py-4 md:py-8 overflow-hidden">
          {category.subcategories.filter(s => s !== 'All').map((sub) => {
            const subProducts = initialProducts.filter(p => p.subcategory === sub);
            const productsToDisplay = subProducts.slice(0, 6);
            if (productsToDisplay.length === 0) return null;
            return (
              <div 
                key={sub} 
                id={sub} 
                data-section={sub} 
                className="mb-8 md:mb-12 last:mb-0 scroll-mt-24 bg-[#faf9f6]/70 rounded-[2rem] overflow-hidden border border-black/[0.03] border-b-[3px] border-b-amber-400/30 shadow-[0_8px_30px_rgb(0,0,0,0.02)] backdrop-blur-sm p-0 flex flex-col lg:flex-row lg:items-stretch"
              >
                {/* Left Column: Super Advanced Dynamic Edge-to-Edge Banner */}
                {(() => {
                  const subData = subHeroMap[sub] || {
                    hero: category.heroImage || '/media-pro/cover/cover 3.jpg',
                    desc: `Explore the dynamic ${sub} capsule collection.`
                  };
                  return (
                    <div 
                      onClick={() => {
                        const toSlug = (s: string) => s.toLowerCase().replace(/ /g, '-');
                        router.push(`/${category.slug}/${toSlug(sub)}`);
                        setFilter('subcategory', sub);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="group relative w-full lg:w-[38%] min-h-[320px] lg:min-h-full aspect-[4/3] lg:aspect-auto overflow-hidden cursor-pointer flex items-end"
                    >
                      {/* Background Image Container */}
                      <div className="absolute inset-0 z-0">
                        <Image
                          src={subData.hero}
                          alt={sub}
                          fill
                          className="object-cover transition-transform duration-[6000ms] ease-out scale-100 group-hover:scale-103"
                          sizes="(max-width: 1024px) 100vw, 40vw"
                        />
                        {/* Rich Cinematic Double Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent z-10" />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500 z-10" />
                      </div>

                      {/* Banner Content Panel */}
                      <div className="relative z-20 w-full p-8 md:p-12 flex flex-col justify-end h-full gap-4 md:gap-6">
                        <div className="space-y-2 md:space-y-4">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            <span className="text-[9px] md:text-[10px] font-black text-amber-400 uppercase tracking-[0.4em]">
                              Signature Capsule
                            </span>
                          </div>
                          <h3 className="text-3xl md:text-5xl font-sans font-black text-white tracking-tighter uppercase leading-none">
                            {sub}
                            <span className="font-serif italic font-light lowercase tracking-normal text-white/80 block mt-1">
                              Series
                            </span>
                          </h3>
                          <div className="w-12 h-[1px] bg-white/20 my-2" />
                          <p className="text-white/60 text-xs md:text-sm font-light leading-relaxed max-w-sm italic tracking-wide">
                            {subData.desc}
                          </p>
                        </div>

                        {/* Interactive Explore Pill */}
                        <div className="mt-2">
                          <span className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white text-black font-extrabold text-[9px] md:text-[10px] uppercase tracking-[0.25em] group-hover:bg-amber-400 transition-all duration-500 shadow-md group-active:scale-95">
                            <span>Explore All</span>
                            <ArrowRight className="w-3.5 h-3.5 text-black group-hover:translate-x-1.5 transition-transform duration-500" strokeWidth={2.5} />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Right Column: Dynamic Grid & Pagination */}
                <div className="w-full lg:w-[62%] p-6 md:p-10 flex flex-col justify-between gap-6 md:gap-8">
                  {/* Modern Dynamic Grid - Exactly 2 Rows/Lines */}
                  <div className="grid grid-cols-2 gap-4 md:gap-6 flex-1">
                    {productsToDisplay.slice(0, 4).map((product) => (
                      <ProductCard key={product.id} product={product} viewMode="grid" />
                    ))}
                  </div>

                  {/* Modern "View More" Button */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => {
                        const toSlug = (s: string) => s.toLowerCase().replace(/ /g, '-');
                        router.push(`/${category.slug}/${toSlug(sub)}`);
                        setFilter('subcategory', sub);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="group flex items-center gap-2.5 px-6 py-2.5 border border-black/10 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-300 shadow-sm bg-white"
                    >
                      <span>View More {sub}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      )}
        </>
      )}

      {/* ── Personalized Intelligence ── */}
      {filters.subcategory === 'All' && !searchQuery && (
        <PersonalizedRecs products={initialProducts} categoryName={category.name} />
      )}
      {/* ── Main Product Panel (Search / Filter Results) ── */}
      <section id="main-products" className="max-w-[1600px] mx-auto px-4 md:px-6 py-4 md:py-8 border-t border-black/[0.03]">
        <div className="flex flex-col items-center text-center mb-8 md:mb-12">
          {(() => {
            let topText = "Top Choice";
            let bottomText = "All Product";
            
            if (searchQuery) {
              topText = "Search";
              bottomText = "Results";
            } else if (filters.subcategory !== 'All') {
              topText = filters.subcategory;
              bottomText = "Collection";
            }
            
            return (
              <h2 className="flex flex-col items-center justify-center leading-[0.85] md:leading-[0.8]">
                <span className="font-serif italic text-2xl md:text-3xl text-gray-400 font-light tracking-wider pr-8 md:pr-12 -mb-1 md:-mb-2 z-10">
                  {topText}
                </span>
                <span className="font-sans text-4xl md:text-5xl font-bold tracking-tighter text-black uppercase drop-shadow-sm">
                  {bottomText}
                </span>
              </h2>
            );
          })()}
          <div className="flex items-center justify-center gap-3 md:gap-4 mt-4 md:mt-6">
            <div className="h-[1px] w-4 md:w-8 bg-black/20" />
            <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-gray-500">
              {searchQuery ? `FOUND FOR "${searchQuery}"` : "EXCLUSIVE CATALOGUE"}
            </span>
            <div className="h-[1px] w-4 md:w-8 bg-black/20" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-4 gap-y-12">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} viewMode={viewMode} />
          ))}
        </div>
        {finalProducts.length > visibleCount && (
          <div className="flex justify-center mt-12">
            <button
              onClick={handleLoadMore}
              className="group flex items-center gap-3 px-8 py-3 border border-black/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-500"
            >
              <span>Load More</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-500 group-hover:translate-x-1" />
            </button>
          </div>
        )}
        {finalProducts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400">No products found matching your criteria.</p>
            <button 
              onClick={clearAllFilters}
              className="mt-4 text-[10px] font-black underline underline-offset-4 uppercase tracking-widest text-primary"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>
      <TrustBadges />
    </main>
  );
}
