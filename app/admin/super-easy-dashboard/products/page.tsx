'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Grid,
  List,
  MoreVertical,
  Edit3,
  Trash2,
  Eye,
  Archive,
  ArrowUpRight,
  Package,
  TrendingUp,
  AlertCircle,
  X,
  Check,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  sale_price?: number;
  stock: number;
  category: string;
  image: string;
  status: 'active' | 'draft' | 'out_of_stock';
  created_at: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data || []);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Header & Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Products</h1>
          <p className="text-gray-400 font-medium mt-1">Manage your inventory and showcase your best items.</p>
        </div>
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/20"
          >
            <Plus size={20} /> Add New Product
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Products', value: products.length, icon: Package, color: 'bg-blue-500' },
          { label: 'Low Stock', value: products.filter(p => p.stock < 10).length, icon: AlertCircle, color: 'bg-amber-500' },
          { label: 'Best Sellers', value: 12, icon: TrendingUp, color: 'bg-emerald-500' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex items-center gap-6"
          >
            <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900 mt-0.5">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="relative flex-1 w-full md:max-w-md">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-gray-200 focus:bg-white transition-all outline-none text-sm font-bold"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1 bg-gray-50 rounded-2xl p-1.5 border border-gray-100">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-400'}`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-400'}`}
            >
              <List size={20} />
            </button>
          </div>
          <button className="flex items-center gap-2 px-6 py-4 bg-gray-50 text-gray-600 rounded-2xl font-black text-xs hover:bg-gray-100 transition-all border border-gray-100">
            <Filter size={18} /> Filters
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <AnimatePresence>
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all group relative"
              >
                <div className="aspect-[4/5] relative overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-gray-900 shadow-xl opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Edit3 size={18} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-red-500 shadow-xl opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  </div>
                  {product.stock < 10 && (
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-red-500 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                        <AlertCircle size={12} /> Low Stock
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{product.category}</p>
                  <h3 className="font-black text-gray-900 truncate mb-4">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-black text-gray-900">৳{product.price}</p>
                      {product.sale_price && (
                        <p className="text-xs text-gray-400 line-through font-bold">৳{product.sale_price}</p>
                      )}
                    </div>
                    <div className="text-right">
                       <p className={`text-xs font-black ${product.stock > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                         {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                       </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left p-6 text-[10px] text-gray-400 font-black uppercase tracking-widest">Product</th>
                <th className="text-left p-6 text-[10px] text-gray-400 font-black uppercase tracking-widest">Category</th>
                <th className="text-left p-6 text-[10px] text-gray-400 font-black uppercase tracking-widest">Price</th>
                <th className="text-left p-6 text-[10px] text-gray-400 font-black uppercase tracking-widest">Stock</th>
                <th className="text-left p-6 text-[10px] text-gray-400 font-black uppercase tracking-widest">Status</th>
                <th className="text-right p-6 text-[10px] text-gray-400 font-black uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <img src={product.image} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-black text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-400 font-bold mt-0.5">ID: {product.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-black uppercase tracking-widest">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-6 font-black text-gray-900">৳{product.price}</td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
                       <span className="font-black text-gray-700">{product.stock}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      product.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button whileHover={{ scale: 1.1 }} className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-600 shadow-sm">
                        <Edit3 size={18} />
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.1 }} className="p-2.5 bg-white border border-gray-100 rounded-xl text-red-500 shadow-sm">
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <p className="text-sm text-gray-400 font-bold">Showing <span className="text-gray-900">10</span> of <span className="text-gray-900">{products.length}</span> products</p>
        <div className="flex items-center gap-2">
           <button className="w-12 h-12 flex items-center justify-center bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 transition-colors shadow-sm">
             <ChevronLeft size={20} />
           </button>
           {[1, 2, 3].map(p => (
             <button key={p} className={`w-12 h-12 flex items-center justify-center rounded-2xl text-sm font-black transition-all ${
               p === 1 ? 'bg-gray-900 text-white shadow-lg' : 'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50'
             }`}>
               {p}
             </button>
           ))}
           <button className="w-12 h-12 flex items-center justify-center bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 transition-colors shadow-sm">
             <ChevronRight size={20} />
           </button>
        </div>
      </div>
    </div>
  );
}
