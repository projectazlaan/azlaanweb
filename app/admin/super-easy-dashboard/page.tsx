'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  ShoppingCart,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Zap,
  Bell,
  ChevronRight,
  Eye
} from 'lucide-react';
import Link from 'next/link';
interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  salesChange: number;
  ordersChange: number;
  customersChange: number;
  productsChange: number;
  pendingOrders: number;
}
const statCards = [
  { key: 'totalSales', label: 'Total Sales', icon: DollarSign, color: 'bg-emerald-500', prefix: '৳' },
  { key: 'totalOrders', label: 'Total Orders', icon: ShoppingCart, color: 'bg-blue-500', prefix: '' },
  { key: 'totalCustomers', label: 'Customers', icon: Users, color: 'bg-purple-500', prefix: '' },
  { key: 'totalProducts', label: 'Products', icon: Package, color: 'bg-orange-500', prefix: '' },
];
const quickActions = [
  { label: 'Add New Product', desc: 'Create a new product listing', icon: Package, href: '/admin/super-easy-dashboard/products', color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Flash Sale', desc: 'Toggle or configure flash sale', icon: Zap, href: '/admin/super-easy-dashboard/flash-sale', color: 'bg-red-50 text-red-600' },
  { label: 'Live Editor', desc: 'Edit site visually', icon: Eye, href: '/admin/super-easy-dashboard/editor', color: 'bg-purple-50 text-purple-600' },
  { label: 'View Orders', desc: 'Check recent orders', icon: ShoppingCart, href: '/admin/super-easy-dashboard/orders', color: 'bg-blue-50 text-blue-600' },
];
export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Fetch stats
    fetch('/api/admin/dashboard-stats')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) setStats(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
    // Fetch recent orders
    fetch('/api/admin/orders')
      .then(res => res.json())
      .then(data => {
        // Assume data returns an array of orders from the API we built earlier
        setRecentOrders(Array.isArray(data) ? data.slice(0, 5) : []);
      })
      .catch(console.error);
  }, []);
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  const getChangeValue = (key: string) => {
    if (!stats) return 0;
    const changeKey = key.replace('total', '').toLowerCase() + 'Change';
    return (stats as any)[changeKey] || 0;
  };
  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-gray-200"
      >
        <div className="relative z-10">
          <h1 className="text-4xl font-black mb-2 tracking-tight">Welcome back! 👋</h1>
          <p className="text-gray-300 text-lg font-medium">
            Your store is performing great today. You have <span className="text-white font-bold">{stats?.pendingOrders || 0} new orders</span> pending.
          </p>
        </div>
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-white/5 to-transparent" />
        <Bell className="absolute right-10 top-10 text-white/10 w-32 h-32 rotate-12" />
      </motion.div>
      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statCards.map((stat) => {
          const change = getChangeValue(stat.key);
          return (
            <motion.div
              key={stat.key}
              variants={itemVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="bg-white rounded-[2rem] p-7 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-5">
                <div className={`w-14 h-14 ${stat.color} rounded-[1.25rem] flex items-center justify-center text-white shadow-lg`}>
                  <stat.icon size={28} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-black px-3 py-1.5 rounded-full ${
                  change >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                }`}>
                  {change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {Math.abs(change)}%
                </div>
              </div>
              <p className="text-gray-400 text-xs uppercase tracking-widest font-black mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-gray-900 tracking-tight">
                {stat.prefix}{loading ? '...' : (stats as any)[stat.key]?.toLocaleString()}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-6 px-2">
          <h3 className="text-sm uppercase tracking-widest text-gray-400 font-black">Quick Actions</h3>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href}>
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-[2rem] p-7 border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className={`w-14 h-14 ${action.color} rounded-[1.25rem] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                  <action.icon size={28} />
                </div>
                <h4 className="font-black text-gray-900 text-lg mb-1">{action.label}</h4>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">{action.desc}</p>
                <div className="mt-5 flex items-center text-gray-900 font-bold text-xs">
                  Get Started <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
      {/* Recent Orders + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-gray-900">Recent Orders</h3>
              <p className="text-sm text-gray-400 mt-1 font-medium">Latest customer activity</p>
            </div>
            <Link href="/admin/super-easy-dashboard/orders">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm font-black text-gray-900 bg-gray-50 border border-gray-100 px-6 py-3 rounded-2xl hover:bg-gray-100 transition-all shadow-sm"
              >
                View All Orders
              </motion.button>
            </Link>
          </div>
          <div className="space-y-4">
            {recentOrders.length === 0 && !loading ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                  <ShoppingCart size={32} />
                </div>
                <p className="text-gray-400 font-bold">No recent orders found</p>
              </div>
            ) : (
              recentOrders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-5 rounded-[1.5rem] bg-gray-50/50 hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-900 font-black text-lg shadow-sm border border-gray-100">
                      {order.customer_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-black text-gray-900">{order.customer_name}</p>
                      <p className="text-xs text-gray-500 font-bold mt-0.5">{order.phone} • {new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-black text-gray-900">৳{order.total?.toLocaleString()}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Total Amount</p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black min-w-[100px] text-center shadow-sm ${
                      order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' :
                      order.status === 'shipped' ? 'bg-blue-50 text-blue-600' :
                      order.status === 'packing' ? 'bg-amber-50 text-amber-600' :
                      'bg-red-50 text-red-600'
                    }`}>
                      {order.status?.toUpperCase()}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
            {loading && [...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-50 rounded-[1.5rem] animate-pulse" />
            ))}
          </div>
        </motion.div>
        {/* Live Site Mini Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-black text-gray-900">Store Front</h3>
              <p className="text-sm text-gray-400 mt-1 font-medium">Live Preview</p>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Live Now</span>
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            </div>
          </div>
          <div className="relative rounded-[2rem] overflow-hidden bg-gray-100 flex-1 border border-gray-200 shadow-inner group min-h-[400px]">
            <iframe
              src="/"
              className="w-[200%] h-[200%] origin-top-left scale-50 border-none pointer-events-none grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
              <h4 className="text-white font-black text-lg mb-2">Visual Editor</h4>
              <p className="text-gray-300 text-xs font-medium mb-6 leading-relaxed">Customize your website's look and feel with our easy-to-use visual editor. No coding required.</p>
              <Link href="/admin/super-easy-dashboard/editor" className="w-full">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-white text-gray-900 rounded-2xl font-black text-sm hover:bg-gray-50 transition-all shadow-xl flex items-center justify-center gap-2"
                >
                  <Eye size={18} /> Edit Your Store
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
