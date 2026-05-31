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
  // Gift card fields
  isGiftCard?: boolean;
  giftCardValue?: number;   // The credit the card gives (e.g. 5000)
  giftCardTierId?: string;  // e.g. 'premium'
  giftCardCode?: string;    // The unique code (shown after purchase)
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  // Gift Card balance system
  giftCardBalance: number;
  useGiftCard: boolean;
  giftCardCodeEntry: string;    // user-typed code input
  giftCardRedeemError: string;  // error message from redeem attempt
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, quantity?: number, size?: string, color?: string) => void;
  addGiftCardItem: (tierId: string, tierName: string, payPrice: number, cardValue: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  itemsCount: number;
  // Gift Card actions
  purchaseGiftCard: (value: number) => void;
  redeemGiftCard: (code: string) => Promise<boolean>;
  toggleUseGiftCard: () => void;
  setGiftCardCodeEntry: (code: string) => void;
  getGiftCardDiscount: () => number;
  getFinalTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      itemsCount: 0,
      isOpen: false,
      giftCardBalance: 0,
      useGiftCard: false,
      giftCardCodeEntry: '',
      giftCardRedeemError: '',

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (product, quantity = 1, size, color) => set((state) => {
        const existingItemIndex = state.items.findIndex(
          (item) => item.productId === product.id && item.size === size && item.color === color
        );

        if (existingItemIndex > -1) {
          const newItems = [...state.items];
          newItems[existingItemIndex].quantity += quantity;
          return { items: newItems, itemsCount: state.itemsCount + quantity, isOpen: true };
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
          itemsCount: state.itemsCount + quantity,
          isOpen: true
        };
      }),

      // Add gift card as a cart item (quantity always 1 per card)
      addGiftCardItem: (tierId, tierName, payPrice, cardValue) => set((state) => {
        // Don't allow duplicate gift card of same tier
        const alreadyInCart = state.items.find(i => i.isGiftCard && i.giftCardTierId === tierId);
        if (alreadyInCart) {
          return { isOpen: true };
        }

        const newItem: CartItem = {
          id: `giftcard-${tierId}-${Date.now()}`,
          productId: `giftcard-${tierId}`,
          name: `${tierName} Gift Card`,
          price: payPrice,
          image: '', // handled separately in CartDrawer
          quantity: 1,
          isGiftCard: true,
          giftCardValue: cardValue,
          giftCardTierId: tierId,
        };

        return {
          items: [...state.items, newItem],
          itemsCount: state.itemsCount + 1,
          isOpen: true,
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
        // Gift cards are always qty 1
        if (item.isGiftCard) return state;
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

      // Called after order is placed — credits gift cards from cart
      purchaseGiftCard: (value: number) => set((state) => ({
        giftCardBalance: state.giftCardBalance + value,
      })),

      // Gift Card: Redeem via code (real API)
      redeemGiftCard: async (code: string): Promise<boolean> => {
        try {
          const res = await fetch('/api/gift-cards/redeem', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
          });
          const data = await res.json();
          if (!res.ok) {
            set({ giftCardRedeemError: data.error || 'Invalid code' });
            return false;
          }
          set(state => ({
            giftCardBalance: state.giftCardBalance + data.balance,
            giftCardCodeEntry: '',
            giftCardRedeemError: '',
          }));
          return true;
        } catch {
          set({ giftCardRedeemError: 'Something went wrong. Try again.' });
          return false;
        }
      },

      toggleUseGiftCard: () => set((state) => ({ useGiftCard: !state.useGiftCard })),

      setGiftCardCodeEntry: (code: string) => set({ giftCardCodeEntry: code, giftCardRedeemError: '' }),

      getGiftCardDiscount: () => {
        const state = get();
        if (!state.useGiftCard) return 0;
        const nonGiftTotal = state.items
          .filter(i => !i.isGiftCard)
          .reduce((t, i) => t + i.price * i.quantity, 0);
        // Single-use: consume full balance (or remaining total if less)
        return Math.min(state.giftCardBalance, nonGiftTotal);
      },

      getFinalTotal: () => {
        const state = get();
        const discount = state.getGiftCardDiscount();
        // Single-use: after checkout, balance is fully consumed
        return Math.max(0, state.getTotalPrice() - discount);
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        itemsCount: state.itemsCount,
        giftCardBalance: state.giftCardBalance,
      }),
    }
  )
);
