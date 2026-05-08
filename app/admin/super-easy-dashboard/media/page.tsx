'use client';
import React from 'react';
import { Globe, Plus, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
export default function MediaPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Media Library</h1>
          <p className="text-gray-400 font-medium mt-1">Manage all your product images and banners.</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-gray-900/20">
          <Plus size={20} /> Upload Media
        </motion.button>
      </div>
      <div className="bg-white rounded-[2.5rem] p-20 border-4 border-dashed border-gray-50 flex flex-col items-center justify-center text-center">
         <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-200 mb-6">
            <ImageIcon size={40} />
         </div>
         <h2 className="text-2xl font-black text-gray-900 mb-2">Media Library is Coming Soon</h2>
         <p className="text-gray-400 font-medium max-w-sm">We are integrating Supabase Storage to give you a powerful drag-and-drop media experience.</p>
      </div>
    </div>
  );
}
