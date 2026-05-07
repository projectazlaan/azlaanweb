'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CreditCard, Truck, CheckCircle } from 'lucide-react';

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('bkash');

  return (
    <main className="min-h-screen pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="font-serif text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center text-primary">Checkout</h1>

        <div className="flex items-center justify-center gap-2 md:gap-4 mb-8 md:mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-1 md:gap-2">
              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base ${
                  s <= step ? 'bg-secondary text-white' : 'bg-section-bg text-text-muted'
                }`}
              >
                {s < step ? <CheckCircle className="w-4 h-4 md:w-5 md:h-5" /> : s}
              </div>
              {s < 3 && <div className={`w-8 md:w-16 h-1 ${s < step ? 'bg-secondary' : 'bg-section-bg'}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-white p-5 md:p-8 rounded-2xl">
                <h2 className="font-serif text-xl font-bold mb-4 text-primary">Shipping Information</h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-primary">Full Name</label>
                      <input type="text" className="w-full px-4 py-3 border border-border-light rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-secondary" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-primary">Phone</label>
                      <input type="tel" className="w-full px-4 py-3 border border-border-light rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-secondary" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-primary">Address</label>
                    <textarea rows={3} className="w-full px-4 py-3 border border-border-light rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-primary">City</label>
                      <select className="w-full px-4 py-3 border border-border-light rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-secondary">
                        <option>Dhaka</option>
                        <option>Chittagong</option>
                        <option>Sylhet</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-primary">Area</label>
                      <input type="text" className="w-full px-4 py-3 border border-border-light rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-secondary" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-primary">ZIP Code</label>
                      <input type="text" className="w-full px-4 py-3 border border-border-light rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-secondary" />
                    </div>
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    className="w-full bg-secondary text-white py-3 rounded-full font-semibold hover:bg-secondary/90 transition-colors cursor-pointer"
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white p-5 md:p-8 rounded-2xl">
                <h2 className="font-serif text-xl font-bold mb-4 text-primary">Payment Method</h2>
                <div className="space-y-3 mb-6">
                  {[
                    { id: 'bkash', name: 'bKash', color: 'bg-pink-500' },
                    { id: 'nagad', name: 'Nagad', color: 'bg-orange-500' },
                    { id: 'cash', name: 'Cash on Delivery', color: 'bg-gray-500' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`w-full p-4 border-2 rounded-2xl transition-colors cursor-pointer text-left ${
                        paymentMethod === method.id ? 'border-secondary' : 'border-border-light'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${method.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                          {method.name[0]}
                        </div>
                        <span className="font-semibold">{method.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 border border-border-light py-3 rounded-full font-semibold hover:border-secondary transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 bg-secondary text-white py-3 rounded-full font-semibold hover:bg-secondary/90 transition-colors cursor-pointer"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white p-6 md:p-10 rounded-2xl text-center">
                <CheckCircle className="w-16 h-16 md:w-20 md:h-20 text-green-500 mx-auto mb-4" />
                <h2 className="font-serif text-2xl font-bold mb-2 text-primary">Order Placed Successfully!</h2>
                <p className="text-text-muted mb-6">Order #AZL-2026-001234</p>
                <Link
                  href="/"
                  className="inline-block bg-secondary text-white px-8 py-3 rounded-full font-semibold hover:bg-secondary/90 transition-colors cursor-pointer"
                >
                  Continue Shopping
                </Link>
              </div>
            )}
          </div>

          {step < 3 && (
            <div className="bg-white p-5 md:p-6 rounded-2xl h-fit">
              <h3 className="font-bold mb-4 text-primary">Order Summary</h3>
              <div className="space-y-3 mb-4">
                <div className="flex gap-3">
                  <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden">
                    <img src="/media-pro/men/Design 1/649824908_122120770023151981_1372810042799937270_n.webp" alt="" className="object-cover w-full h-full" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold line-clamp-1 text-primary">Premium Cotton Panjabi</p>
                    <p className="text-xs text-text-muted">Qty: 1 × ৳8,500</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-border-light pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Subtotal</span>
                  <span>৳8,500</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Shipping</span>
                  <span>৳120</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-border-light">
                  <span>Total</span>
                  <span className="text-secondary">৳8,620</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
