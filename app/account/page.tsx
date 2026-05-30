'use client';
import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useCartStore } from '@/store/cartStore';
import { Product } from '@/types';
import {
  User, Package, Heart, CreditCard, MapPin, Settings, LogOut,
  ChevronRight, Gift, CheckCircle, Clock, Truck, Plus, Edit2, 
  Trash2, ArrowRight, Sparkles, Star, Loader2, X
} from 'lucide-react';

/* ════════════════════════ MOCK INITIAL DATA ════════════════════════ */
const USER = {
  name: 'Azlaan Rahman',
  email: 'azlaan@example.com',
  phone: '01712345678',
  tier: 'Platinum Member',
  points: 12500,
};

const ORDERS = [
  {
    id: '#AZL-2026-001234',
    date: 'Oct 24, 2026',
    total: 8620,
    status: 'shipped', // pending, shipped, delivered
    items: [
      { name: 'Premium Cotton Panjabi', qty: 1, image: '/media-pro/men/Design 1/649824908_122120770023151981_1372810042799937270_n.webp' }
    ]
  },
  {
    id: '#AZL-2026-000982',
    date: 'Sep 12, 2026',
    total: 14500,
    status: 'delivered',
    items: [
      { name: 'Elegant Evening Dress', qty: 1, image: '/media-pro/women/Design 1/673191812_122125962327151981_8385571386878315506_n.webp' },
      { name: 'Classic Kurta', qty: 1, image: '/media-pro/men/Design 5/650905571_122120824035151981_4320891712881698677_n.webp' }
    ]
  }
];

const INITIAL_WISHLIST = [
  { id: 101, name: 'Signature Silk Saree', price: 12000, image: '/media-pro/women/Design 2/672121181_122125885095151981_7790861692313383598_n.webp' },
  { id: 102, name: 'Kids Festive Panjabi', price: 3500, image: '/media-pro/cover/cover 3.jpg' },
];

const INITIAL_ADDRESSES = [
  { id: 1, label: 'Home', name: 'Azlaan Rahman', phone: '01712345678', address: 'House 12, Road 5, Block A, Gulshan, Dhaka 1212', isDefault: true }
];

/* ════════════════════════ TABS CONFIG ════════════════════════ */
const TABS = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'giftcards', label: 'Gift Cards & Loyalty', icon: Gift },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'profile', label: 'Profile Settings', icon: Settings },
];

/* ════════════════════════ SUB-COMPONENTS ════════════════════════ */

function OverviewTab({ setTab, gcBalance }: { setTab: (t: string) => void, gcBalance: number }) {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-black text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl shadow-black/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Welcome Back</p>
            <h2 className="text-2xl md:text-3xl font-black">{USER.name}</h2>
            <div className="flex items-center gap-2 mt-3">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-1.5">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {USER.tier}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-5 hover:border-black/10 transition-colors cursor-pointer" onClick={() => setTab('giftcards')}>
          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
            <Star className="w-4 h-4 fill-amber-500" />
          </div>
          <p className="text-xl font-black text-black">{USER.points.toLocaleString()}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mt-1">Loyalty Points</p>
        </div>
        <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-5 hover:border-black/10 transition-colors cursor-pointer" onClick={() => setTab('giftcards')}>
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
            <Gift className="w-4 h-4" />
          </div>
          <p className="text-xl font-black text-black">৳{gcBalance.toLocaleString()}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mt-1">Gift Card Bal</p>
        </div>
        <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-5 hidden lg:block hover:border-black/10 transition-colors cursor-pointer" onClick={() => setTab('orders')}>
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
            <Package className="w-4 h-4" />
          </div>
          <p className="text-xl font-black text-black">{ORDERS.length}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mt-1">Total Orders</p>
        </div>
      </div>

      {/* Recent Order Shortcut */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-black uppercase tracking-widest text-black">Most Recent Order</h3>
          <button onClick={() => setTab('orders')} className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-black transition-colors flex items-center gap-1">
            View All <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-20 rounded-xl bg-neutral-100 overflow-hidden relative shrink-0">
            <Image src={ORDERS[0].items[0].image} alt="Order" fill className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-black mb-1">{ORDERS[0].id}</p>
            <p className="text-[10px] text-neutral-500 mb-2">Placed on {ORDERS[0].date}</p>
            <div className="flex items-center gap-2">
              <span className="bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                <Truck className="w-3 h-3" /> In Transit
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrdersTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-black text-black mb-6">Order History</h2>
      {ORDERS.map((order) => (
        <div key={order.id} className="bg-white border border-neutral-200 rounded-3xl overflow-hidden">
          <div className="bg-neutral-50 px-5 py-4 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-0.5">Order Number</p>
              <p className="text-sm font-bold text-black">{order.id}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-0.5">Date Placed</p>
              <p className="text-sm font-bold text-black">{order.date}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-0.5">Total Amount</p>
              <p className="text-sm font-bold text-black">৳{order.total.toLocaleString()}</p>
            </div>
            <div>
              <button 
                onClick={() => toast('Invoice download started', { icon: '📄' })}
                className="text-[10px] font-black uppercase tracking-widest text-black border border-black/10 hover:border-black px-4 py-2 rounded-full transition-colors"
              >
                View Invoice
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="px-5 py-6 border-b border-neutral-100">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-neutral-100 rounded-full" />
              <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-black rounded-full transition-all duration-1000 ${order.status === 'delivered' ? 'w-full' : order.status === 'shipped' ? 'w-1/2' : 'w-[10%]'}`} />
              
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.status !== 'pending' ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-400'}`}>
                  <Package className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest hidden sm:block">Processing</span>
              </div>
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.status === 'shipped' || order.status === 'delivered' ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-400'}`}>
                  <Truck className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest hidden sm:block">Shipped</span>
              </div>
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.status === 'delivered' ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-400'}`}>
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest hidden sm:block">Delivered</span>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-16 h-20 rounded-xl bg-neutral-100 overflow-hidden relative shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-bold text-black">{item.name}</p>
                  <p className="text-[11px] text-neutral-500 mt-1">Qty: {item.qty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function GiftCardsTab({ gcBalance, setGcBalance }: { gcBalance: number, setGcBalance: (val: number) => void }) {
  const [code, setCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);

  const handleRedeem = () => {
    if (code.length < 5) {
      toast.error('Please enter a valid code');
      return;
    }
    setIsRedeeming(true);
    setTimeout(() => {
      setGcBalance(gcBalance + 1000); // Simulate adding 1000 Taka
      setCode('');
      setIsRedeeming(false);
      toast.success('Successfully redeemed ৳1,000!');
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-black text-black">Gift Cards & Loyalty</h2>

      <div className="relative w-full max-w-md mx-auto sm:mx-0 aspect-[1.6/1] bg-black rounded-[2rem] p-6 sm:p-8 text-white overflow-hidden shadow-2xl shadow-black/20 group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Azlaan Gift Card</span>
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 mb-1">Available Balance</p>
            <motion.p key={gcBalance} initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-4xl sm:text-5xl font-black tracking-tight">
              ৳{gcBalance.toLocaleString()}
            </motion.p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-6">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
            <Gift className="w-5 h-5 text-black" />
          </div>
          <h3 className="text-sm font-black uppercase tracking-widest text-black mb-2">Redeem a Gift Card</h3>
          <p className="text-[11px] text-neutral-500 mb-4">Enter your 16-digit code below to add funds to your balance.</p>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="XXXX-XXXX-XXXX-XXXX" 
              className="flex-1 min-w-0 bg-white border border-neutral-200 rounded-xl px-4 py-3 text-[13px] font-bold tracking-widest placeholder:text-neutral-300 focus:outline-none focus:border-black transition-colors uppercase"
            />
            <button 
              onClick={handleRedeem}
              disabled={isRedeeming}
              className="bg-black text-white px-6 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black/90 transition-colors disabled:opacity-70 flex items-center justify-center"
            >
              {isRedeeming ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Redeem'}
            </button>
          </div>
        </div>

        <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-6 flex flex-col justify-center items-start">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
            <CreditCard className="w-5 h-5 text-black" />
          </div>
          <h3 className="text-sm font-black uppercase tracking-widest text-black mb-2">Buy a Gift Card</h3>
          <p className="text-[11px] text-neutral-500 mb-5">The perfect gift for any occasion. Send a digital gift card instantly via email.</p>
          <Link href="/gift-cards" className="w-full">
            <button className="bg-white border-2 border-black text-black px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-colors w-full flex items-center justify-center gap-2">
              Purchase Now <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function WishlistTab() {
  const [wishlist, setWishlist] = useState(INITIAL_WISHLIST);
  const addItem = useCartStore(state => state.addItem);

  const handleMoveToBag = (item: any) => {
    // Create a mock product object to satisfy the cart store
    const product: Product = {
      id: String(item.id),
      name: item.name,
      slug: item.name.toLowerCase().replace(/\s+/g, '-'),
      price: item.price,
      originalPrice: item.price,
      images: [item.image],
      categorySlug: 'general',
      rating: 5,
      reviewCount: 10,
      isInStock: true,
      stockCount: 100,
      sizes: ['M'],
      colors: [{ name: 'Default', value: '#000000' }],
    };
    
    addItem(product, 1, 'M', 'Default');
    setWishlist(wishlist.filter(w => w.id !== item.id));
    toast.success(`${item.name} moved to Bag!`);
  };

  const handleRemove = (id: number) => {
    setWishlist(wishlist.filter(w => w.id !== id));
    toast('Item removed from wishlist', { icon: '🗑️' });
  };

  if (wishlist.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-black text-black mb-6">My Wishlist</h2>
        <div className="py-20 text-center text-neutral-400">
          <Heart className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="text-sm font-bold">Your wishlist is empty.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-black text-black mb-6">My Wishlist</h2>
      <AnimatePresence>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {wishlist.map(item => (
            <motion.div 
              key={item.id} 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group bg-white p-3 border border-neutral-100 rounded-3xl shadow-sm"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100 mb-3">
                <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <button 
                  onClick={() => handleRemove(item.id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
              <p className="text-[11px] font-bold text-black truncate px-1">{item.name}</p>
              <p className="text-[12px] font-black text-neutral-600 mt-0.5 px-1">৳{item.price.toLocaleString()}</p>
              <button 
                onClick={() => handleMoveToBag(item)}
                className="w-full mt-3 bg-black text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black/90 transition-colors"
              >
                Move to Bag
              </button>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}

function AddressesTab() {
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);
  const [showForm, setShowForm] = useState(false);

  const handleDelete = (id: number) => {
    setAddresses(addresses.filter(a => a.id !== id));
    toast.success('Address deleted');
  };

  const handleSetDefault = (id: number) => {
    setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
    toast.success('Default address updated');
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddress = {
      id: Date.now(),
      label: 'Other',
      name: 'Azlaan Rahman',
      phone: '01712345678',
      address: 'New St, Block B, Dhaka',
      isDefault: addresses.length === 0
    };
    setAddresses([...addresses, newAddress]);
    setShowForm(false);
    toast.success('Address saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-black">Saved Addresses</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-black bg-neutral-100 hover:bg-neutral-200 px-4 py-2 rounded-full transition-colors"
        >
          {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />} 
          {showForm ? 'Cancel' : 'Add New'}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddSubmit}
            className="bg-neutral-50 border border-neutral-200 rounded-3xl p-6 overflow-hidden mb-6"
          >
            <h3 className="text-sm font-black uppercase tracking-widest text-black mb-4">Add New Address</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="Full Name" required className="bg-white border border-neutral-200 rounded-xl px-4 py-3 text-[13px] font-bold focus:outline-none focus:border-black" />
              <input type="text" placeholder="Phone Number" required className="bg-white border border-neutral-200 rounded-xl px-4 py-3 text-[13px] font-bold focus:outline-none focus:border-black" />
              <div className="sm:col-span-2">
                <textarea placeholder="Full Street Address" required className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-[13px] font-bold focus:outline-none focus:border-black min-h-[80px]" />
              </div>
            </div>
            <button type="submit" className="bg-black text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">
              Save Address
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {addresses.map(addr => (
            <motion.div 
              key={addr.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`border-2 rounded-3xl p-5 relative ${addr.isDefault ? 'border-black bg-white shadow-md' : 'border-neutral-200 bg-neutral-50'}`}
            >
              <div className="absolute top-5 right-5 flex gap-2">
                <button onClick={() => toast('Edit mode coming soon!')} className="text-neutral-400 hover:text-black transition-colors"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(addr.id)} className="text-neutral-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-black text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">{addr.label}</span>
                {addr.isDefault ? (
                  <span className="bg-amber-100 text-amber-600 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md flex items-center gap-1"><Star className="w-2.5 h-2.5 fill-amber-500" /> Default</span>
                ) : (
                  <button onClick={() => handleSetDefault(addr.id)} className="text-[9px] font-black uppercase tracking-widest text-neutral-400 hover:text-black transition-colors">Set Default</button>
                )}
              </div>
              <p className="text-sm font-bold text-black mb-1">{addr.name} · {addr.phone}</p>
              <p className="text-[12px] text-neutral-500 leading-relaxed">{addr.address}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ProfileTab() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Profile settings updated successfully!');
    }, 1200);
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-3xl pb-10">
      <h2 className="text-xl font-black text-black">Profile Settings</h2>
      
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 pb-3">Personal Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Full Name</label>
            <input type="text" defaultValue={USER.name} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3.5 text-[13px] font-bold focus:outline-none focus:border-black focus:bg-white transition-colors" />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Phone Number</label>
            <input type="tel" defaultValue={USER.phone} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3.5 text-[13px] font-bold focus:outline-none focus:border-black focus:bg-white transition-colors" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Email Address</label>
            <input type="email" defaultValue={USER.email} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3.5 text-[13px] font-bold focus:outline-none focus:border-black focus:bg-white transition-colors" />
          </div>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-8">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-black flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" /> AI Size Profile
          </h3>
          <p className="text-[11px] text-neutral-500 mt-1">Provide your measurements for highly accurate, AI-driven size recommendations.</p>
        </div>
        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 pb-2">Body Metrics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Height (cm)</label>
              <input type="number" placeholder="e.g. 175" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-[13px] font-bold focus:outline-none focus:border-black" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Weight (kg)</label>
              <input type="number" placeholder="e.g. 70" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-[13px] font-bold focus:outline-none focus:border-black" />
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Body Shape</label>
              <select className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-[13px] font-bold focus:outline-none focus:border-black appearance-none">
                <option value="">Select Shape</option>
                <option>Slim / Slender</option>
                <option>Athletic / Muscular</option>
                <option>Average / Medium</option>
                <option>Curvy / Broad</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          type="submit"
          disabled={isSaving}
          className="bg-black text-white px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black/90 transition-colors shadow-lg shadow-black/20 flex items-center gap-2 disabled:opacity-70"
        >
          {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSaving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </form>
  );
}

/* ════════════════════════ DASHBOARD COMPONENT ════════════════════════ */

function AccountDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  // Shared global state for the dashboard (mock)
  const [gcBalance, setGcBalance] = useState(5000);

  // Initialize active tab from URL or fallback
  const [activeTab, setActiveTab] = useState(tabParam || 'overview');

  // Update URL when tab changes internally
  const handleTabChange = (id: string) => {
    setActiveTab(id);
    router.push(`/account?tab=${id}`, { scroll: false });
  };

  // Sync state if URL changes externally
  useEffect(() => {
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const renderContent = () => {
    switch(activeTab) {
      case 'overview': return <OverviewTab setTab={handleTabChange} gcBalance={gcBalance} />;
      case 'orders': return <OrdersTab />;
      case 'giftcards': return <GiftCardsTab gcBalance={gcBalance} setGcBalance={setGcBalance} />;
      case 'wishlist': return <WishlistTab />;
      case 'addresses': return <AddressesTab />;
      case 'profile': return <ProfileTab />;
      default: return <OverviewTab setTab={handleTabChange} gcBalance={gcBalance} />;
    }
  };

  return (
    <div className="min-h-screen bg-white pt-4 md:pt-10 pb-28 md:pb-12">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 flex flex-col md:flex-row gap-6 lg:gap-12 items-start">
        
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-full md:w-64 lg:w-72 shrink-0 md:sticky md:top-28">
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-black mb-8 px-4">My Account</h1>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group ${
                  activeTab === tab.id ? 'bg-black text-white shadow-lg shadow-black/10' : 'hover:bg-neutral-50 text-neutral-500 hover:text-black'
                }`}
              >
                <div className="flex items-center gap-3">
                  <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : 'text-neutral-400 group-hover:text-black'}`} />
                  <span className="text-[11px] font-black uppercase tracking-widest">{tab.label}</span>
                </div>
                {activeTab === tab.id && <ChevronRight className="w-4 h-4" />}
              </button>
            ))}
            
            <div className="pt-8 mt-8 border-t border-neutral-100 px-4">
              <button onClick={() => toast('Signed out successfully')} className="flex items-center gap-3 text-red-500 hover:text-red-600 transition-colors">
                <LogOut className="w-4 h-4" />
                <span className="text-[11px] font-black uppercase tracking-widest">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Button Grid Nav (Mobile) */}
        <div className="w-full md:hidden mb-2 grid grid-cols-3 gap-2">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            const shortLabel = tab.id === 'giftcards' ? 'Gift Cards' : tab.id === 'profile' ? 'Settings' : tab.label;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl transition-all active:scale-95 ${
                  isActive 
                    ? 'bg-black text-white shadow-md shadow-black/10' 
                    : 'bg-white border border-neutral-200 text-neutral-500 hover:border-black'
                }`}
              >
                <tab.icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.5} />
                <span className="text-[9px] font-black uppercase tracking-widest text-center leading-tight">
                  {shortLabel}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 w-full min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

/* ════════════════════════ MAIN EXPORT ════════════════════════ */

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    }>
      <AccountDashboardContent />
    </Suspense>
  );
}
