'use client';

import { useState } from 'react';
import { Product, ViewMode } from '@/types';
import { useCategoryStore } from '@/store/categoryStore';
import ProductCard from '@/components/product/ProductCard';
import Pagination from './Pagination';
import QuickViewModal from './QuickViewModal';

interface ProductGridProps {
  products: Product[];
  viewMode: ViewMode;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export default function ProductGrid({
  products,
  viewMode,
  totalCount,
  currentPage,
  totalPages,
}: ProductGridProps) {
  const { clearAllFilters } = useCategoryStore();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="relative mb-8 md:mb-12">
          <div className="absolute inset-0 bg-black/5 blur-3xl rounded-full" />
          <h2 className="relative text-[12vw] font-black uppercase tracking-tighter text-black/5 leading-none select-none">
            COMING SOON
          </h2>
        </div>
        <h3 className="text-xl md:text-2xl font-black uppercase tracking-[0.3em] mb-4">Under Preparation</h3>
        <p className="text-black/40 text-[9px] md:text-xs mb-10 max-w-sm uppercase tracking-[0.15em] leading-relaxed px-6">
          We are meticulously crafting new styles for this selection. Stay tuned for our next exclusive drop.
        </p>
        <button
          onClick={clearAllFilters}
          className="px-10 py-4 border border-black/10 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-500 rounded-sm"
        >
          Explore Available Collection
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Results count */}
      <p className="text-[10px] text-black/40 uppercase tracking-widest font-bold mb-6">
        Showing {products.length} of {totalCount} items
      </p>

      {/* Grid or List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-1 gap-y-12">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              viewMode="grid" 
              onQuickView={() => setQuickViewProduct(product)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-6 max-w-2xl">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              viewMode="list" 
              onQuickView={() => setQuickViewProduct(product)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-16">
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
