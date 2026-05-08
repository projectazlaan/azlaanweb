'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  History,
  ShoppingCart,
  Zap,
  Settings,
  AlertCircle,
  CheckCircle2,
  Package,
  User,
  Search,
  Filter,
  MoreVertical,
  Clock,
  ArrowRight
} from 'lucide-react';
interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  status: string;
  time: string;
}
interface ActivityLog {
  id: string;
  action: string;
  entity_type: string;
  new_value: any;
  created_at: string;
}
export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<'notifications' | 'logs'>('notifications');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/api/admin/notifications')
      .then(res => res.json())
      .then(data => {
        setNotifications(data.notifications || []);
        setLogs(data.logs || []);
        setLoading(false);
      })
      .catch(console.error);
  }, []);
  const getIcon = (type: string) => {
    switch (type) {
      case 'ORDER': return <ShoppingCart size={20} />;
      case 'FLASH_SALE': return <Zap size={20} />;
      case 'SYSTEM': return <Settings size={20} />;
      default: return <Bell size={20} />;
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-50 text-emerald-500';
      case 'pending': return 'bg-red-50 text-red-500';
      case 'packing': return 'bg-amber-50 text-amber-500';
      default: return 'bg-blue-50 text-blue-500';
    }
  };
  return (
    <div className="space-y-8 pb-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Updates</h1>
          <p className="text-gray-400 font-medium mt-1">Stay informed about orders and system activities.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-6 py-3 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${
              activeTab === 'notifications' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Bell size={18} /> Notifications
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-6 py-3 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${
              activeTab === 'logs' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <History size={18} /> System Logs
          </button>
        </div>
      </div>
      {/* Main Content Area */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
           <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input
                type="text"
                placeholder="Search history..."
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-sm font-medium outline-none focus:border-gray-200 transition-all"
              />
           </div>
           <div className="flex gap-2">
              <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-all shadow-sm">
                 <Filter size={20} />
              </button>
              <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-all shadow-sm">
                 <MoreVertical size={20} />
              </button>
           </div>
        </div>
        <div className="divide-y divide-gray-50">
          <AnimatePresence mode="wait">
            {activeTab === 'notifications' ? (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-2"
              >
                {notifications.length === 0 && !loading ? (
                  <div className="text-center py-20">
                     <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                        <Bell size={32} />
                     </div>
                     <p className="text-gray-400 font-bold">No new notifications</p>
                  </div>
                ) : (
                  notifications.map((notif, i) => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group flex items-start gap-6 p-6 rounded-[2rem] hover:bg-gray-50 transition-all cursor-pointer"
                    >
                      <div className={`w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-sm border border-white ${getStatusColor(notif.status)} transition-transform group-hover:scale-110 duration-300`}>
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-black text-gray-900 group-hover:text-blue-600 transition-colors">{notif.title}</h4>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                            <Clock size={12} /> {new Date(notif.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed">{notif.message}</p>
                        <div className="mt-4 flex items-center gap-3">
                           <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${getStatusColor(notif.status)}`}>
                             {notif.status}
                           </span>
                           <span className="text-gray-200">•</span>
                           <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-1">
                             View Details <ArrowRight size={12} />
                           </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            ) : (
              <motion.div
                key="logs"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-2"
              >
                {logs.length === 0 && !loading ? (
                   <div className="text-center py-20">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                         <History size={32} />
                      </div>
                      <p className="text-gray-400 font-bold">No activity logs found</p>
                   </div>
                ) : (
                  logs.map((log, i) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-6 p-6 rounded-[2rem] hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex-shrink-0 flex items-center justify-center text-gray-400 border border-gray-100">
                         <Settings size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                           <div className="flex items-center gap-3">
                              <span className="px-3 py-1 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">{log.action}</span>
                              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{log.entity_type}</span>
                           </div>
                           <span className="text-xs text-gray-400 font-bold">{new Date(log.created_at).toLocaleString()}</span>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                           <pre className="text-xs text-gray-600 font-medium overflow-x-auto whitespace-pre-wrap">
                             {JSON.stringify(log.new_value, null, 2)}
                           </pre>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Footer / Load More */}
        <div className="p-8 bg-gray-50/50 text-center border-t border-gray-50">
           <button className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-all flex items-center gap-2 mx-auto">
             Load More History <ArrowRight size={14} />
           </button>
        </div>
      </div>
      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Unread Alerts', value: '12', icon: Bell, color: 'text-red-500' },
          { label: 'Admin Logins', value: '05', icon: User, color: 'text-blue-500' },
          { label: 'System Health', value: '100%', icon: CheckCircle2, color: 'text-emerald-500' },
        ].map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
             <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gray-50 ${card.color}`}>
                <card.icon size={24} />
             </div>
             <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{card.label}</p>
                <p className="text-2xl font-black text-gray-900">{card.value}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
