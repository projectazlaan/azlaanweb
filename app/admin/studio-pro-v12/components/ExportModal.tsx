'use client'

import { useState } from 'react'
import {
  X, Download, FileJson, FileCode, Loader2,
  CheckCircle2, Package, ArrowRight
} from 'lucide-react'
import { useStudioStore } from '../store'
import toast from 'react-hot-toast'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
}

type ExportFormat = 'json' | 'html'

const FORMAT_OPTIONS = [
  {
    id: 'json' as ExportFormat,
    icon: FileJson,
    label: 'JSON Settings',
    description: 'Export all design settings, colors, and styles as a JSON file. Use to back up or transfer your design.',
    badge: 'Recommended',
    badgeColor: 'bg-indigo-500/20 text-indigo-400',
  },
  {
    id: 'html' as ExportFormat,
    icon: FileCode,
    label: 'HTML + CSS',
    description: 'Export a standalone HTML file with all custom styles applied as CSS variables.',
    badge: 'Advanced',
    badgeColor: 'bg-fuchsia-500/20 text-fuchsia-400',
  },
]

export default function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('json')
  const [isExporting, setIsExporting] = useState(false)
  const [exported, setExported] = useState(false)
  const settings = useStudioStore(s => s.settings)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const res = await fetch('/api/studio-pro/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format: selectedFormat, settings }),
      })

      if (!res.ok) throw new Error('Export failed')

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const ext = selectedFormat === 'json' ? 'json' : 'html'
      const filename = `studio-pro-v12-export-${Date.now()}.${ext}`

      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)

      setExported(true)
      toast.success(`Exported as ${filename}`, { icon: '📦' })
      setTimeout(() => setExported(false), 3000)
    } catch {
      toast.error('Export failed. Try again.')
    } finally {
      setIsExporting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#111] rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-fuchsia-600 rounded-2xl flex items-center justify-center">
              <Package size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Export Design</h2>
              <p className="text-gray-500 text-xs">Studio Pro V12</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-xl transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Format Options */}
        <div className="p-6 space-y-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
            Choose Export Format
          </p>

          {FORMAT_OPTIONS.map(opt => {
            const Icon = opt.icon
            return (
              <button
                key={opt.id}
                onClick={() => setSelectedFormat(opt.id)}
                className={`w-full flex items-start gap-4 p-4 rounded-2xl border transition-all text-left ${
                  selectedFormat === opt.id
                    ? 'bg-indigo-600/10 border-indigo-500/40'
                    : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  selectedFormat === opt.id ? 'bg-indigo-600/30' : 'bg-white/10'
                }`}>
                  <Icon size={18} className={selectedFormat === opt.id ? 'text-indigo-400' : 'text-gray-500'} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-sm font-bold ${selectedFormat === opt.id ? 'text-white' : 'text-gray-300'}`}>
                      {opt.label}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${opt.badgeColor}`}>
                      {opt.badge}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{opt.description}</p>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-1 flex items-center justify-center ${
                  selectedFormat === opt.id ? 'border-indigo-500 bg-indigo-500' : 'border-gray-700'
                }`}>
                  {selectedFormat === opt.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
              </button>
            )
          })}
        </div>

        {/* Summary */}
        <div className="mx-6 mb-6 p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Export Summary</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-gray-600">Primary Color</div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border border-white/20" style={{ background: settings.colors.primary }} />
              <span className="text-gray-300 font-mono">{settings.colors.primary}</span>
            </div>
            <div className="text-gray-600">Secondary Color</div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border border-white/20" style={{ background: settings.colors.secondary }} />
              <span className="text-gray-300 font-mono">{settings.colors.secondary}</span>
            </div>
            <div className="text-gray-600">Custom Elements</div>
            <div className="text-gray-300">{Object.keys(settings.customStyles).length} overrides</div>
            <div className="text-gray-600">Format</div>
            <div className="text-indigo-400 font-bold uppercase">{selectedFormat}</div>
          </div>
        </div>

        {/* Action */}
        <div className="px-6 pb-6">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 disabled:opacity-60 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
          >
            {isExporting ? (
              <><Loader2 size={16} className="animate-spin" /> Exporting…</>
            ) : exported ? (
              <><CheckCircle2 size={16} /> Downloaded!</>
            ) : (
              <><Download size={16} /> Export {selectedFormat.toUpperCase()} <ArrowRight size={14} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
