'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Premium Cotton Panjabi',
      nameBn: 'প্রিমিয়াম কটন পাঞ্জাবি',
      price: 8500,
      quantity: 1,
      size: 'L',
      image: '/media-pro/men/Design 1/649824908_122120770023151981_1372810042799937270_n.webp',
    },
    {
      id: 2,
      name: 'Elegant Evening Dress',
      nameBn: 'বিশুদ্ধ ইভিনিং ড্রেস',
      price: 9800,
      quantity: 2,
      size: 'M',
      image: '/media-pro/women/Design 1/673191812_122125962327151981_8385571386878315506_n.webp',
    },
  ]);

  const updateQuantity = (id: number, newQty: number) => {
    if (newQty < 1) return;
    setCartItems(items =>
      items.map(item => item.id === id ? { ...item, quantity: newQty } : item)
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 120;
  const total = subtotal + shipping;

  return (
    <main className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="font-serif text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-primary">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 mx-auto text-text-muted mb-4" />
            <p className="text-text-muted mb-4">Your cart is empty</p>
            <Link href="/shop" className="bg-secondary text-white px-6 py-3 rounded-full hover:bg-secondary/90 transition-colors cursor-pointer inline-block">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3 md:gap-4 bg-white p-4 md:p-5 rounded-2xl">
                  <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm md:text-base mb-1 text-primary">{item.name}</h3>
                    <p className="text-text-muted text-xs md:text-sm mb-2">Size: {item.size}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 border border-border-light rounded-full cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 border border-border-light rounded-full cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="font-bold text-secondary text-sm md:text-base">৳{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors cursor-pointer self-start p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white p-5 md:p-6 rounded-2xl h-fit">
              <h2 className="font-serif text-xl md:text-2xl font-bold mb-4 text-primary">Order Summary</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-text-muted">Subtotal</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-text-muted">Shipping</span>
                  <span>৳{shipping}</span>
                </div>
                <div className="border-t border-border-light pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-secondary">৳{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Coupon code"
                  className="w-full px-4 py-3 border border-border-light rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              <Link
                href="/checkout"
                className="block w-full bg-secondary text-white text-center py-3 rounded-full font-semibold hover:bg-secondary/90 transition-colors cursor-pointer"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
