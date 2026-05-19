'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useCategoryStore } from '@/store/categoryStore';
import { Category } from '@/types';
import { useRouter } from 'next/navigation';
interface MobileFilterDrawerProps {
  category: Category;
}
const SORT_OPTIONS = [
  { label: 'Newest', labelBn: 'নতুন', value: 'newest' },
  { label: 'Price: Low → High', labelBn: 'দাম: কম থেকে বেশি', value: 'price_asc' },
  { label: 'Price: High → Low', labelBn: 'দাম: বেশি থেকে কম', value: 'price_desc' },
  { label: 'Top Rated', labelBn: 'সর্বোচ্চ রেটিং', value: 'rating_desc' },
];

export default function MobileFilterDrawer({ category }: MobileFilterDrawerProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { filters, setFilter, sortBy, setSortBy, clearAllFilters } = useCategoryStore();
  const { filters: categoryFilters, subcategories } = category;

  useEffect(() => {
    setMounted(true);
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  const toggleListFilter = (key: 'size' | 'color' | 'fabric' | 'fit' | 'occasion' | 'silhouette', value: string) => {
    const list = (filters[key] as string[]) || [];
    const newList = list.includes(value)
      ? list.filter((s: string) => s !== value)
      : [...list, value];
    setFilter(key, newList);
  };

  const activeFilterCount = [
    filters.subcategory !== 'All' ? 1 : 0,
    filters.size.length,
    filters.color.length,
    filters.fabric.length,
    filters.fit.length,
    filters.occasion.length,
    (filters.silhouette as string[] || []).length,
    filters.rating > 0 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <>
      {/* Trigger Button - Circle Removed, Just Clean Text & Icon */}
      <button
        onClick={() => setIsOpen(true)}
        className="group flex items-center gap-2 h-9 px-3 hover:bg-black/[0.03] transition-all relative shrink-0 rounded-lg active:scale-95"
        aria-label="Open Filters and Sort"
      >
        <SlidersHorizontal className="w-4 h-4 text-black/75 group-hover:text-black transition-colors" strokeWidth={1.4} />
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-black/75 group-hover:text-black transition-colors">
          Filter
        </span>
        {activeFilterCount > 0 && (
          <span className="bg-black text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-white shadow-sm">
            {activeFilterCount}
          </span>
        )}
      </button>

      {mounted && createPortal(
        <div className="z-[999] relative">
          {/* Overlay */}
          <div
            className={`fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm transition-opacity duration-300 ${
              isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setIsOpen(false)}
          />
          {/* Drawer (Right Sidebar) */}
          <div
            className={`fixed top-0 right-0 bottom-0 z-[101] w-[82vw] max-w-[360px] bg-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-2xl flex flex-col
              ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
          >
            {/* Drawer Header - Compact */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-black/5 bg-white z-10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-black/90">Filter & Sort</h3>
              <div className="flex items-center gap-3">
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-[8px] uppercase tracking-widest font-black text-black/40 hover:text-black transition-colors"
                  >
                    Clear All
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="hover:opacity-70 transition-opacity">
                  <X className="w-4.5 h-4.5 text-black" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Drawer Body - Zero Scroll Ultra Compact Layout */}
            <div className="flex-1 px-4 py-4 space-y-4 scrollbar-none overflow-hidden">
              {/* Sort By - Compact 2x2 Grid */}
              <div className="space-y-1.5">
                <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-black/95">Sort By</h4>
                <div className="grid grid-cols-2 gap-1.5">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSortBy(opt.value as any)}
                      className={`text-center py-1.5 px-2 rounded-lg text-[9px] font-bold uppercase tracking-widest border transition-all flex items-center justify-center gap-1
                        ${sortBy === opt.value ? 'bg-black text-white border-black shadow-sm' : 'border-black/5 text-black/60 bg-[#faf9f6]/30 hover:border-black/25'}`}
                    >
                      <span>{opt.label}</span>
                      {sortBy === opt.value && <div className="w-1 h-1 rounded-full bg-white animate-pulse" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subcategory - Compact Flex */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-black/95">Category</h4>
                  {filters.subcategory !== 'All' && (
                    <span className="text-[7.5px] font-black bg-black text-white px-1.5 py-0.5 rounded-md uppercase tracking-wider">Active</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {subcategories.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => {
                        const toSlug = (s: string) => s.toLowerCase().replace(/ /g, '-');
                        if (sub === 'All') {
                          router.push(`/${category.slug}`);
                        } else {
                          router.push(`/${category.slug}/${toSlug(sub)}`);
                        }
                        setFilter('subcategory', sub);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border transition-all
                        ${filters.subcategory === sub ? 'bg-black text-white border-black shadow-sm' : 'border-black/5 text-black/60 bg-[#faf9f6]/30 hover:border-black/25'}`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              {categoryFilters.size && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-black/95">Size</h4>
                    {filters.size.length > 0 && (
                      <span className="text-[7.5px] font-black bg-black text-white px-1.5 py-0.5 rounded-md">{filters.size.length} Selected</span>
                    )}
                  </div>
                  <div className="grid grid-cols-5 gap-1">
                    {categoryFilters.size.map((size) => {
                      const isActive = filters.size.includes(size);
                      return (
                        <button
                          key={size}
                          onClick={() => toggleListFilter('size', size)}
                          className={`h-8 rounded-lg text-[9px] font-black border transition-all flex items-center justify-center
                            ${isActive ? 'bg-black text-white border-black shadow-sm' : 'border-black/15 text-black/60 bg-[#faf9f6]/10 hover:border-black'}`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {categoryFilters.color && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-black/95">Color</h4>
                    {filters.color.length > 0 && (
                      <span className="text-[7.5px] font-black bg-black text-white px-1.5 py-0.5 rounded-md">{filters.color.length} Selected</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {categoryFilters.color.map((color) => {
                      const isActive = filters.color.includes(color);
                      return (
                        <button
                          key={color}
                          onClick={() => toggleListFilter('color', color)}
                          className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border transition-all
                            ${isActive ? 'bg-black text-white border-black shadow-sm' : 'border-black/5 text-black/60 bg-[#faf9f6]/30 hover:border-black/25'}`}
                        >
                          {color}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {categoryFilters.fabric && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-black/95">Fabric</h4>
                    {filters.fabric.length > 0 && (
                      <span className="text-[7.5px] font-black bg-black text-white px-1.5 py-0.5 rounded-md">{filters.fabric.length} Selected</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {categoryFilters.fabric.map((fab) => {
                      const isActive = filters.fabric.includes(fab);
                      return (
                        <button
                          key={fab}
                          onClick={() => toggleListFilter('fabric', fab)}
                          className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border transition-all
                            ${isActive ? 'bg-black text-white border-black shadow-sm' : 'border-black/5 text-black/60 bg-[#faf9f6]/30 hover:border-black/25'}`}
                        >
                          {fab}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {categoryFilters.occasion && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-black/95">Occasion</h4>
                    {filters.occasion.length > 0 && (
                      <span className="text-[7.5px] font-black bg-black text-white px-1.5 py-0.5 rounded-md">{filters.occasion.length} Selected</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {categoryFilters.occasion.map((occ) => {
                      const isActive = filters.occasion.includes(occ);
                      return (
                        <button
                          key={occ}
                          onClick={() => toggleListFilter('occasion', occ)}
                          className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border transition-all
                            ${isActive ? 'bg-black text-white border-black shadow-sm' : 'border-black/5 text-black/60 bg-[#faf9f6]/30 hover:border-black/25'}`}
                        >
                          {occ}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Price Range - Ultra Compact Slimline */}
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] text-black/95 font-black uppercase tracking-[0.2em]">
                  <span>Price</span>
                  <span>৳{filters.minPrice.toLocaleString()} - ৳{filters.maxPrice.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50000}
                  step={500}
                  value={filters.maxPrice}
                  onChange={(e) => setFilter('maxPrice', Number(e.target.value))}
                  className="w-full accent-black h-1 bg-black/5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Apply Button - Compact */}
            <div className="px-4 py-3 border-t border-black/5 bg-gray-50 mt-auto">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-black text-white py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black/90 transition-all rounded-lg shadow-sm active:scale-95"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
