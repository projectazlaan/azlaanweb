'use client'

import { useEffect, useState } from 'react'
import { Users, Search } from 'lucide-react'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  totalOrders: number
  totalSpent: number
  createdAt: string
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { fetchCustomers() }, [])

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/admin/customers')
      if (res.ok) {
        const data = await res.json()
        setCustomers(data)
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary flex items-center gap-2">
          <Users size={28} /> Customers
        </h1>
        <p className="text-text-muted text-sm mt-1">{customers.length} total customers</p>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-border-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-text-muted">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-text-muted">No customers found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-light bg-section-bg">
                  <th className="text-left p-4 font-medium text-text-muted">Name</th>
                  <th className="text-left p-4 font-medium text-text-muted">Contact</th>
                  <th className="text-left p-4 font-medium text-text-muted">Orders</th>
                  <th className="text-left p-4 font-medium text-text-muted">Total Spent</th>
                  <th className="text-left p-4 font-medium text-text-muted">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((customer) => (
                  <tr key={customer.id} className="border-b border-border-light last:border-0 hover:bg-section-bg/50">
                    <td className="p-4">
                      <p className="font-medium text-primary">{customer.name}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-text-muted text-xs">{customer.phone}</p>
                      {customer.email && <p className="text-text-muted text-xs">{customer.email}</p>}
                    </td>
                    <td className="p-4 text-primary">{customer.totalOrders}</td>
                    <td className="p-4 font-semibold text-primary">৳{customer.totalSpent.toLocaleString('en-IN')}</td>
                    <td className="p-4 text-text-muted text-xs">
                      {new Date(customer.createdAt).toLocaleDateString()}
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
