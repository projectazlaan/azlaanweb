'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Download,
  MousePointer2,
  Package
} from 'lucide-react';

const salesData = [3200, 4500, 3800, 5200, 4800, 6100, 5800, 7200, 6800, 8500, 7900, 9200];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function AnalyticsPage() {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const maxVal = Math.max(...salesData);
  const minVal = Math.min(...salesData);

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Analytics</h1>
          <p className="text-gray-400 font-medium mt-1">Real-time performance insights and sales growth.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white p-1.5 rounded-2xl border border-gray-100 flex items-center gap-1 shadow-sm">
            {['7D', '1M', '3M', '1Y', 'ALL'].map(t => (
              <button key={t} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                t === '1M' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'
              }`}>{t}</button>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3.5 bg-gray-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-gray-900/20"
          >
            <Download size={18} /> Export Report
          </motion.button>
        </div>
      </div>

      {/* Main Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Sales Overview</p>
            <h2 className="text-3xl font-black text-gray-900">৳{salesData.reduce((a, b) => a + b, 0).toLocaleString()}</h2>
          </div>
          <div className="flex items-center gap-6 text-right">
            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Conversion Rate</p>
              <p className="text-xl font-black text-emerald-500">4.2%</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">AVG. Order Value</p>
              <p className="text-xl font-black text-blue-500">৳2,450</p>
            </div>
          </div>
        </div>

        {/* Custom SVG Line Chart */}
        <div className="h-[400px] w-full relative pt-10">
          <svg className="w-full h-full overflow-visible">
            {/* Grids */}
            {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
              <line
                key={i}
                x1="0"
                y1={400 - p * 400}
                x2="100%"
                y2={400 - p * 400}
                stroke="#F3F4F6"
                strokeWidth="1"
              />
            ))}

            {/* Area */}
            <motion.path
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 1, pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              d={`
                M 0 400
                ${salesData.map((val, i) => (
                  `L ${(i / (salesData.length - 1)) * 100}% ${400 - (val / maxVal) * 350}`
                )).join(' ')}
                L 100% 400
                Z
              `}
              fill="url(#gradient)"
              opacity="0.1"
            />

            {/* Line */}
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              d={`
                M 0 ${400 - (salesData[0] / maxVal) * 350}
                ${salesData.map((val, i) => (
                  `L ${(i / (salesData.length - 1)) * 100}% ${400 - (val / maxVal) * 350}`
                )).join(' ')}
              `}
              fill="none"
              stroke="#111827"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Points */}
            {salesData.map((val, i) => (
              <g key={i}>
                <motion.circle
                  initial={{ r: 0 }}
                  animate={{ r: hoveredPoint === i ? 8 : 4 }}
                  cx={`${(i / (salesData.length - 1)) * 100}%`}
                  cy={400 - (val / maxVal) * 350}
                  fill={hoveredPoint === i ? "#111827" : "#FFFFFF"}
                  stroke="#111827"
                  strokeWidth="3"
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredPoint(i)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </g>
            ))}

            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#111827" />
                <stop offset="100%" stopColor="#FFFFFF" />
              </linearGradient>
            </defs>
          </svg>

          {/* Labels */}
          <div className="flex justify-between mt-6 px-2">
            {months.map((m, i) => (
              <span key={m} className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{m}</span>
            ))}
          </div>

          {/* Tooltip */}
          {hoveredPoint !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="absolute bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl z-20 pointer-events-none"
              style={{
                left: `${(hoveredPoint / (salesData.length - 1)) * 100}%`,
                top: 400 - (salesData[hoveredPoint] / maxVal) * 350 - 60,
                transform: 'translateX(-50%)'
              }}
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{months[hoveredPoint]}</p>
              <p className="text-sm font-black">৳{salesData[hoveredPoint].toLocaleString()}</p>
              <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 rotate-45" />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Sales', value: '৳1,24,500', change: '+12.5%', icon: DollarSign, color: 'bg-emerald-500', up: true },
          { label: 'Total Orders', value: '1,450', change: '+8.2%', icon: ShoppingCart, color: 'bg-blue-500', up: true },
          { label: 'Customers', value: '890', change: '-2.4%', icon: Users, color: 'bg-purple-500', up: false },
          { label: 'Site Visits', value: '45,200', change: '+15.1%', icon: MousePointer2, color: 'bg-orange-500', up: true },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-[2rem] p-7 border border-gray-100 shadow-sm"
          >
            <div className="flex items-start justify-between mb-5">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black px-3 py-1.5 rounded-full ${
                stat.up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
              }`}>
                {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change}
              </div>
            </div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Products */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-gray-900">Top Performing Products</h3>
            <button className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors">View Details</button>
          </div>
          <div className="space-y-6">
            {[
              { name: 'Premium Blue Panjabi', sales: 145, price: 2450, trend: '+15%' },
              { name: 'Casual White Shirt', sales: 112, price: 1850, trend: '+8%' },
              { name: 'Black Leather Sandal', sales: 98, price: 1250, trend: '-2%' },
              { name: 'Traditional Dhoti', sales: 85, price: 950, trend: '+12%' },
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-gray-900 font-black text-lg shadow-sm">
                      {i + 1}
                    </div>
                    <div>
                       <p className="font-black text-gray-900">{p.name}</p>
                       <p className="text-xs text-gray-400 font-bold mt-0.5">{p.sales} Sales • ৳{p.price}</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="font-black text-emerald-500">{p.trend}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Trend</p>
                 </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black text-gray-900 mb-8">Category Sales</h3>
          <div className="space-y-8">
            {[
              { label: 'Men', percent: 65, color: 'bg-blue-500' },
              { label: 'Women', percent: 25, color: 'bg-purple-500' },
              { label: 'Kids', percent: 10, color: 'bg-orange-500' },
            ].map((cat, i) => (
              <div key={i} className="space-y-3">
                 <div className="flex justify-between items-center px-1">
                    <p className="text-sm font-black text-gray-900">{cat.label}</p>
                    <p className="text-sm font-black text-gray-900">{cat.percent}%</p>
                 </div>
                 <div className="h-3 bg-gray-50 rounded-full overflow-hidden shadow-inner border border-gray-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.percent}%` }}
                      transition={{ duration: 1, delay: i * 0.2 }}
                      className={`h-full ${cat.color} rounded-full shadow-lg`}
                    />
                 </div>
              </div>
            ))}
          </div>
          <div className="mt-12 p-6 bg-gray-900 rounded-3xl text-white">
             <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Pro Tip</p>
             <p className="text-xs font-medium leading-relaxed">Men's category is showing high demand this month. Consider launching a <span className="text-white font-black underline">Flash Sale</span> to boost revenue.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
