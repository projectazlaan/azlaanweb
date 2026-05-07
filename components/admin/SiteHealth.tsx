'use client'

import React from 'react'

export default function SiteHealth() {
  return (
    <div className="bg-primary p-5 rounded-2xl shadow-xl text-white overflow-hidden relative group mt-4 mx-4 mb-6">
      <div className="relative z-10">
        <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-4">Site Health</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-[10px] font-bold">Speed</span>
              <span className="text-[10px] font-bold text-emerald-400">98%</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full w-[98%] rounded-full shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-[10px] font-bold">Server</span>
              <span className="text-[10px] font-bold text-blue-400">120ms</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-400 h-full w-[85%] rounded-full shadow-[0_0_8px_rgba(96,165,250,0.5)]"></div>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-[9px] font-bold opacity-50 uppercase tracking-widest">Active Users</p>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl font-black">24</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
        </div>
      </div>
      {/* Background Decorative Element */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-secondary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
    </div>
  )
}
