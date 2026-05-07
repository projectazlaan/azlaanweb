'use client'

import { useEffect, useState } from 'react'
import { ShoppingCart, Filter } from 'lucide-react'

interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  address: string
  items: any[]
  total: number
  status: string
  createdAt: string
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders')
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) fetchOrders()
    } catch (error) {
      console.error('Failed to update:', error)
    }
  }

  const filtered = statusFilter === 'all' ? orders : orders.filter(o => o.status === statusFilter)

  const statusOptions = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled']

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary flex items-center gap-2">
          <ShoppingCart size={28} /> Orders
        </h1>
        <p className="text-text-muted text-sm mt-1">{orders.length} total orders</p>
      </div>

      <div className="mb-6">
        <div className="flex gap-2 flex-wrap">
          {statusOptions.map(opt => (
            <button
              key={opt}
              onClick={() => setStatusFilter(opt)}
              className={`px-4 py-2 rounded-xl text-sm transition-colors cursor-pointer ${statusFilter === opt ? 'bg-secondary text-white' : 'bg-white text-text-muted hover:bg-section-bg'}`}
            >
              {opt === 'all' ? 'All' : opt.charAt(0).toUpperCase() + opt.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-text-muted">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-text-muted">No orders found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-light bg-section-bg">
                  <th className="text-left p-4 font-medium text-text-muted">Order ID</th>
                  <th className="text-left p-4 font-medium text-text-muted">Customer</th>
                  <th className="text-left p-4 font-medium text-text-muted">Total</th>
                  <th className="text-left p-4 font-medium text-text-muted">Status</th>
                  <th className="text-left p-4 font-medium text-text-muted">Date</th>
                  <th className="text-right p-4 font-medium text-text-muted">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id} className="border-b border-border-light last:border-0 hover:bg-section-bg/50">
                    <td className="p-4 font-mono text-xs text-text-muted">{order.id.slice(0, 8)}</td>
                    <td className="p-4">
                      <p className="font-medium text-primary text-sm">{order.customerName}</p>
                      <p className="text-xs text-text-muted">{order.customerPhone}</p>
                    </td>
                    <td className="p-4 font-semibold text-primary">৳{order.total.toLocaleString('en-IN')}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[order.status] || 'bg-gray-100'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-text-muted text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="text-xs px-2 py-1 border border-border-light rounded-lg bg-white cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
