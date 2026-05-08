'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingCart, Users, DollarSign, TrendingUp, Filter, Download } from 'lucide-react'
import Link from 'next/link'
import SalesChart from '@/components/admin/DashboardCharts'
import ActivityFeed from '@/components/admin/ActivityFeed'
import InventoryAlerts from '@/components/admin/InventoryAlerts'
import QuickActions from '@/components/admin/QuickActions'
interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalCustomers: number
  revenue: number
  recentOrders: any[]
  topProducts: { name: string; sales: number }[]
  salesTrend: any[]
  lowStockProducts: any[]
  activityLog: any[]
}
export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('7d')
  useEffect(() => {
    fetchStats()
  }, [timeframe])
  const fetchStats = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/dashboard/stats?timeframe=${timeframe}`)
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }
  const statCards = [
    { label: 'Total Revenue', value: `৳${(stats?.revenue || 0).toLocaleString('en-IN')}`, icon: DollarSign, color: 'bg-emerald-500', trend: '+12.5%' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingCart, color: 'bg-blue-500', trend: '+5.2%' },
    { label: 'Total Customers', value: stats?.totalCustomers || 0, icon: Users, color: 'bg-purple-500', trend: '+8.1%' },
    { label: 'Inventory Items', value: stats?.totalProducts || 0, icon: Package, color: 'bg-orange-500', trend: 'In Stock' },
  ]
  const timeframeOptions = [
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: '3 Months', value: '90d' },
    { label: '1 Year', value: '1y' },
  ]
  return (
    <div className="pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary flex items-center gap-3">
            <LayoutDashboard size={32} className="text-secondary" /> 
            Overview
          </h1>
          <p className="text-text-muted text-sm mt-2 font-medium">
            Welcome back, Admin. Here's what's happening with Azlaan today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-sm font-semibold text-primary shadow-sm border border-border-light hover:bg-section-bg transition-colors">
            <Filter size={16} /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-xl text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity">
            <Download size={16} /> Export Report
          </button>
        </div>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white p-6 rounded-2xl shadow-sm border border-transparent hover:border-border-light transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${card.color} group-hover:scale-110 transition-transform`}>
                <card.icon size={24} />
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${card.trend.includes('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                {card.trend}
              </span>
            </div>
            <p className="text-text-muted text-xs font-bold uppercase tracking-wider mb-1">{card.label}</p>
            <p className="text-2xl font-bold text-primary">{loading ? '...' : card.value}</p>
          </div>
        ))}
      </div>
      {/* Top Row: Quick Actions and Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-1">
          <div className="h-full">
            <QuickActions />
          </div>
        </div>
        <div className="lg:col-span-2">
          {/* Chart Section */}
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-6 pb-2 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <TrendingUp size={20} className="text-secondary" /> Sales Analytics
                </h3>
                <p className="text-xs text-text-muted mt-1">Revenue trend analysis</p>
              </div>
              <div className="flex bg-section-bg p-1 rounded-xl">
                {timeframeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setTimeframe(opt.value)}
                    className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-tighter rounded-lg transition-all ${
                      timeframe === opt.value 
                        ? 'bg-white text-primary shadow-sm shadow-primary/10' 
                        : 'text-text-muted hover:text-primary'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-6 flex-1 min-h-[350px]">
              {loading ? (
                <div className="w-full h-full bg-section-bg/30 animate-pulse rounded-2xl flex items-center justify-center">
                   <TrendingUp className="text-border-light animate-bounce" size={40} />
                </div>
              ) : (
                <SalesChart data={stats?.salesTrend || []} />
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Metrics and Orders */}
        <div className="lg:col-span-2 h-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full">
            {/* Top Products */}
            <div className="bg-white p-6 rounded-3xl shadow-sm flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-primary flex items-center gap-2 text-lg">
                  <Package size={20} className="text-orange-500" /> Best Sellers
                </h2>
                <Link href="/admin/products" className="text-secondary text-xs font-bold hover:underline">Full List</Link>
              </div>
              {loading ? (
                <div className="animate-pulse space-y-4 flex-1">
                  {[1, 2, 3].map(i => <div key={i} className="h-12 bg-section-bg rounded-xl"></div>)}
                </div>
              ) : (
                <div className="space-y-4 flex-1">
                  {(stats?.topProducts || []).map((product: any, index: number) => (
                    <div key={product.name} className="flex items-center gap-4 group">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shadow-sm
                        ${index === 0 ? 'bg-amber-100 text-amber-600' : index === 1 ? 'bg-slate-100 text-slate-500' : 'bg-orange-50 text-orange-600'}`}>
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">{product.name}</p>
                        <div className="w-full bg-section-bg h-1.5 rounded-full mt-2 overflow-hidden">
                          <div 
                            className="bg-secondary h-full rounded-full transition-all duration-1000" 
                            style={{ width: `${(product.sales / (stats?.topProducts[0]?.sales || 1)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-primary">{product.sales}</p>
                        <p className="text-[10px] text-text-muted font-bold">SOLD</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Inventory Alerts */}
            <div className="h-full">
              <InventoryAlerts products={stats?.lowStockProducts || []} />
            </div>
            {/* Activity Feed */}
            <div className="h-full">
              <ActivityFeed activities={stats?.activityLog || []} />
            </div>
          </div>
        </div>
        {/* Right Column: Recent Orders */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-primary flex items-center gap-2 text-lg">
                <ShoppingCart size={20} className="text-blue-500" /> Recent Orders
              </h2>
              <Link href="/admin/orders" className="text-secondary text-xs font-bold hover:underline">All</Link>
            </div>
            <div className="space-y-4 flex-1 overflow-y-auto pr-1 scrollbar-hide">
              {(stats?.recentOrders || []).map((order: any) => (
                <div key={order.id} className="p-3 bg-section-bg/50 rounded-2xl border border-transparent hover:border-border-light hover:bg-white transition-all group">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold text-primary">{order.customerName}</p>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-tighter
                      ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 
                        order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-text-muted font-mono">{order.id.slice(0, 8)}</p>
                      <p className="text-[10px] text-text-muted mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <p className="text-sm font-black text-primary">৳{order.total.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
