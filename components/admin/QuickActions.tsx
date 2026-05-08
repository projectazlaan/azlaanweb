'use client'
import React from 'react'
import { PlusCircle, Tag, Layout, Users, ShoppingBag, Settings } from 'lucide-react'
import Link from 'next/link'
export default function QuickActions() {
  const actions = [
    { label: 'Add Product', icon: PlusCircle, href: '/admin/products/new', color: 'bg-blue-500' },
    { label: 'New Coupon', icon: Tag, href: '/admin/coupons/new', color: 'bg-purple-500' },
    { label: 'Update Hero', icon: Layout, href: '/admin/settings/hero', color: 'bg-orange-500' },
    { label: 'Customers', icon: Users, href: '/admin/customers', color: 'bg-emerald-500' },
    { label: 'Orders', icon: ShoppingBag, href: '/admin/orders', color: 'bg-indigo-500' },
    { label: 'Settings', icon: Settings, href: '/admin/settings', color: 'bg-slate-500' },
  ]
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm h-full flex flex-col border border-transparent">
      <div className="mb-6">
        <h3 className="text-sm font-bold text-primary uppercase tracking-widest opacity-60">Quick Actions</h3>
      </div>
      <div className="grid grid-cols-2 gap-4 flex-1">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex flex-col items-center justify-center p-4 bg-section-bg/50 rounded-2xl hover:bg-white hover:shadow-md hover:scale-[1.02] transition-all duration-300 group border border-transparent hover:border-border-light"
          >
            <div className={`w-10 h-10 rounded-xl ${action.color} text-white flex items-center justify-center mb-3 shadow-lg group-hover:rotate-12 transition-transform`}>
              <action.icon size={20} />
            </div>
            <span className="text-xs font-bold text-primary text-center">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
