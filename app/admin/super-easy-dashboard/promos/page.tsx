'use client';
import React from 'react';
import { Tag, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PromosPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Promo Codes</h1>
          <p className="text-gray-400 font-medium mt-1">Create and manage discount coupons.</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-gray-900/20">
          <Plus size={20} /> Create New Coupon
        </motion.button>
      </div>
      <div className="bg-white rounded-[2.5rem] p-20 border-4 border-dashed border-gray-100 flex flex-col items-center justify-center text-center">
         <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-200 mb-6">
            <Tag size={40} />
         </div>
         <h2 className="text-2xl font-black text-gray-900 mb-2">Discount Engine is Ready</h2>
         <p className="text-gray-400 font-medium max-w-sm">Manage your marketing campaigns and promo codes from this central hub. Integration with checkout is next.</p>
      </div>
    </div>
  );
}
