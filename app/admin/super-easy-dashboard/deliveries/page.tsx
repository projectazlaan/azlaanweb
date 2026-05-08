'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

type Status = 'pending' | 'processing' | 'shipped' | 'delivered';

const INITIAL_ORDERS = [
  { id: '#AZ-1041', name: 'Sajib Rahman', item: 'Premium Black Panjabi', amount: '৳ 2,500', status: 'pending' as Status, time: '2 mins ago', phone: '017XXXXXXXX' },
  { id: '#AZ-1040', name: 'Nusrat Jahan', item: 'White Summer Linen × 2', amount: '৳ 4,400', status: 'processing' as Status, time: '1 hr ago', phone: '019XXXXXXXX' },
  { id: '#AZ-1039', name: 'Karim Uddin', item: 'Royal Blue Silk', amount: '৳ 3,500', status: 'shipped' as Status, time: '3 hrs ago', phone: '018XXXXXXXX' },
  { id: '#AZ-1038', name: 'Mitu Akter', item: 'Olive Green Casual', amount: '৳ 1,800', status: 'delivered' as Status, time: 'Yesterday', phone: '015XXXXXXXX' },
  { id: '#AZ-1037', name: 'Farhan Islam', item: 'Classic Red Check', amount: '৳ 1,500', status: 'pending' as Status, time: '5 mins ago', phone: '016XXXXXXXX' },
];

const COLUMNS: { key: Status; label: string; icon: React.ElementType; color: string; bg: string }[] = [
  { key: 'pending', label: 'New Orders', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
  { key: 'processing', label: 'Packing', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
  { key: 'shipped', label: 'On the Way', icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
  { key: 'delivered', label: 'Delivered ✓', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
];

const STATUS_FLOW: Status[] = ['pending', 'processing', 'shipped', 'delivered'];

export default function DeliveriesPage() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  const moveForward = (id: string) => {
    setOrders(orders.map(o => {
      if (o.id !== id) return o;
      const idx = STATUS_FLOW.indexOf(o.status);
      if (idx >= STATUS_FLOW.length - 1) return o;
      return { ...o, status: STATUS_FLOW[idx + 1] };
    }));
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
        <h2 className="text-2xl font-black text-gray-900">Delivery Tracker</h2>
        <p className="text-gray-500 font-medium text-sm mt-1">Move orders forward — customer gets an auto-SMS at every step.</p>
      </div>

      {/* Trello Board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {COLUMNS.map(col => {
          const colOrders = orders.filter(o => o.status === col.key);
          return (
            <div key={col.key} className={`bg-white rounded-[2rem] border-2 ${col.bg} overflow-hidden shadow-sm`}>
              {/* Column Header */}
              <div className={`p-5 border-b ${col.bg}`}>
                <div className="flex items-center gap-2">
                  <col.icon className={`w-5 h-5 ${col.color}`} />
                  <h3 className={`font-black text-sm ${col.color}`}>{col.label}</h3>
                </div>
                <div className={`mt-1 text-3xl font-black ${col.color}`}>{colOrders.length}</div>
              </div>

              {/* Cards */}
              <div className="p-3 space-y-3 min-h-[200px]">
                {colOrders.map(order => (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={order.id}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-black text-gray-400">{order.id}</span>
                      <span className="text-xs text-gray-400 font-medium">{order.time}</span>
                    </div>
                    <p className="font-bold text-gray-900 text-sm">{order.name}</p>
                    <p className="text-xs text-gray-500 font-medium mt-0.5 mb-3">{order.item}</p>
                    <p className="text-blue-600 font-black text-sm mb-3">{order.amount}</p>

                    {/* Move Forward Button */}
                    {col.key !== 'delivered' && (
                      <button
                        onClick={() => moveForward(order.id)}
                        className="w-full bg-gray-900 hover:bg-black text-white text-xs font-bold py-2.5 rounded-xl transition-colors"
                      >
                        {col.key === 'pending' ? '📦 Start Packing' :
                         col.key === 'processing' ? '🚚 Send to Courier' :
                         '✅ Mark Delivered'}
                      </button>
                    )}
                    {col.key === 'delivered' && (
                      <div className="w-full bg-green-100 text-green-700 text-xs font-bold py-2.5 rounded-xl text-center">
                        🎉 Order Complete!
                      </div>
                    )}
                  </motion.div>
                ))}
                {colOrders.length === 0 && (
                  <div className="flex items-center justify-center h-24 text-gray-300 text-sm font-bold">
                    Empty
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
