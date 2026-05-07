import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

interface ProductState {
  recentlyViewed: Product[];
  wishlist: string[]; // array of product IDs
  
  addToRecentlyViewed: (product: Product) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      recentlyViewed: [],
      wishlist: [],

      addToRecentlyViewed: (product) => set((state) => {
        const filtered = state.recentlyViewed.filter(p => p.id !== product.id);
        return {
          recentlyViewed: [product, ...filtered].slice(0, 10) // keep last 10
        };
      }),

      toggleWishlist: (productId) => set((state) => ({
        wishlist: state.wishlist.includes(productId)
          ? state.wishlist.filter(id => id !== productId)
          : [...state.wishlist, productId]
      })),

      isInWishlist: (productId) => get().wishlist.includes(productId),
    }),
    {
      name: 'product-storage',
    }
  )
);
