'use client';

import { Search, Bell, Zap } from 'lucide-react';

export default function Topbar() {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40 px-6 md:px-10 flex items-center justify-between">
      {/* Mobile Menu Toggle (Placeholder) & Search */}
      <div className="flex items-center gap-6 flex-1">
        <div className="hidden md:flex relative w-full max-w-md group">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search orders, products, or customers..." 
            className="w-full bg-gray-100/50 hover:bg-gray-100 border-2 border-transparent focus:border-blue-100 focus:bg-white text-sm py-3.5 pl-12 pr-4 rounded-2xl outline-none transition-all placeholder:text-gray-400 font-medium text-black"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Flash Sale Quick Button */}
        <button className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-[0_4px_14px_rgba(225,29,72,0.3)] transition-all hover:scale-105 active:scale-95">
          <Zap className="w-4 h-4 fill-white" />
          Flash Sale
        </button>

        {/* Notifications */}
        <button className="relative p-3 rounded-full hover:bg-gray-100 transition-colors group">
          <Bell className="w-6 h-6 text-gray-600 group-hover:text-black transition-colors" />
          <span className="absolute top-2.5 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
}
