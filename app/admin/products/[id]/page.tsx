'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Trash2 } from 'lucide-react'

export default function EditProduct() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [form, setForm] = useState({
    name: '',
    nameBn: '',
    price: '',
    image: '',
    category: 'Men',
    categoryBn: 'পুরুষ',
    description: '',
    descriptionBn: '',
    inStock: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/admin/products/${id}`)
      if (res.ok) {
        const data = await res.json()
        setForm({
          name: data.name || '',
          nameBn: data.nameBn || '',
          price: data.price?.toString() || '',
          image: data.image || '',
          category: data.category || 'Men',
          categoryBn: data.categoryBn || '',
          description: data.description || '',
          descriptionBn: data.descriptionBn || '',
          inStock: !!data.inStock,
        })
      }
    } catch (error) {
      console.error('Failed to fetch product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: parseInt(form.price),
        }),
      })

      if (res.ok) {
        router.push('/admin/products')
      } else {
        setError('Failed to update product')
      }
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this product? This cannot be undone.')) return

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      if (res.ok) {
        router.push('/admin/products')
      }
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  const categoryMap: Record<string, string> = {
    Men: 'পুরুষ',
    Women: 'নারী',
    Kids: 'শিশু',
  }

  if (loading) return <div className="text-text-muted">Loading...</div>

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-text-muted hover:text-primary mb-4 cursor-pointer"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary">Edit Product</h1>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-3 py-2 rounded-xl text-sm transition-colors cursor-pointer"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
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
              onChange={(e) => setForm({ ...form, category: e.target.value, categoryBn: categoryMap[e.target.value] || e.target.value })}
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
            required
          />
          {form.image && (
            <img src={form.image} alt="Preview" className="mt-3 w-32 h-32 object-cover rounded-xl" />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
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

        <div className="mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
              className="w-4 h-4 rounded accent-secondary"
            />
            <span className="text-sm text-primary">In Stock</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-secondary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-secondary/90 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
