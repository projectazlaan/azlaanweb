'use client'

import { useState } from 'react'
import { Download, FileCode, Globe, Layers, Check } from 'lucide-react'
import { exportComponents, exportToNextJS, exportToStaticHTML, exportToVue, downloadFile } from '@/lib/export/frameworks'

interface FrameworkExportProps {
  components?: any[]
}

type Framework = 'nextjs' | 'static-html' | 'vue'

export default function FrameworkExport({ components = [] }: FrameworkExportProps) {
  const [selectedFramework, setSelectedFramework] = useState<Framework>('nextjs')
  const [ssr, setSsr] = useState(true)
  const [pageName, setPageName] = useState('ExportedPage')
  const [exported, setExported] = useState(false)
  const [jsonInput, setJsonInput] = useState('')

  const frameworks = [
    {
      id: 'nextjs' as const,
      name: 'Next.js',
      icon: <Layers size={20} />,
      description: 'Server-side rendering with App Router support',
      color: 'blue'
    },
    {
      id: 'static-html' as const,
      name: 'Static HTML',
      icon: <Globe size={20} />,
      description: 'Pure HTML with Tailwind CSS CDN',
      color: 'green'
    },
    {
      id: 'vue' as const,
      name: 'Vue.js',
      icon: <FileCode size={20} />,
      description: 'Vue 3 Composition API with scoped styles',
      color: 'purple'
    }
  ]

  const handleExport = () => {
    try {
      let parsed: any[] = []
      
      if (jsonInput.trim()) {
        parsed = JSON.parse(jsonInput)
      } else if (components.length > 0) {
        parsed = components
      } else {
        alert('No components to export. Provide JSON input or use current components.')
        return
      }
      
      if (!Array.isArray(parsed)) {
        parsed = [parsed]
      }

      let code: string
      let filename: string
      let mimeType: string

      switch (selectedFramework) {
        case 'nextjs':
          code = exportToNextJS(parsed, pageName, ssr)
          filename = `${pageName}.tsx`
          mimeType = 'text/typescript'
          break
        case 'static-html':
          code = exportToStaticHTML(parsed)
          filename = 'index.html'
          mimeType = 'text/html'
          break
        case 'vue':
          code = exportToVue(parsed, pageName)
          filename = `${pageName}.vue`
          mimeType = 'text/vue'
          break
      }

      const blob = new Blob([code], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setExported(true)
      setTimeout(() => setExported(false), 3000)
    } catch (err) {
      alert(`Export error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white flex items-center gap-2">
          <Download size={18} className="text-indigo-400" />
          Multi-Framework Export
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {frameworks.map(fw => (
          <button
            key={fw.id}
            onClick={() => setSelectedFramework(fw.id)}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selectedFramework === fw.id
                ? `border-${fw.color}-500 bg-${fw.color}-900/30`
                : 'border-gray-700 bg-gray-800 hover:border-gray-600'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {fw.icon}
              <span className="text-white font-medium">{fw.name}</span>
              {selectedFramework === fw.id && (
                <Check size={16} className={`ml-auto text-${fw.color}-400`} />
              )}
            </div>
            <p className="text-xs text-gray-400">{fw.description}</p>
          </button>
        ))}
      </div>

      <div className="space-y-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Page Name</label>
            <input
              type="text"
              value={pageName}
              onChange={(e) => setPageName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>
          
          {selectedFramework === 'nextjs' && (
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ssr}
                  onChange={(e) => setSsr(e.target.checked)}
                  className="rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
                />
                Enable SSR
              </label>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">JSON Input (optional)</label>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='Paste component JSON or leave empty to use current components'
            className="w-full h-24 bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-200 text-xs font-mono resize-none focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      <button
        onClick={handleExport}
        className={`w-full py-3 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2 ${
          exported 
            ? 'bg-green-600 hover:bg-green-700' 
            : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        {exported ? <Check size={18} /> : <Download size={18} />}
        {exported ? 'Exported Successfully!' : `Export as ${frameworks.find(f => f.id === selectedFramework)?.name}`}
      </button>
    </div>
  )
}
