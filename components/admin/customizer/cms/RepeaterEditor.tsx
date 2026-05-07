'use client'

import { useState } from 'react'
import { Repeat, Plus, Trash2, MoveUp, MoveDown, Save, Eye } from 'lucide-react'
import { getCollections, getCollectionItems, renderRepeater, type RepeaterOptions } from '@/lib/cms'

export function RepeaterEditor() {
  const [collections, setCollections] = useState(getCollections())
  const [selectedCollection, setSelectedCollection] = useState('')
  const [items, setItems] = useState<Record<string, unknown>[]>([])
  const [template, setTemplate] = useState('<div class="p-4 bg-gray-800 rounded-lg"><h3 class="text-white">{{title}}</h3><p class="text-gray-400">{{description}}</p></div>')
  const [containerId, setContainerId] = useState('repeater-container')
  const [result, setResult] = useState<{ success: boolean; renderedItems: number; error?: string } | null>(null)

  const loadItems = (slug: string) => {
    setSelectedCollection(slug)
    setItems(getCollectionItems(slug))
  }

  const handleRender = () => {
    if (!containerId || !template || items.length === 0) return

    const options: RepeaterOptions = {
      template,
      data: items,
      containerId
    }

    const res = renderRepeater(options)
    setResult(res)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Repeater / Loop Logic</h2>
        <p className="text-sm text-gray-400 mt-1">Create dynamic lists from data collections</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <Repeat size={16} />
              Data Source
            </h3>
            <select
              value={selectedCollection}
              onChange={e => loadItems(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="">Select collection...</option>
              {collections.map(c => (
                <option key={c.id} value={c.slug}>{c.name} ({c.items.length} items)</option>
              ))}
            </select>

            {items.length > 0 && (
              <div className="mt-3 text-sm text-gray-400">
                {items.length} items available for repeating
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <h3 className="text-sm font-medium text-white mb-3">HTML Template</h3>
            <p className="text-xs text-gray-400 mb-2">Use {'{{fieldName}}'} to insert data fields</p>
            <textarea
              value={template}
              onChange={e => setTemplate(e.target.value)}
              rows={6}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm font-mono"
              placeholder='<div class="item">{{title}}</div>'
            />
            <div className="mt-2 text-xs text-gray-500">
              Available fields: {collections.find(c => c.slug === selectedCollection)?.fields.map(f => f.name).join(', ') || 'none'}
            </div>
          </div>

          <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <h3 className="text-sm font-medium text-white mb-3">Container Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Container Element ID</label>
                <input
                  type="text"
                  value={containerId}
                  onChange={e => setContainerId(e.target.value)}
                  placeholder="e.g., blog-list, product-grid"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                />
              </div>
              <button
                onClick={handleRender}
                disabled={!selectedCollection || !template || !containerId}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Eye size={16} />
                Render Repeater
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <h3 className="text-sm font-medium text-white mb-3">Preview / Output</h3>
            <div
              id={containerId}
              className="min-h-48 bg-gray-900 rounded-lg p-4 border border-gray-700 overflow-auto"
            >
              {!result && (
                <div className="text-center text-gray-500 py-8">
                  <Repeat size={32} className="mx-auto mb-2" />
                  <p className="text-sm">Rendered items will appear here</p>
                </div>
              )}
            </div>
          </div>

          {result && (
            <div className={`p-4 rounded-lg border ${result.success ? 'bg-green-900/30 border-green-700' : 'bg-red-900/30 border-red-700'}`}>
              <div className="flex items-center gap-2 mb-2">
                {result.success ? (
                  <span className="text-green-400 text-sm">Successfully rendered {result.renderedItems} items</span>
                ) : (
                  <span className="text-red-400 text-sm">Error: {result.error}</span>
                )}
              </div>
            </div>
          )}

          {items.length > 0 && (
            <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
              <h3 className="text-sm font-medium text-white mb-3">Data Preview</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {items.slice(0, 3).map((item, index) => (
                  <div key={item.id as string} className="p-2 bg-gray-900 rounded text-xs">
                    <div className="text-gray-400 mb-1">Item #{index + 1}</div>
                    {Object.entries(item).slice(0, 4).map(([key, value]) => (
                      <div key={key} className="text-gray-300">
                        <span className="text-gray-500">{key}:</span> {String(value).slice(0, 30)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
