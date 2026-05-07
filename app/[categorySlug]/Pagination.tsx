'use client';

import { useCategoryStore } from '@/store/categoryStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const { setCurrentPage } = useCategoryStore();

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Prev */}
      <button
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2 border border-black/10 rounded-full disabled:opacity-30 hover:bg-black hover:text-white transition-all duration-300"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`w-9 h-9 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border
            ${page === currentPage
              ? 'bg-black text-white border-black'
              : 'border-black/10 text-black/60 hover:border-black hover:text-black'
            }`}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-2 border border-black/10 rounded-full disabled:opacity-30 hover:bg-black hover:text-white transition-all duration-300"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
