'use client'

import React from 'react'
import { AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

interface LowStockProduct {
  id: string
  name: string
  stock: number
}

export default function InventoryAlerts({ products }: { products: LowStockProduct[] }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm h-full flex flex-col border border-transparent">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-primary flex items-center gap-2">
          <AlertCircle size={20} className="text-red-500" /> Inventory Alerts
        </h3>
        {products.length > 0 && (
          <span className="bg-red-100 text-red-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
            {products.length} Critical
          </span>
        )}
      </div>
      
      <div className="space-y-3 flex-1 overflow-y-auto scrollbar-hide pr-1">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 py-10">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-primary">All Stocked Up</p>
              <p className="text-[10px] text-text-muted mt-1">No low stock alerts at the moment.</p>
            </div>
          </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="flex items-center justify-between p-3 bg-red-50/50 rounded-2xl border border-red-100 group hover:bg-red-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-red-500 shadow-sm">
                  <AlertCircle size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-primary leading-tight">{product.name}</p>
                  <p className="text-[10px] text-red-600 font-black uppercase tracking-widest mt-0.5">Only {product.stock} left</p>
                </div>
              </div>
              <Link 
                href={`/admin/products?id=${product.id}`}
                className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100"
              >
                <ArrowRight size={14} />
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
