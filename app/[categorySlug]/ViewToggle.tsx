'use client';

import { LayoutGrid, List, ShoppingBag } from 'lucide-react';
import { useCategoryStore } from '@/store/categoryStore';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';

export default function ViewToggle() {
  const { viewMode, setViewMode } = useCategoryStore();
  const { itemsCount } = useCartStore();

  return (
    <div className="flex items-center border border-black/10 rounded-full p-1 bg-white/50 backdrop-blur-sm gap-1">
      {/* View Toggle Group */}
      <div className="relative flex items-center bg-gray-100/50 rounded-full p-0.5">
        {/* Sliding Background */}
        <div 
          className={`absolute h-7 w-7 bg-black rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            viewMode === 'grid' ? 'left-0.5' : 'left-[34px]'
          }`}
        />
        
        <button
          onClick={() => setViewMode('grid')}
          className={`relative z-10 w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
            viewMode === 'grid' ? 'text-white' : 'text-black/40 hover:text-black'
          }`}
          aria-label="Grid view"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
        </button>
        
        <button
          onClick={() => setViewMode('list')}
          className={`relative z-10 w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
            viewMode === 'list' ? 'text-white' : 'text-black/40 hover:text-black'
          }`}
          aria-label="List view"
        >
          <List className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Cart Separator */}
      <div className="w-[1px] h-4 bg-black/5 mx-0.5" />

      {/* Cart Icon inside the same pill */}
      <Link
        href="/cart"
        className="w-8 h-8 flex items-center justify-center rounded-full text-black hover:bg-black hover:text-white transition-all active:scale-95 relative"
      >
        <ShoppingBag className="w-4 h-4" />
        {itemsCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-black text-white text-[7px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white">
            {itemsCount}
          </span>
        )}
      </Link>
    </div>
  );
}
