'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useCategoryStore } from '@/store/categoryStore';
import { Category } from '@/types';

interface MobileFilterDrawerProps {
  category: Category;
}

export default function MobileFilterDrawer({ category }: MobileFilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>('subcategory');
  const { filters, setFilter, clearAllFilters } = useCategoryStore();
  const { filters: categoryFilters, subcategories } = category;

  useEffect(() => {
    setMounted(true);
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  const toggleSection = (section: string) =>
    setOpenSection(openSection === section ? null : section);

  const activeFilterCount = [
    filters.subcategory !== 'All' ? 1 : 0,
    filters.size.length,
    filters.color.length,
    filters.fabric.length,
    filters.fit.length,
    filters.occasion.length,
    filters.rating > 0 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="group flex items-center transition-colors relative"
      >
        <SlidersHorizontal className="w-3.5 h-3.5 text-black/40 group-hover:text-black transition-colors" />
        {activeFilterCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-black text-white text-[6px] w-2.5 h-2.5 flex items-center justify-center rounded-full">
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
            className={`fixed top-0 right-0 bottom-0 z-[101] w-[85vw] max-w-[400px] bg-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-2xl flex flex-col
              ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
          >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
          <h3 className="text-sm font-extrabold uppercase tracking-widest">Filter</h3>
          <div className="flex items-center gap-4">
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-[10px] uppercase tracking-widest font-bold text-black/40 hover:text-black transition-colors"
              >
                Clear All
              </button>
            )}
            <button onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
          {/* Subcategory */}
          <FilterSection
            title="Category"
            isOpen={openSection === 'subcategory'}
            onToggle={() => toggleSection('subcategory')}
          >
            <div className="flex flex-wrap gap-2">
              {subcategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setFilter('subcategory', sub)}
                  className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all
                    ${filters.subcategory === sub ? 'bg-black text-white border-black' : 'border-black/10 text-black/60 hover:border-black'}`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Size */}
          {categoryFilters.size && (
            <FilterSection
              title="Size"
              isOpen={openSection === 'size'}
              onToggle={() => toggleSection('size')}
            >
              <div className="flex flex-wrap gap-2">
                {categoryFilters.size.map((size) => {
                  const isActive = filters.size.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => {
                        const newSizes = isActive
                          ? filters.size.filter((s) => s !== size)
                          : [...filters.size, size];
                        setFilter('size', newSizes);
                      }}
                      className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all
                        ${isActive ? 'bg-black text-white border-black' : 'border-black/10 text-black/60 hover:border-black'}`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </FilterSection>
          )}

          {/* Occasion */}
          {categoryFilters.occasion && (
            <FilterSection
              title="Occasion"
              isOpen={openSection === 'occasion'}
              onToggle={() => toggleSection('occasion')}
            >
              <div className="flex flex-wrap gap-2">
                {categoryFilters.occasion.map((occ) => {
                  const isActive = filters.occasion.includes(occ);
                  return (
                    <button
                      key={occ}
                      onClick={() => {
                        const newOcc = isActive
                          ? filters.occasion.filter((o) => o !== occ)
                          : [...filters.occasion, occ];
                        setFilter('occasion', newOcc);
                      }}
                      className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all
                        ${isActive ? 'bg-black text-white border-black' : 'border-black/10 text-black/60 hover:border-black'}`}
                    >
                      {occ}
                    </button>
                  );
                })}
              </div>
            </FilterSection>
          )}

          {/* Price Range */}
          <FilterSection
            title={`Price: ৳${filters.minPrice.toLocaleString()} – ৳${filters.maxPrice.toLocaleString()}`}
            isOpen={openSection === 'price'}
            onToggle={() => toggleSection('price')}
          >
            <div className="space-y-3">
              <input
                type="range"
                min={0}
                max={50000}
                step={500}
                value={filters.maxPrice}
                onChange={(e) => setFilter('maxPrice', Number(e.target.value))}
                className="w-full accent-black"
              />
              <div className="flex justify-between text-[10px] text-black/40 font-bold uppercase tracking-widest">
                <span>৳0</span>
                <span>৳50,000</span>
              </div>
            </div>
          </FilterSection>
        </div>

        {/* Apply Button */}
        <div className="px-6 py-6 border-t border-black/5 bg-gray-50 mt-auto">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-black/80 transition-colors rounded-sm"
          >
            Show Results ({activeFilterCount > 0 ? activeFilterCount + ' Filters' : 'All'})
          </button>
        </div>
      </div>
    </div>,
    document.body
  )}
    </>
  );
}

// ─── Helper: Collapsible Section ──────────────────────────────
function FilterSection({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-black/5 pb-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-2 text-[11px] font-bold uppercase tracking-widest"
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {isOpen && <div className="mt-3">{children}</div>}
    </div>
  );
}
