'use client';
import { motion } from 'framer-motion';
import { User, Package, Heart, Settings, LogOut, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const menuItems = [
  { icon: Package, label: 'My Orders', href: '/orders', desc: 'Track your recent orders' },
  { icon: Heart, label: 'Wishlist', href: '/wishlist', desc: 'Your saved items' },
  { icon: Settings, label: 'Settings', href: '#', desc: 'Manage your preferences' },
];

export default function AccountPage() {
  return (
    <main className="min-h-[85vh] bg-[#faf9f6] pt-24 pb-28 px-4">
      <div className="max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Profile Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 mb-6 flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center shrink-0">
              <User className="w-8 h-8 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-black">My Account</h1>
              <p className="text-sm text-neutral-500 font-medium mt-0.5">Premium Member</p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-black/5 mb-6">
            {menuItems.map((item, i) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-4 px-5 py-4 hover:bg-neutral-50 transition-colors group ${i < menuItems.length - 1 ? 'border-b border-black/5' : ''}`}
              >
                <div className="w-10 h-10 rounded-2xl bg-black/5 flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-all">
                  <item.icon className="w-5 h-5 text-black group-hover:text-white transition-colors" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-black">{item.label}</p>
                  <p className="text-xs text-neutral-400 font-medium">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-black transition-colors" />
              </Link>
            ))}
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Link href="/shipping" className="bg-white rounded-2xl p-4 border border-black/5 shadow-sm hover:shadow-md transition-all text-center group">
              <p className="text-xs font-black uppercase tracking-widest text-black/40 group-hover:text-black transition-colors">Shipping</p>
              <p className="text-sm font-bold text-black mt-1">Policy</p>
            </Link>
            <Link href="/returns" className="bg-white rounded-2xl p-4 border border-black/5 shadow-sm hover:shadow-md transition-all text-center group">
              <p className="text-xs font-black uppercase tracking-widest text-black/40 group-hover:text-black transition-colors">Returns</p>
              <p className="text-sm font-bold text-black mt-1">Policy</p>
            </Link>
          </div>

          {/* Sign Out */}
          <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border border-red-100 text-red-400 hover:bg-red-50 transition-all font-bold text-sm tracking-tight">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </motion.div>
      </div>
    </main>
  );
}
