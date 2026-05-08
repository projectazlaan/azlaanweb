'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Image as ImageIcon,
  Settings,
  Zap,
  Tag,
  Users,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Globe,
  Eye,
  BarChart3,
  Bell
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/super-easy-dashboard', color: 'bg-blue-500' },
  { icon: Eye, label: 'Live Editor', href: '/admin/super-easy-dashboard/editor', color: 'bg-purple-500' },
  { icon: Package, label: 'Products', href: '/admin/super-easy-dashboard/products', color: 'bg-emerald-500' },
  { icon: ShoppingBag, label: 'Orders', href: '/admin/super-easy-dashboard/orders', color: 'bg-orange-500' },
  { icon: Zap, label: 'Flash Sale', href: '/admin/super-easy-dashboard/flash-sale', color: 'bg-red-500' },
  { icon: Tag, label: 'Promo Codes', href: '/admin/super-easy-dashboard/promos', color: 'bg-pink-500' },
  { icon: ImageIcon, label: 'Homepage', href: '/admin/super-easy-dashboard/homepage', color: 'bg-indigo-500' },
  { icon: Users, label: 'Customers', href: '/admin/super-easy-dashboard/customers', color: 'bg-cyan-500' },
  { icon: Globe, label: 'Media Library', href: '/admin/super-easy-dashboard/media', color: 'bg-amber-500' },
  { icon: BarChart3, label: 'Analytics', href: '/admin/super-easy-dashboard/analytics', color: 'bg-blue-600' },
  { icon: Bell, label: 'Notifications', href: '/admin/super-easy-dashboard/notifications', color: 'bg-red-600' },
  { icon: Settings, label: 'Settings', href: '/admin/super-easy-dashboard/settings', color: 'bg-gray-500' },
];
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-full w-[280px] bg-white border-r border-gray-100 z-50 flex flex-col shadow-sm"
          >
            {/* Logo */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center">
                  <span className="text-white font-black text-lg">A</span>
                </div>
                <div>
                  <h1 className="font-black text-gray-900 text-lg tracking-tight">AZLAAN</h1>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Admin Panel</p>
                </div>
              </div>
            </div>
            {/* Menu */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                        isActive 
                          ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20' 
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                      <span className="font-medium text-sm">{item.label}</span>
                      {isActive && <ChevronRight size={16} className="ml-auto opacity-50" />}
                    </motion.div>
                  </Link>
                );
              })}
            </nav>
            {/* Bottom */}
            <div className="p-4 border-t border-gray-100">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-50 transition-colors font-medium text-sm"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </motion.button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-[280px]' : 'ml-0'}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
            <div>
              <h2 className="font-bold text-gray-900">
                {menuItems.find(m => m.href === pathname)?.label || 'Dashboard'}
              </h2>
              <p className="text-xs text-gray-400">Manage your store easily</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" target="_blank">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-2xl font-medium text-sm hover:bg-gray-800 transition-colors"
              >
                <Eye size={16} />
                View Live Site
              </motion.button>
            </Link>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-white font-bold text-sm">
              AD
            </div>
          </div>
        </header>
        {/* Page Content */}
        <main className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
