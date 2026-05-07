'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload } from 'lucide-react'

export default function NewProduct() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    nameBn: '',
    price: '',
    image: '',
    category: 'Men',
    categoryBn: 'পুরুষ',
    description: '',
    descriptionBn: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!form.name || !form.price || !form.image) {
      setError('Name, price and image are required')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: parseInt(form.price),
          categoryBn: form.categoryBn || form.category,
        }),
      })

      if (res.ok) {
        router.push('/admin/products')
      } else {
        setError('Failed to create product')
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const categoryMap: Record<string, string> = {
    Men: 'পুরুষ',
    Women: 'নারী',
    Kids: 'শিশু',
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-text-muted hover:text-primary mb-4 cursor-pointer"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm max-w-2xl">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-6">{error}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Name (EN) *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-border-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Name (BN)</label>
            <input
              type="text"
              value={form.nameBn}
              onChange={(e) => setForm({ ...form, nameBn: e.target.value })}
              className="w-full px-4 py-2.5 border border-border-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Price (৳) *</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full px-4 py-2.5 border border-border-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Category *</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value, categoryBn: categoryMap[e.target.value] })}
              className="w-full px-4 py-2.5 border border-border-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 bg-white"
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-primary mb-1.5">Image URL *</label>
          <input
            type="text"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="w-full px-4 py-2.5 border border-border-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
            placeholder="https://..."
            required
          />
          {form.image && (
            <img src={form.image} alt="Preview" className="mt-3 w-32 h-32 object-cover rounded-xl" />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Description (EN)</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2.5 border border-border-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 min-h-[80px]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Description (BN)</label>
            <textarea
              value={form.descriptionBn}
              onChange={(e) => setForm({ ...form, descriptionBn: e.target.value })}
              className="w-full px-4 py-2.5 border border-border-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 min-h-[80px]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-secondary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-secondary/90 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  )
}
