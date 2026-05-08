'use client'
import { useEffect, useState } from 'react'
import { Plus, Trash2, Star, Pencil } from 'lucide-react'
import Link from 'next/link'
interface Testimonial {
  id: string
  name: string
  nameBn: string
  location: string
  locationBn: string
  review: string
  reviewBn: string
  initial: string
  rating: number
  createdAt: string
}
export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    nameBn: '',
    location: '',
    locationBn: '',
    review: '',
    reviewBn: '',
    rating: 5,
  })
  const [saving, setSaving] = useState(false)
  useEffect(() => {
    fetchTestimonials()
  }, [])
  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/admin/testimonials')
      if (res.ok) {
        const data = await res.json()
        setTestimonials(data)
      }
    } catch (error) {
      console.error('Failed to fetch:', error)
    } finally {
      setLoading(false)
    }
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const url = editingId
        ? `/api/admin/testimonials/${editingId}`
        : '/api/admin/testimonials'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setShowForm(false)
        setEditingId(null)
        setForm({ name: '', nameBn: '', location: '', locationBn: '', review: '', reviewBn: '', rating: 5 })
        fetchTestimonials()
      }
    } catch (error) {
      console.error('Failed to save:', error)
    } finally {
      setSaving(false)
    }
  }
  const handleEdit = (t: Testimonial) => {
    setForm({
      name: t.name,
      nameBn: t.nameBn,
      location: t.location,
      locationBn: t.locationBn,
      review: t.review,
      reviewBn: t.reviewBn,
      rating: t.rating,
    })
    setEditingId(t.id)
    setShowForm(true)
  }
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete testimonial from "${name}"?`)) return
    try {
      await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' })
      fetchTestimonials()
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary flex items-center gap-2">
            <MessageSquareIcon size={28} /> Testimonials
          </h1>
          <p className="text-text-muted text-sm mt-1">{testimonials.length} total</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm({ name: '', nameBn: '', location: '', locationBn: '', review: '', reviewBn: '', rating: 5 }) }}
          className="flex items-center gap-2 bg-secondary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-secondary/90 transition-colors cursor-pointer"
        >
          <Plus size={18} /> Add Testimonial
        </button>
      </div>
      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 max-w-2xl">
          <h2 className="font-semibold text-primary mb-4">{editingId ? 'Edit' : 'Add'} Testimonial</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1.5">Name (EN) *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 border border-border-light rounded-xl text-sm" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1.5">Name (BN)</label>
                <input type="text" value={form.nameBn} onChange={(e) => setForm({ ...form, nameBn: e.target.value })} className="w-full px-4 py-2.5 border border-border-light rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1.5">Location (EN)</label>
                <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-4 py-2.5 border border-border-light rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1.5">Location (BN)</label>
                <input type="text" value={form.locationBn} onChange={(e) => setForm({ ...form, locationBn: e.target.value })} className="w-full px-4 py-2.5 border border-border-light rounded-xl text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Review (EN) *</label>
              <textarea value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} className="w-full px-4 py-2.5 border border-border-light rounded-xl text-sm min-h-[80px]" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Review (BN)</label>
              <textarea value={form.reviewBn} onChange={(e) => setForm({ ...form, reviewBn: e.target.value })} className="w-full px-4 py-2.5 border border-border-light rounded-xl text-sm min-h-[80px]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Rating</label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(star => (
                  <button type="button" key={star} onClick={() => setForm({ ...form, rating: star })} className="cursor-pointer">
                    <Star size={20} className={star <= form.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="bg-secondary text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-secondary/90 disabled:opacity-50 cursor-pointer">
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null) }} className="px-5 py-2 border border-border-light rounded-xl text-sm hover:bg-section-bg cursor-pointer">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? <div className="p-8 text-center text-text-muted">Loading...</div> : testimonials.length === 0 ? (
          <div className="p-8 text-center text-text-muted">No testimonials yet</div>
        ) : (
          <div className="divide-y divide-border-light">
            {testimonials.map((t) => (
              <div key={t.id} className="p-4 flex items-start justify-between hover:bg-section-bg/50">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {t.initial}
                  </div>
                  <div>
                    <p className="font-medium text-primary text-sm">{t.name}</p>
                    <p className="text-xs text-text-muted">{t.location}</p>
                    <p className="text-sm text-text-muted mt-1 line-clamp-2">&ldquo;{t.review}&rdquo;</p>
                    <div className="flex mt-1">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => handleEdit(t)} className="p-2 hover:bg-section-bg rounded-lg cursor-pointer">
                    <Pencil size={14} className="text-text-muted" />
                  </button>
                  <button onClick={() => handleDelete(t.id, t.name)} className="p-2 hover:bg-red-50 rounded-lg cursor-pointer">
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
function MessageSquareIcon({ size, ...props }: { size: number; [key: string]: any }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}
