'use client';

import { useMemo, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ArrowRight, ShoppingBag, ArrowDownUp, SlidersHorizontal, LayoutGrid, List as ListIcon, User, Menu } from 'lucide-react';
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
import Footer from '@/components/Footer';

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
  const { filters, sortBy, viewMode, currentPage, setFilter, setActiveSection, setViewMode, clearAllFilters } = useCategoryStore();
  const { itemsCount } = useCartStore();
  const { openSidebar } = useSidebar();
  const [isSticky, setIsSticky] = useState(false);
  const [lang] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

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
  const bestSellersCount = isMobile ? 4 : 8;

  const bestSellers = useMemo(() => {
    return filteredProducts.slice(0, bestSellersCount);
  }, [filteredProducts, bestSellersCount]);

  const remainingProducts = useMemo(() => {
    if (filters.subcategory !== 'All') return filteredProducts;
    return filteredProducts.slice(bestSellersCount);
  }, [filteredProducts, filters.subcategory, bestSellersCount]);

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

  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);
  const displayProducts = finalProducts.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + PRODUCTS_PER_PAGE);
    trackEvent('select_item', {
      action: 'load_more',
      category: category.name,
      new_count: visibleCount + PRODUCTS_PER_PAGE
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
      {/* ── Immersive Dynamic Hero (Luxury Editorial Style) ── */}
      <section className="relative h-[55vh] md:h-[75vh] w-full overflow-hidden bg-black">
        <Image
          src={displayHero}
          alt={displayTitle}
          fill
          priority
          unoptimized
          className="object-cover opacity-60 scale-105 transition-transform duration-[10000ms] hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        
        {/* Editorial Vertical Label (Desktop) */}
        <div className="hidden md:block absolute left-8 top-1/2 -translate-y-1/2 -rotate-90 origin-left">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 whitespace-nowrap">
            ESTABLISHED 2024 • AZLAAN LUXURY
          </span>
        </div>

        <div className="absolute bottom-12 left-6 md:left-24 right-6">
          <nav className="flex items-center gap-3 text-white/40 text-[9px] md:text-[10px] font-black uppercase tracking-[0.25em] mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <Link href={`/${category.slug}`} className="hover:text-white transition-colors">
              {lang === 'bn' ? category.nameBn : category.name}
            </Link>
            {isSubActive && (
              <>
                <div className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-white">{currentSub}</span>
              </>
            )}
          </nav>

          <div className="max-w-4xl">
            <h1 className="text-white text-5xl md:text-[10rem] font-sans font-black tracking-tighter leading-[0.85] mb-6 uppercase">
              {displayTitle.split(' ')[0]}
              {displayTitle.split(' ').length > 1 && (
                <span className="block text-[0.5em] font-serif italic font-light tracking-normal opacity-80 mt-[-6px] md:mt-[-22px] lowercase">
                  {displayTitle.split(' ').slice(1).join(' ')}
                </span>
              )}
            </h1>
            <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-12">
              <p className="text-white/60 text-xs md:text-sm max-w-sm leading-relaxed tracking-wide font-medium uppercase italic">
                {displayDesc}
              </p>
              <div className="hidden md:block flex-1 h-[1px] bg-white/10 mb-2" />
            </div>
          </div>
        </div>
      </section>


      {/* ── Unified Sticky Header (Filter Bar is the Header) ── */}
      <div className="sticky top-[56px] md:top-[68px] z-40 bg-white/95 backdrop-blur-md border-b border-black/[0.03] shadow-sm">
        <div className="w-full flex items-center justify-between px-4 md:px-8">
          {/* Left: Sort & Filter Icons */}
          <div className="flex items-center gap-2">
            <SortSelect />
            <div className="w-px h-4 bg-black/10 mx-1" />
            <MobileFilterDrawer category={category} />
          </div>

          {/* Center: The Text Bar (FilterBar) */}
          <div className="flex-1 max-w-4xl mx-auto overflow-hidden">
            <FilterBar 
              category={category} 
              variant="compact" 
              items={isSubActive && category.subSubCategories?.[currentSub as string] ? category.subSubCategories[currentSub as string] : category.subcategories}
              activeItem={isSubActive ? filters.subSubCategory : filters.subcategory}
              onItemSelect={(item) => isSubActive ? setFilter('subSubCategory', item) : setFilter('subcategory', item)}
            />
          </div>

          {/* Right: Item Count */}
          <div className="hidden md:flex items-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-black/40">
              {finalProducts.length} Items
            </p>
          </div>
        </div>

        {/* Bottom row for active chips (if any) */}
        <div className="px-4 md:px-8 bg-white/50">
          <ActiveFilterChips />
        </div>
      </div>

      {/* ── Best Sellers Panel (Modern Sans Header) ─────────────────── */}
      {filters.subcategory === 'All' && bestSellers.length > 0 && !searchQuery && (
        <section className="max-w-[1600px] mx-auto px-4 md:px-6 mt-[15px]">
          <div className="py-[5px] flex items-baseline gap-2.5 border-b border-black/[0.03]">
            <h3 className="text-xl md:text-3xl font-sans font-black text-black leading-none tracking-tight">
              Best Selling {displayTitle}
            </h3>
            <span className="text-[10px] md:text-[11px] font-sans font-black uppercase tracking-[0.2em] text-gray-400 leading-none">
              Featured Selection
            </span>
          </div>
          
          <div className="pt-[4px] pb-6 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
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

      {/* ── Individual Subcategory Sections (Carousel Model) ── */}
      {filters.subcategory === 'All' && !searchQuery && (
        <section className="bg-white py-4 md:py-8 overflow-hidden">
          {category.subcategories.filter(s => s !== 'All').map((sub) => {
            const subProducts = initialProducts.filter(p => p.subcategory === sub);
            const productsToDisplay = subProducts.slice(0, 6);

            if (productsToDisplay.length === 0) return null;

            return (
              <div key={sub} id={sub} data-section={sub} className="mb-4 md:mb-8 last:mb-0 scroll-mt-24">
                {/* Section Header (Image-Inspired Style) */}
                <div className="max-w-[1600px] mx-auto px-4 md:px-6 flex items-center justify-between mb-4 md:mb-6">
                  <h3 className="text-xl md:text-2xl font-sans font-black text-black tracking-tight">
                    {sub} Collection
                  </h3>
                  
                  <button 
                    onClick={() => {
                      setFilter('subcategory', sub);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group flex items-center gap-2 bg-gray-50/50 border border-gray-200 px-4 py-1.5 md:px-6 md:py-2.5 rounded-full text-[9px] md:text-[10px] font-bold text-black uppercase tracking-widest transition-all hover:bg-gray-100 active:scale-95"
                  >
                    <span>ALL COLLECTION</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                  </button>
                </div>

                {/* Horizontal Product Carousel */}
                <div className="max-w-full overflow-x-auto no-scrollbar px-4 md:px-6">
                  <div className="flex gap-4 md:gap-8 pb-4 min-w-max">
                    {productsToDisplay.map((product) => (
                      <div key={product.id} className="w-[180px] md:w-[300px]">
                        <ProductCard product={product} viewMode="grid" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* ── Main Product Panel (Search / Filter Results) ── */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-6 py-8 md:py-16 border-t border-black/[0.03]">
        <div className="mb-6 md:mb-10 flex flex-col items-center text-center">
          <h2 className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] mb-2 text-black/20">Curated For You</h2>
          <h3 className="text-xl md:text-3xl font-sans font-black uppercase tracking-tighter mb-4">
            {searchQuery ? `Results for "${searchQuery}"` : filters.subcategory !== 'All' ? `${filters.subcategory} Collection` : 'Top Choice All Product'}
          </h3>
          <div className="w-12 h-1 bg-black rounded-full" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12">
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
