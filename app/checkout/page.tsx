'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, ChevronRight, Truck, ShieldCheck, RotateCcw,
  ArrowLeft, Sparkles, Phone, MapPin, User, Plus, Edit2,
  Trash2, Home, Building2, Star, X, Gift, ShoppingBag,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

/* ════════════════════════ TYPES ════════════════════════ */
interface Address {
  id: string;
  label: string;
  type: 'home' | 'office' | 'other';
  name: string;
  phone: string;
  address: string;
  city: string;
  area: string;
  zip: string;
  isDefault: boolean;
}

/* ════════════════════════ MOCK DATA ════════════════════════ */
const SEED_ADDRESSES: Address[] = [
  {
    id: 'a1', label: 'Home', type: 'home', isDefault: true,
    name: 'Azlaan Rahman', phone: '01712345678',
    address: 'House 12, Road 5, Block A', city: 'Dhaka', area: 'Gulshan', zip: '1212',
  },
  {
    id: 'a2', label: 'Office', type: 'office', isDefault: false,
    name: 'Azlaan Rahman', phone: '01812345678',
    address: 'Level 4, Rupayan Centre', city: 'Dhaka', area: 'Banani', zip: '1213',
  },
];

// ORDER_ITEMS mock removed in favor of dynamic useCartStore items

const CITIES = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Mymensingh', 'Rangpur'];

const TYPE_ICONS: Record<string, React.ElementType> = { home: Home, office: Building2, other: MapPin };

function GiftCardPayToggle() {
  const { giftCardBalance, useGiftCard, toggleUseGiftCard, getGiftCardDiscount } = useCartStore();
  if (giftCardBalance <= 0) return null;
  const discount = getGiftCardDiscount();
  return (
    <div className={`mb-6 p-4 rounded-2xl border-2 transition-all ${
      useGiftCard ? 'border-emerald-400 bg-emerald-50' : 'border-neutral-200 bg-neutral-50'
    }`}>
      <button onClick={toggleUseGiftCard} className="w-full flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
          useGiftCard ? 'bg-emerald-500 text-white' : 'bg-neutral-200 text-neutral-400'
        }`}>
          <Gift className="w-5 h-5" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-[13px] font-black text-neutral-900">Pay with Gift Card</p>
          <p className={`text-[10px] font-bold ${ useGiftCard ? 'text-emerald-600' : 'text-neutral-400'}`}>
            Balance: ৳{giftCardBalance.toLocaleString()} available
          </p>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
          useGiftCard ? 'bg-emerald-500 border-emerald-500' : 'border-neutral-300'
        }`}>
          {useGiftCard && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
        </div>
      </button>
      {useGiftCard && (
        <div className="mt-3 pt-3 border-t border-emerald-200 flex items-center justify-between">
          <span className="text-[11px] font-black text-emerald-700 uppercase tracking-widest">Gift Card Discount</span>
          <span className="text-sm font-black text-emerald-600">- ৳{discount.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════ ADDRESS FORM ════════════════════════ */
function AddressForm({
  initial, onSave, onCancel,
}: {
  initial?: Partial<Address>;
  onSave: (a: Omit<Address, 'id'>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    label:     initial?.label     ?? '',
    type:      initial?.type      ?? 'home' as const,
    name:      initial?.name      ?? '',
    phone:     initial?.phone     ?? '',
    address:   initial?.address   ?? '',
    city:      initial?.city      ?? 'Dhaka',
    area:      initial?.area      ?? '',
    zip:       initial?.zip       ?? '',
    isDefault: initial?.isDefault ?? false,
  });

  const inp = 'w-full px-3.5 py-3 text-[13px] font-medium text-neutral-900 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-black focus:bg-white transition-all placeholder:text-neutral-300';

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 sm:p-5 space-y-3.5"
    >
      {/* Type selector */}
      <div>
        <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-2">Address Type</p>
        <div className="flex gap-2">
          {(['home', 'office', 'other'] as const).map(t => {
            const Icon = TYPE_ICONS[t];
            const active = form.type === t;
            return (
              <button key={t} onClick={() => set('type', t)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border-2 font-bold text-[10px] uppercase tracking-wider transition-all
                  ${active ? 'border-black bg-black text-white' : 'border-neutral-200 bg-white text-neutral-500 hover:border-neutral-400'}`}>
                <Icon className="w-3 h-3" />
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Label */}
      <div>
        <label className="block text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-1.5">Label (e.g. "Mom's place")</label>
        <input value={form.label} onChange={e => set('label', e.target.value)}
          placeholder="Home, Office, Mum's…" className={inp} />
      </div>

      {/* Name + Phone */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-1.5">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-300 pointer-events-none" />
            <input value={form.name} onChange={e => set('name', e.target.value)}
              placeholder="Azlaan Rahman" className={`${inp} pl-9`} />
          </div>
        </div>
        <div>
          <label className="block text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-1.5">Phone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-300 pointer-events-none" />
            <input value={form.phone} onChange={e => set('phone', e.target.value)}
              placeholder="01XXXXXXXXX" type="tel" className={`${inp} pl-9`} />
          </div>
        </div>
      </div>

      {/* Full address */}
      <div>
        <label className="block text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-1.5">Street Address</label>
        <textarea value={form.address} onChange={e => set('address', e.target.value)}
          rows={2} placeholder="House no., Road, Block…"
          className={`${inp} resize-none`} />
      </div>

      {/* City / Area / ZIP */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-1.5">City</label>
          <select value={form.city} onChange={e => set('city', e.target.value)} className={inp}>
            {CITIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-1.5">Area</label>
          <input value={form.area} onChange={e => set('area', e.target.value)}
            placeholder="Gulshan, Mirpur…" className={inp} />
        </div>
        <div>
          <label className="block text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-1.5">ZIP</label>
          <input value={form.zip} onChange={e => set('zip', e.target.value)}
            placeholder="1212" className={inp} />
        </div>
      </div>

      {/* Default toggle */}
      <button onClick={() => set('isDefault', !form.isDefault)}
        className="flex items-center gap-2.5 group w-full text-left">
        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0
          ${form.isDefault ? 'bg-black border-black' : 'border-neutral-300 group-hover:border-neutral-500'}`}>
          {form.isDefault && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
        </div>
        <span className="text-[11px] font-bold text-neutral-700">Set as default address</span>
        {form.isDefault && <Star className="w-3 h-3 text-amber-400 fill-amber-400 ml-1" />}
      </button>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button onClick={onCancel}
          className="flex-1 border-2 border-neutral-200 text-neutral-600 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-neutral-400 transition-colors">
          Cancel
        </button>
        <button
          onClick={() => onSave(form)}
          className="flex-[2] bg-black text-white py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5">
          <Check className="w-3.5 h-3.5" strokeWidth={3} />
          Save Address
        </button>
      </div>
    </motion.div>
  );
}

/* ════════════════════════ STEP BAR ════════════════════════ */
const STEPS = ['Shipping', 'Payment', 'Confirm'];
function StepBar({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((label, i) => {
        const s = i + 1;
        const done   = s < step;
        const active = s === step;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1 shrink-0">
              <motion.div animate={{ scale: active ? 1.1 : 1 }}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all
                  ${done ? 'bg-black text-white' : active ? 'bg-black text-white ring-4 ring-black/10' : 'bg-neutral-100 text-neutral-400'}`}>
                {done ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : s}
              </motion.div>
              <span className={`text-[9px] font-bold uppercase tracking-widest whitespace-nowrap ${active ? 'text-black' : 'text-neutral-400'}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 mx-2 h-px bg-neutral-200 relative -mt-4">
                <motion.div animate={{ scaleX: done ? 1 : 0 }} initial={{ scaleX: 0 }}
                  style={{ transformOrigin: 'left' }} transition={{ duration: 0.4 }}
                  className="absolute inset-0 bg-black" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ════════════════════════ PAYMENT OPTION ════════════════════════ */
function PayOpt({ id, active, onClick, children }: { id: string; active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button key={id} whileTap={{ scale: 0.98 }} onClick={onClick}
      className={`w-full p-4 rounded-xl border-2 text-left flex items-center gap-3.5 transition-all
        ${active ? 'border-black bg-black/[0.02]' : 'border-neutral-150 bg-neutral-50 hover:border-neutral-300'}`}>
      <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all
        ${active ? 'border-black bg-black' : 'border-neutral-300'}`}>
        {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
      </div>
      {children}
    </motion.button>
  );
}

/* ════════════════════════ ORDER SUMMARY ════════════════════════ */
function OrderSummary() {
  const { items, getTotalPrice, getGiftCardDiscount, getFinalTotal, useGiftCard } = useCartStore();
  const subtotal = getTotalPrice();
  const discount = getGiftCardDiscount();
  const total = getFinalTotal();

  return (
    <div className="bg-neutral-50 border border-neutral-100 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-neutral-100">
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400">Your Order</p>
      </div>
      <div className="px-5 py-4 space-y-3.5 max-h-[350px] overflow-y-auto">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="relative w-11 h-14 rounded-xl overflow-hidden bg-neutral-200 shrink-0">
              {item.isGiftCard ? (
                <div className="w-full h-full bg-gradient-to-br from-[#1D1D1F] to-[#2c2c2c] flex items-center justify-center">
                  <Gift className="w-5 h-5 text-[#C9A84C]" />
                </div>
              ) : (
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="44px" />
              )}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[8px] font-black rounded-full flex items-center justify-center">{item.quantity}</div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-neutral-900 truncate">{item.name}</p>
              <p className="text-[9px] text-neutral-400 font-medium">
                {item.isGiftCard 
                  ? `Value: ৳${item.giftCardValue?.toLocaleString()}` 
                  : `${item.color ? `${item.color} · ` : ''}Size ${item.size}`}
              </p>
            </div>
            <span className="text-[12px] font-black text-neutral-900">৳{(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className="px-5 py-4 border-t border-neutral-100 space-y-2">
        <div className="flex justify-between text-[11px]">
          <span className="text-neutral-500">Subtotal</span>
          <span className="font-bold text-neutral-800">৳{subtotal.toLocaleString()}</span>
        </div>
        {useGiftCard && discount > 0 && (
          <div className="flex justify-between text-[11px] font-bold text-emerald-600">
            <span>Gift Card Used</span>
            <span>- ৳{discount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-[11px]">
          <span className="text-neutral-500">Shipping</span>
          <span className="font-bold text-emerald-600 text-[9px] uppercase tracking-wider">Free</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-neutral-200">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Total</span>
          <span className="text-lg font-black text-neutral-900">৳{total.toLocaleString()}</span>
        </div>
      </div>
      <div className="px-5 py-3 border-t border-neutral-100 flex justify-around">
        {[{ Icon: ShieldCheck, l: 'Secure' }, { Icon: RotateCcw, l: 'Returns' }, { Icon: Truck, l: 'Fast' }].map(({ Icon, l }) => (
          <div key={l} className="flex flex-col items-center gap-1">
            <Icon className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider">{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════ MAIN ════════════════════════ */
export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [pay,  setPay]  = useState('bkash');

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { items, getFinalTotal, getGiftCardDiscount, useGiftCard, purchaseGiftCard, clearCart } = useCartStore();

  const total = getFinalTotal();
  const discount = getGiftCardDiscount();

  const handlePlaceOrder = () => {
    // Credit purchased gift cards to user's balance
    const giftCardsValue = items
      .filter(item => item.isGiftCard)
      .reduce((sum, item) => sum + (item.giftCardValue ?? 0) * item.quantity, 0);

    // Deduct used gift card balance (if discount applied)
    const appliedDiscount = useGiftCard ? discount : 0;

    const netBalanceChange = giftCardsValue - appliedDiscount;
    if (netBalanceChange !== 0) {
      purchaseGiftCard(netBalanceChange);
    }

    // Reset checkout state and clear cart
    if (useGiftCard) {
      useCartStore.setState({ useGiftCard: false });
    }
    clearCart();
    setStep(3);
  };

  /* Address state */
  const [addresses, setAddresses]     = useState<Address[]>(SEED_ADDRESSES);
  const [selectedId, setSelectedId]   = useState<string>('a1');
  const [showForm, setShowForm]       = useState(false);
  const [editingAddr, setEditingAddr] = useState<Address | null>(null);

  const uid = () => Date.now().toString(36);

  const saveAddress = (data: Omit<Address, 'id'>) => {
    if (editingAddr) {
      setAddresses(prev => prev.map(a => a.id === editingAddr.id
        ? { ...data, id: editingAddr.id, isDefault: data.isDefault ? true : a.isDefault }
        : data.isDefault ? { ...a, isDefault: false } : a));
    } else {
      const newId = uid();
      setAddresses(prev =>
        data.isDefault
          ? [...prev.map(a => ({ ...a, isDefault: false })), { ...data, id: newId }]
          : [...prev, { ...data, id: newId }]
      );
      setSelectedId(newId);
    }
    setEditingAddr(null);
    setShowForm(false);
  };

  const deleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    if (selectedId === id) setSelectedId(addresses.find(a => a.id !== id)?.id ?? '');
  };

  const setDefault = (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (step < 3 && items.length === 0) {
    return (
      <main className="min-h-screen bg-white flex flex-col items-center justify-center gap-5 px-6 pb-36 lg:pb-0">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center">
          <ShoppingBag className="w-7 h-7 text-neutral-400" />
        </div>
        <div className="text-center">
          <h1 className="text-lg font-black text-neutral-900 mb-1">Your bag is empty</h1>
          <p className="text-sm text-neutral-400">Add items to your bag before checking out.</p>
        </div>
        <Link href="/shop">
          <motion.button whileTap={{ scale: 0.97 }}
            className="bg-black text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest">
            Shop Now
          </motion.button>
        </Link>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ── Top bar ── */}
      <div className="pt-20 border-b border-neutral-100">
        <div className="max-w-[1050px] mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <Link href="/cart" className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-black transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Bag
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-neutral-300" />
            <span className="text-[11px] font-black uppercase tracking-widest text-neutral-900">Checkout</span>
          </div>
          <div className="w-24" />
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-[1050px] mx-auto px-4 sm:px-8 pt-8
                      pb-[calc(120px+env(safe-area-inset-bottom))] lg:pb-16">

        {step < 3 && <StepBar step={step} />}

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

          {/* ── LEFT: Steps ── */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">

              {/* ════ STEP 1: ADDRESS ════ */}
              {step === 1 && (
                <motion.div key="ship" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }} transition={{ type: 'spring', stiffness: 380, damping: 30 }}>

                  <h2 className="text-lg font-black text-neutral-900 mb-5">Delivery Address</h2>

                  {/* Saved addresses */}
                  <div className="space-y-3 mb-4">
                    <AnimatePresence>
                      {addresses.map(addr => {
                        const Icon = TYPE_ICONS[addr.type];
                        const active = selectedId === addr.id;
                        return (
                          <motion.div
                            key={addr.id}
                            layout
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            onClick={() => setSelectedId(addr.id)}
                            className={`relative cursor-pointer rounded-2xl border-2 p-4 transition-all
                              ${active ? 'border-black bg-white shadow-sm' : 'border-neutral-150 bg-neutral-50 hover:border-neutral-300'}`}
                          >
                            {/* Radio */}
                            <div className="flex items-start gap-3">
                              <div className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all
                                ${active ? 'border-black bg-black' : 'border-neutral-300'}`}>
                                {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>

                              <div className="flex-1 min-w-0">
                                {/* Label row */}
                                <div className="flex items-center gap-2 mb-1">
                                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0
                                    ${active ? 'bg-black' : 'bg-neutral-200'}`}>
                                    <Icon className={`w-3 h-3 ${active ? 'text-white' : 'text-neutral-500'}`} />
                                  </div>
                                  <span className="text-[12px] font-black text-neutral-900">{addr.label || addr.type}</span>
                                  {addr.isDefault && (
                                    <span className="text-[8px] font-black uppercase tracking-widest bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                                      <Star className="w-2 h-2 fill-amber-500" /> Default
                                    </span>
                                  )}
                                </div>

                                {/* Details */}
                                <p className="text-[11px] font-bold text-neutral-700">{addr.name} · {addr.phone}</p>
                                <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                                  {addr.address}, {addr.area}, {addr.city} {addr.zip}
                                </p>
                              </div>

                              {/* Action buttons */}
                              <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                                {!addr.isDefault && (
                                  <button onClick={() => setDefault(addr.id)}
                                    className="w-7 h-7 rounded-lg hover:bg-amber-50 hover:text-amber-500 text-neutral-300 flex items-center justify-center transition-colors"
                                    title="Set as default">
                                    <Star className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button onClick={() => { setEditingAddr(addr); setShowForm(true); }}
                                  className="w-7 h-7 rounded-lg hover:bg-neutral-100 text-neutral-300 hover:text-neutral-600 flex items-center justify-center transition-colors">
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => deleteAddress(addr.id)}
                                  className="w-7 h-7 rounded-lg hover:bg-red-50 text-neutral-300 hover:text-red-400 flex items-center justify-center transition-colors">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>

                  {/* Add / Edit form */}
                  <AnimatePresence>
                    {showForm && (
                      <motion.div key="form" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <AddressForm
                          initial={editingAddr ?? undefined}
                          onSave={saveAddress}
                          onCancel={() => { setShowForm(false); setEditingAddr(null); }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Add new button */}
                  {!showForm && (
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => { setEditingAddr(null); setShowForm(true); }}
                      className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-neutral-200 hover:border-black text-neutral-400 hover:text-black py-3.5 rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all mb-6"
                    >
                      <Plus className="w-4 h-4" />
                      Add New Address
                    </motion.button>
                  )}

                  {/* Order note */}
                  <div className="mb-6">
                    <label className="block text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-1.5">
                      Order Note <span className="font-medium normal-case tracking-normal">(optional)</span>
                    </label>
                    <textarea rows={2} placeholder="Special instructions, gate code, etc."
                      className="w-full px-3.5 py-3 text-[13px] font-medium text-neutral-900 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-black focus:bg-white transition-all placeholder:text-neutral-300 resize-none" />
                  </div>

                  <motion.button whileTap={{ scale: 0.98 }} onClick={() => setStep(2)}
                    disabled={!selectedId}
                    className="w-full bg-black text-white py-4 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 group disabled:opacity-40">
                    Continue to Payment
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </motion.button>
                </motion.div>
              )}

              {/* ════ STEP 2: PAYMENT ════ */}
              {step === 2 && (
                <motion.div key="pay" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }} transition={{ type: 'spring', stiffness: 380, damping: 30 }}>

                  <h2 className="text-lg font-black text-neutral-900 mb-6">Payment Method</h2>

                  {/* Gift Card Toggle */}
                  <GiftCardPayToggle />

                  {/* Selected address recap */}
                  {(() => {
                    const addr = addresses.find(a => a.id === selectedId);
                    const Icon = addr ? TYPE_ICONS[addr.type] : MapPin;
                    return addr ? (
                      <div className="flex items-start gap-3 bg-neutral-50 border border-neutral-100 rounded-2xl p-4 mb-6">
                        <div className="w-7 h-7 rounded-lg bg-neutral-200 flex items-center justify-center shrink-0">
                          <Icon className="w-3.5 h-3.5 text-neutral-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-0.5">Delivering to</p>
                          <p className="text-[12px] font-bold text-neutral-900">{addr.name}</p>
                          <p className="text-[11px] text-neutral-500">{addr.address}, {addr.area}, {addr.city}</p>
                        </div>
                        <button onClick={() => setStep(1)}
                          className="text-[9px] font-black uppercase tracking-widest text-neutral-400 hover:text-black transition-colors whitespace-nowrap flex items-center gap-1">
                          <Edit2 className="w-3 h-3" /> Change
                        </button>
                      </div>
                    ) : null;
                  })()}

                  <div className="space-y-3 mb-8">
                    {[
                      { id: 'bkash',  label: 'bKash',            sub: 'Pay with bKash mobile wallet',   color: 'bg-pink-500',    letter: 'b' },
                      { id: 'nagad',  label: 'Nagad',             sub: 'Pay with Nagad mobile wallet',   color: 'bg-orange-500',  letter: 'N' },
                      { id: 'rocket', label: 'Rocket',            sub: 'Pay with Rocket mobile banking', color: 'bg-purple-600',  letter: 'R' },
                      { id: 'cash',   label: 'Cash on Delivery',  sub: 'Pay when your order arrives',    color: 'bg-neutral-800', letter: '৳' },
                    ].map(m => (
                      <PayOpt key={m.id} id={m.id} active={pay === m.id} onClick={() => setPay(m.id)}>
                        <div className={`w-9 h-9 ${m.color} rounded-xl flex items-center justify-center shrink-0`}>
                          <span className="text-white font-black text-sm">{m.letter}</span>
                        </div>
                        <div>
                          <p className="text-[13px] font-black text-neutral-900">{m.label}</p>
                          <p className="text-[10px] text-neutral-400 font-medium">{m.sub}</p>
                        </div>
                      </PayOpt>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep(1)}
                      className="flex-1 border-2 border-neutral-200 text-neutral-600 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest hover:border-black transition-colors flex items-center justify-center gap-1.5">
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.98 }} onClick={handlePlaceOrder}
                      className="flex-[2] bg-black text-white py-4 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 group">
                      Place Order · ৳{total.toLocaleString()}
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* ════ STEP 3: SUCCESS ════ */}
              {step === 3 && (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 26 }} className="text-center py-10 lg:py-16">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
                    className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-black/20">
                    <Check className="w-9 h-9 text-white" strokeWidth={3} />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                    <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-2">Order Confirmed!</h2>
                    <p className="text-neutral-500 font-medium mb-1">Thank you for your purchase</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-300 mb-8">#AZL-2026-001234</p>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="bg-neutral-50 border border-neutral-100 rounded-2xl p-5 text-left mb-8 max-w-xs mx-auto">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="w-3.5 h-3.5 text-neutral-400" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Estimated Delivery</p>
                    </div>
                    <p className="text-base font-black text-neutral-900">3 – 5 Business Days</p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">We'll SMS you when it ships</p>
                  </motion.div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/">
                      <motion.button whileTap={{ scale: 0.97 }}
                        className="bg-black text-white px-8 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest">
                        Continue Shopping
                      </motion.button>
                    </Link>
                    <Link href="/account">
                      <motion.button whileTap={{ scale: 0.97 }}
                        className="border-2 border-neutral-200 text-neutral-700 px-8 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest hover:border-black transition-colors">
                        Track Order
                      </motion.button>
                    </Link>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── RIGHT: Summary (desktop) ── */}
          {step < 3 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="hidden lg:block w-[300px] xl:w-[320px] shrink-0 sticky top-24">
              <OrderSummary />
            </motion.div>
          )}
        </div>

        {/* Mobile summary */}
        {step < 3 && (
          <div className="lg:hidden mt-8">
            <OrderSummary />
          </div>
        )}
      </div>

      {/* Mobile sticky CTA */}
      <AnimatePresence>
        {step < 3 && (
          <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
            className="lg:hidden fixed left-0 right-0 z-40 bg-white/97 backdrop-blur-xl border-t border-neutral-100 px-4 pt-3
                       bottom-[calc(57px+env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-between mb-2.5">
              <div>
                <p className="text-[8px] font-bold uppercase tracking-widest text-neutral-400 mb-0.5">Order Total</p>
                <p className="text-lg font-black">৳{total.toLocaleString()}</p>
              </div>
              <span className="text-[8px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-1.5 rounded-full">Free Shipping</span>
            </div>
            <motion.button whileTap={{ scale: 0.98 }}
              onClick={() => step === 1 ? setStep(2) : handlePlaceOrder()}
              disabled={step === 1 && !selectedId}
              className="w-full bg-black text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 mb-3 disabled:opacity-40">
              {step === 1 ? 'Continue to Payment' : `Place Order · ৳${total.toLocaleString()}`}
              <ChevronRight className="w-3.5 h-3.5" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
