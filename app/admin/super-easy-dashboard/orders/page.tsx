'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  MoreHorizontal,
  ChevronRight,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  User,
  ExternalLink,
  Filter
} from 'lucide-react';

interface Order {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  total: number;
  status: 'pending' | 'packing' | 'shipped' | 'delivered';
  created_at: string;
}

const columns = [
  { id: 'pending', label: 'Pending Orders', icon: Clock, color: 'text-red-500', bg: 'bg-red-50' },
  { id: 'packing', label: 'Processing / Packing', icon: Package, color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'shipped', label: 'On The Way', icon: Truck, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'delivered', label: 'Delivered', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch orders');
    }
  };

  const updateOrderStatus = async (id: string, newStatus: string) => {
    // Optimistic UI update
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus as any } : o));

    try {
      await fetch('/api/admin/orders/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch (err) {
      console.error('Failed to update status');
      fetchOrders(); // Rollback on error
    }
  };

  const filteredOrders = orders.filter(o => 
    o.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.phone?.includes(searchQuery) ||
    o.id?.includes(searchQuery)
  );

  const getOrdersByStatus = (status: string) => filteredOrders.filter(o => o.status === status);

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Orders</h1>
          <p className="text-gray-400 font-medium mt-1">Manage delivery flow with drag & drop Kanban board.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, phone or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 bg-white rounded-2xl border border-gray-100 shadow-sm focus:border-gray-200 focus:bg-gray-50 transition-all outline-none text-sm font-bold"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3.5 bg-white border border-gray-100 rounded-2xl text-gray-600 shadow-sm hover:bg-gray-50 transition-all"
          >
            <Filter size={20} />
          </motion.button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 custom-scrollbar min-h-0">
        {columns.map((col) => (
          <div key={col.id} className="flex-shrink-0 w-[350px] flex flex-col h-full">
            <div className={`p-6 rounded-t-[2.5rem] ${col.bg} border-b-2 border-white flex items-center justify-between sticky top-0 z-10`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center ${col.color} shadow-sm`}>
                  <col.icon size={22} />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-sm tracking-tight">{col.label}</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{getOrdersByStatus(col.id).length} Orders</p>
                </div>
              </div>
              <motion.button whileHover={{ scale: 1.1 }} className="text-gray-300 hover:text-gray-500 transition-colors">
                <MoreHorizontal size={20} />
              </motion.button>
            </div>

            <div className="flex-1 bg-gray-50/50 rounded-b-[2.5rem] p-4 space-y-4 overflow-y-auto border-x border-b border-gray-100/50">
              {getOrdersByStatus(col.id).map((order) => (
                <motion.div
                  key={order.id}
                  layoutId={order.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  onClick={() => setSelectedOrder(order)}
                  className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 cursor-pointer group hover:shadow-xl hover:border-transparent transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">#{order.id.slice(0, 8)}</span>
                    <p className="text-xs text-gray-400 font-bold">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  
                  <h4 className="font-black text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">{order.customer_name}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-5">
                    <Phone size={12} className="text-gray-300" /> {order.phone}
                  </div>

                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Grand Total</p>
                      <p className="text-xl font-black text-gray-900">৳{order.total?.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {columns.filter(c => c.id !== col.id).map(target => (
                        <motion.button
                          key={target.id}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, target.id); }}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50 ${target.color} border border-gray-100 hover:bg-white transition-all`}
                          title={`Move to ${target.label}`}
                        >
                          <target.icon size={14} />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {getOrdersByStatus(col.id).length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
                  <Package size={32} className="text-gray-300 mb-3" />
                  <p className="text-xs font-bold text-gray-400">Empty column</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, x: 400 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 400 }}
              className="fixed right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl z-[101] p-10 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-xl">
                    {selectedOrder.customer_name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">Order Details</h2>
                    <p className="text-sm text-gray-400 font-medium uppercase tracking-widest">#{selectedOrder.id}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all">
                   <ChevronRight size={24} />
                </button>
              </div>

              <div className="space-y-8">
                {/* Customer Info */}
                <div className="bg-gray-50 rounded-[2rem] p-8 space-y-6 border border-gray-100 shadow-inner">
                  <div className="flex items-center gap-4">
                    <User className="text-gray-400" size={20} />
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Customer Name</p>
                      <p className="font-bold text-gray-900">{selectedOrder.customer_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="text-gray-400" size={20} />
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Contact Number</p>
                      <p className="font-bold text-gray-900">{selectedOrder.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <MapPin className="text-gray-400" size={20} />
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Delivery Address</p>
                      <p className="font-bold text-gray-900 leading-relaxed">{selectedOrder.address}</p>
                    </div>
                  </div>
                </div>

                {/* Status Selector */}
                <div>
                   <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 px-2">Update Order Status</p>
                   <div className="grid grid-cols-2 gap-3">
                      {columns.map(col => (
                        <button
                          key={col.id}
                          onClick={() => updateOrderStatus(selectedOrder.id, col.id)}
                          className={`p-4 rounded-2xl border text-sm font-black transition-all flex items-center gap-3 ${
                            selectedOrder.status === col.id 
                              ? 'bg-gray-900 text-white shadow-xl shadow-gray-900/20 border-transparent' 
                              : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          <col.icon size={18} /> {col.label}
                        </button>
                      ))}
                   </div>
                </div>

                {/* Order Summary */}
                <div className="border-t border-gray-100 pt-8">
                   <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 px-2">Financial Summary</p>
                   <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                         <span>Subtotal</span>
                         <span>৳{selectedOrder.total?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                         <span>Shipping</span>
                         <span className="text-emerald-500">Free</span>
                      </div>
                      <div className="pt-4 border-t border-dashed border-gray-200 flex justify-between items-center">
                         <span className="text-lg font-black text-gray-900 uppercase tracking-tight">Total Payable</span>
                         <span className="text-2xl font-black text-gray-900">৳{selectedOrder.total?.toLocaleString()}</span>
                      </div>
                   </div>
                </div>

                {/* Actions */}
                <div className="pt-10 flex gap-4">
                   <button className="flex-1 py-5 bg-gray-900 text-white rounded-[1.5rem] font-black text-sm hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/20 flex items-center justify-center gap-3">
                      <Truck size={20} /> Print Invoice
                   </button>
                   <button className="w-16 h-16 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all border border-gray-100">
                      <ExternalLink size={24} />
                   </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
