'use client'
import { useState, useEffect } from 'react'
import { Database, Link2, Unlink, Check, X, Search, LayoutGrid, Eye } from 'lucide-react'
import { getCollections, getCollectionItems, bindData, unbindData, getBindings, type BindingOptions } from '@/lib/cms'
export function DataBinding() {
  const [collections, setCollections] = useState(getCollections())
  const [selectedCollection, setSelectedCollection] = useState<string>('')
  const [items, setItems] = useState<Record<string, unknown>[]>([])
  const [selectedField, setSelectedField] = useState<string>('')
  const [targetElementId, setTargetElementId] = useState<string>('')
  const [bindings, setBindings] = useState<BindingOptions[]>([])
  const [previewMode, setPreviewMode] = useState(false)
  useEffect(() => {
    setBindings(getBindings())
  }, [])
  useEffect(() => {
    if (selectedCollection) {
      setItems(getCollectionItems(selectedCollection))
    }
  }, [selectedCollection])
  const handleBind = () => {
    if (!selectedCollection || !selectedField || !targetElementId) return
    const result = bindData(targetElementId, selectedField, selectedCollection)
    if (result.success) {
      setBindings(getBindings())
      alert(`Successfully bound "${selectedField}" to element #${targetElementId}`)
    } else {
      alert(`Error: ${result.error}`)
    }
  }
  const handleUnbind = (elementId: string) => {
    unbindData(elementId)
    setBindings(getBindings())
  }
  const handlePreview = () => {
    if (!selectedCollection || items.length === 0) return
    const firstItem = items[0]
    bindings.forEach(binding => {
      const element = document.getElementById(binding.elementId)
      if (!element) return
      const value = binding.field.split('.').reduce<unknown>((obj, key) => (obj as Record<string, unknown>)?.[key], firstItem as unknown)
      if (element.tagName === 'IMG' && binding.field.includes('image')) {
        (element as HTMLImageElement).src = value as string
      } else {
        element.textContent = String(value || '')
      }
    })
    setPreviewMode(true)
  }
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">No-Code Data Binding</h2>
        <p className="text-sm text-gray-400 mt-1">Drag database fields to elements or bind via UI</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <Database size={16} />
              Collections
            </h3>
            <select
              value={selectedCollection}
              onChange={e => setSelectedCollection(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="">Select a collection...</option>
              {collections.map(c => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
          {selectedCollection && (
            <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
              <h3 className="text-sm font-medium text-white mb-3">Fields</h3>
              <div className="space-y-2">
                {collections.find(c => c.slug === selectedCollection)?.fields.map(field => (
                  <div
                    key={field.id}
                    draggable
                    onDragStart={e => {
                      e.dataTransfer.setData('text/plain', JSON.stringify({
                        field: field.name,
                        collection: selectedCollection
                      }))
                    }}
                    className="p-2 bg-gray-700 rounded-lg text-sm text-white cursor-grab hover:bg-gray-600 flex items-center gap-2"
                  >
                    <Link2 size={14} className="text-indigo-400" />
                    {field.name} <span className="text-gray-400">({field.type})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {items.length > 0 && (
            <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
              <h3 className="text-sm font-medium text-white mb-3">Sample Data</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {items.slice(0, 3).map((item, index) => (
                  <div key={item.id as string} className="p-2 bg-gray-900 rounded text-xs">
                    <div className="text-gray-400 mb-1">Item #{index + 1}</div>
                    {Object.entries(item).slice(0, 3).map(([key, value]) => (
                      <div key={key} className="text-gray-300">
                        <span className="text-gray-500">{key}:</span> {String(value).slice(0, 20)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="lg:col-span-2 space-y-4">
          <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <h3 className="text-sm font-medium text-white mb-3">Bind to Element</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Target Element ID</label>
                <input
                  type="text"
                  value={targetElementId}
                  onChange={e => setTargetElementId(e.target.value)}
                  placeholder="Enter element ID (e.g., title-1)"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Select Field</label>
                <select
                  value={selectedField}
                  onChange={e => setSelectedField(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                >
                  <option value="">Select a field...</option>
                  {collections.find(c => c.slug === selectedCollection)?.fields.map(f => (
                    <option key={f.id} value={f.name}>{f.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleBind}
                  disabled={!selectedField || !targetElementId}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm flex items-center gap-2"
                >
                  <Link2 size={14} />
                  Bind Data
                </button>
                <button
                  onClick={handlePreview}
                  disabled={bindings.length === 0}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm flex items-center gap-2"
                >
                  <Eye size={14} />
                  Preview Binding
                </button>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <LayoutGrid size={16} />
              Active Bindings ({bindings.length})
            </h3>
            <div className="space-y-2">
              {bindings.map((binding, index) => (
                <div key={index} className="p-3 bg-gray-900 rounded-lg flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-white">{binding.field}</span>
                    <span className="text-gray-400"> → #{binding.elementId}</span>
                    <span className="text-gray-500 text-xs ml-2">({binding.collectionSlug})</span>
                  </div>
                  <button
                    onClick={() => handleUnbind(binding.elementId)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Unlink size={14} />
                  </button>
                </div>
              ))}
              {bindings.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No bindings yet.</p>
              )}
            </div>
          </div>
          <div
            className="p-6 bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-700 min-h-32"
            onDragOver={e => {
              e.preventDefault()
              e.currentTarget.classList.add('border-indigo-500', 'bg-indigo-900/20')
            }}
            onDragLeave={e => {
              e.currentTarget.classList.remove('border-indigo-500', 'bg-indigo-900/20')
            }}
            onDrop={e => {
              e.preventDefault()
              e.currentTarget.classList.remove('border-indigo-500', 'bg-indigo-900/20')
              const data = e.dataTransfer.getData('text/plain')
              if (data) {
                const { field, collection } = JSON.parse(data)
                const elementId = prompt('Enter target element ID:')
                if (elementId) {
                  bindData(elementId, field, collection)
                  setBindings(getBindings())
                }
              }
            }}
          >
            <div className="text-center text-gray-500">
              <Link2 size={24} className="mx-auto mb-2" />
              <p className="text-sm">Drop fields here to bind data</p>
              <p className="text-xs mt-1">Or use the form on the left</p>
            </div>
          </div>
        </div>
      </div>
      {previewMode && (
        <div className="p-4 bg-green-900/30 border border-green-700 rounded-lg">
          <div className="flex items-center gap-2 text-green-400">
            <Check size={16} />
            <span className="text-sm">Preview mode active. Check your canvas for bound data.</span>
          </div>
        </div>
      )}
    </div>
  )
}
