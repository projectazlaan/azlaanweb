import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  itemsCount: number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      itemsCount: 0,

      addItem: (product, quantity = 1, size, color) => set((state) => {
        const existingItemIndex = state.items.findIndex(
          (item) => item.productId === product.id && item.size === size && item.color === color
        );

        if (existingItemIndex > -1) {
          const newItems = [...state.items];
          newItems[existingItemIndex].quantity += quantity;
          return { items: newItems, itemsCount: state.itemsCount + quantity };
        }

        const newItem: CartItem = {
          id: `${product.id}-${size}-${color}-${Date.now()}`,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          size,
          color,
          quantity,
        };

        return { 
          items: [...state.items, newItem], 
          itemsCount: state.itemsCount + quantity 
        };
      }),

      removeItem: (itemId) => set((state) => {
        const itemToRemove = state.items.find(i => i.id === itemId);
        return {
          items: state.items.filter((item) => item.id !== itemId),
          itemsCount: state.itemsCount - (itemToRemove?.quantity || 0)
        };
      }),

      updateQuantity: (itemId, quantity) => set((state) => {
        const item = state.items.find(i => i.id === itemId);
        if (!item) return state;
        const diff = quantity - item.quantity;
        
        return {
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
          itemsCount: state.itemsCount + diff
        };
      }),

      clearCart: () => set({ items: [], itemsCount: 0 }),

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
