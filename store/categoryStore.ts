// =============================================================
// store/categoryStore.ts — Zustand Global State for Category Pages
// =============================================================

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { FilterState, ViewMode, SortOption } from '@/types';

interface CategoryStore {
  filters: FilterState;
  viewMode: ViewMode;
  sortBy: SortOption['value'];
  currentPage: number;
  activeSection: string;

  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  clearAllFilters: () => void;
  removeFilter: (key: keyof FilterState, value?: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setSortBy: (sort: SortOption['value']) => void;
  setCurrentPage: (page: number) => void;
  setActiveSection: (section: string) => void;
}

const initialFilters: FilterState = {
  subcategory: 'All',
  subSubCategory: 'All',
  size: [],
  color: [],
  fabric: [],
  fit: [],
  occasion: [],
  silhouette: [],
  minPrice: 0,
  maxPrice: 100000,
  rating: 0,
};

export const useCategoryStore = create<CategoryStore>()(
  devtools(
    (set) => ({
      filters: initialFilters,
      viewMode: 'grid',
      sortBy: 'newest',
      currentPage: 1,
      activeSection: 'All',

      setFilter: (key, value) =>
        set(
          (state) => ({
            filters: { ...state.filters, [key]: value },
            currentPage: 1,
          }),
          false,
          'setFilter'
        ),

      clearAllFilters: () =>
        set(
          { filters: initialFilters, currentPage: 1 },
          false,
          'clearAllFilters'
        ),

      removeFilter: (key, value) =>
        set(
          (state) => {
            const currentValue = state.filters[key];
            // Array filter: remove one specific value from array
            if (Array.isArray(currentValue) && value) {
              return {
                filters: {
                  ...state.filters,
                  [key]: currentValue.filter((v) => v !== value),
                },
                currentPage: 1,
              };
            }
            // Price reset
            if (key === 'minPrice' || key === 'maxPrice') {
              return {
                filters: { ...state.filters, minPrice: 0, maxPrice: 50000 },
                currentPage: 1,
              };
            }
            // Rating reset
            if (key === 'rating') {
              return { filters: { ...state.filters, rating: 0 }, currentPage: 1 };
            }
            // Subcategory reset
            if (key === 'subcategory') {
              return {
                filters: { ...state.filters, subcategory: 'All' },
                currentPage: 1,
              };
            }
            return state;
          },
          false,
          'removeFilter'
        ),

      setViewMode: (mode) => set({ viewMode: mode }, false, 'setViewMode'),

      setSortBy: (sort) =>
        set({ sortBy: sort, currentPage: 1 }, false, 'setSortBy'),

      setCurrentPage: (page) =>
        set({ currentPage: page }, false, 'setCurrentPage'),

      setActiveSection: (section) =>
        set({ activeSection: section }, false, 'setActiveSection'),
    }),
    { name: 'CategoryStore' }
  )
);
