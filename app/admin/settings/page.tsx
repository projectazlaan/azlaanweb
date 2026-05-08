'use client'
import { useEffect, useState } from 'react'
import { Settings } from 'lucide-react'
export default function AdminSettings() {
  const [form, setForm] = useState({
    siteName: 'Azlaan',
    siteNameBn: 'আজলান',
    description: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    facebook: '',
    instagram: '',
    newsletterEnabled: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  useEffect(() => { fetchSettings() }, [])
  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings')
      if (res.ok) {
        const data = await res.json()
        setForm({
          siteName: data.siteName || 'Azlaan',
          siteNameBn: data.siteNameBn || 'আজলান',
          description: data.description || '',
          contactEmail: data.contactEmail || '',
          contactPhone: data.contactPhone || '',
          address: data.address || '',
          facebook: data.facebook || '',
          instagram: data.instagram || '',
          newsletterEnabled: !!data.newsletterEnabled,
        })
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error('Failed to save:', error)
    } finally {
      setSaving(false)
    }
  }
  if (loading) return <div className="text-text-muted">Loading...</div>
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary flex items-center gap-2">
          <Settings size={28} /> Settings
        </h1>
        <p className="text-text-muted text-sm mt-1">Manage your site configuration</p>
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm max-w-2xl">
        {saved && (
          <div className="bg-green-50 text-green-700 p-3 rounded-xl text-sm mb-6">
            Settings saved successfully!
          </div>
        )}
        <div className="space-y-5">
          <div>
            <h2 className="font-semibold text-primary mb-3 text-sm">Site Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1.5">Site Name (EN)</label>
                <input
                  type="text"
                  value={form.siteName}
                  onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-border-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1.5">Site Name (BN)</label>
                <input
                  type="text"
                  value={form.siteNameBn}
                  onChange={(e) => setForm({ ...form, siteNameBn: e.target.value })}
                  className="w-full px-4 py-2.5 border border-border-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
                />
              </div>
            </div>
          </div>
          <div>
            <h2 className="font-semibold text-primary mb-3 text-sm">Contact Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                  className="w-full px-4 py-2.5 border border-border-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1.5">Phone</label>
                <input
                  type="text"
                  value={form.contactPhone}
                  onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-border-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-primary mb-1.5">Address</label>
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-4 py-2.5 border border-border-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 min-h-[60px]"
              />
            </div>
          </div>
          <div>
            <h2 className="font-semibold text-primary mb-3 text-sm">Social Links</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1.5">Facebook URL</label>
                <input
                  type="text"
                  value={form.facebook}
                  onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                  className="w-full px-4 py-2.5 border border-border-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1.5">Instagram URL</label>
                <input
                  type="text"
                  value={form.instagram}
                  onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                  className="w-full px-4 py-2.5 border border-border-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.newsletterEnabled}
                onChange={(e) => setForm({ ...form, newsletterEnabled: e.target.checked })}
                className="w-4 h-4 rounded accent-secondary"
              />
              <span className="text-sm text-primary">Enable Newsletter Subscription</span>
            </label>
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="mt-6 bg-secondary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-secondary/90 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}
