'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit2, Database, Save, X, Type, Hash, ToggleLeft, Calendar, Image, Link } from 'lucide-react'
import { createCollection, getCollections, addCollectionItem, type Collection, type CollectionField } from '@/lib/cms'

const fieldTypes = [
  { value: 'text', label: 'Text', icon: Type },
  { value: 'number', label: 'Number', icon: Hash },
  { value: 'boolean', label: 'Boolean', icon: ToggleLeft },
  { value: 'date', label: 'Date', icon: Calendar },
  { value: 'image', label: 'Image', icon: Image },
  { value: 'url', label: 'URL', icon: Link },
  { value: 'richtext', label: 'Rich Text', icon: Type }
]

export function CollectionManager() {
  const [collections, setCollections] = useState<Collection[]>(() => getCollections())
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [collectionName, setCollectionName] = useState('')
  const [fields, setFields] = useState<Omit<CollectionField, 'id'>[]>([])
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null)
  const [newItem, setNewItem] = useState<Record<string, unknown>>({})

  const addField = () => {
    setFields([...fields, { name: '', type: 'text', required: false }])
  }

  const updateField = (index: number, updates: Partial<CollectionField>) => {
    setFields(fields.map((f, i) => i === index ? { ...f, ...updates } : f))
  }

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index))
  }

  const handleCreateCollection = () => {
    if (!collectionName.trim() || fields.length === 0) return

    const collectionFields: CollectionField[] = fields.map((f, i) => ({
      ...f,
      id: crypto.randomUUID(),
      name: f.name || `field_${i}`
    }))

    const newCollection = createCollection(collectionName, collectionFields)
    setCollections([...collections, newCollection])
    setCollectionName('')
    setFields([])
    setShowCreateModal(false)
  }

  const handleAddItem = (collection: Collection) => {
    if (!collection) return
    addCollectionItem(collection.slug, newItem)
    setNewItem({})
    setCollections([...getCollections()])
  }

  const renderFieldInput = (field: CollectionField) => {
    switch (field.type) {
      case 'number':
        return <input type="number" className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm" />
      case 'boolean':
        return <input type="checkbox" className="w-5 h-5 accent-indigo-600" />
      case 'date':
        return <input type="date" className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm" />
      case 'image':
      case 'url':
        return <input type="text" placeholder="Enter URL..." className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm flex-1" />
      default:
        return <input type="text" placeholder="Enter text..." className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm flex-1" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Visual Collection Manager</h2>
          <p className="text-sm text-gray-400 mt-1">Create and manage data collections (Blog, Testimonial, etc.)</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <Plus size={16} />
          New Collection
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map(collection => (
          <div
            key={collection.id}
            onClick={() => setSelectedCollection(collection)}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedCollection?.id === collection.id
                ? 'bg-indigo-900/30 border-indigo-500'
                : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Database size={18} className="text-indigo-400" />
              <h3 className="font-medium text-white">{collection.name}</h3>
            </div>
            <div className="text-xs text-gray-400 space-y-1">
              <p>{collection.fields.length} fields</p>
              <p>{collection.items.length} items</p>
              <p className="text-gray-500">Slug: {collection.slug}</p>
            </div>
          </div>
        ))}

        {collections.length === 0 && (
          <div className="col-span-full p-8 text-center text-gray-500">
            <Database size={48} className="mx-auto mb-3 text-gray-700" />
            <p>No collections yet. Create one to get started.</p>
          </div>
        )}
      </div>

      {selectedCollection && (
        <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">{selectedCollection.name} - Items</h3>
            <button onClick={() => setSelectedCollection(null)} className="text-gray-400 hover:text-white">
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            {selectedCollection.items.map((item, index) => (
              <div key={item.id as string} className="p-3 bg-gray-900 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Item #{index + 1}</span>
                  <button className="text-red-400 hover:text-red-300">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {selectedCollection.fields.map(field => (
                    <div key={field.id} className="text-sm">
                      <span className="text-gray-500">{field.name}:</span>{' '}
                      <span className="text-white">{String(item[field.name] || '-')}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
            <h4 className="text-sm font-medium text-white mb-3">Add New Item</h4>
            <div className="space-y-3">
              {selectedCollection.fields.map(field => (
                <div key={field.id} className="flex items-center gap-3">
                  <label className="text-sm text-gray-400 w-24">{field.name}</label>
                  {renderFieldInput(field)}
                </div>
              ))}
              <button
                onClick={() => handleAddItem(selectedCollection)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                <Save size={14} className="inline mr-2" />
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-700">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h3 className="text-lg font-semibold text-white">Create New Collection</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="mb-6">
                <label className="text-sm text-gray-400 mb-2 block">Collection Name</label>
                <input
                  type="text"
                  value={collectionName}
                  onChange={e => setCollectionName(e.target.value)}
                  placeholder="e.g., Blog, Testimonial, Product"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-white">Fields</h4>
                  <button onClick={addField} className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                    <Plus size={14} />
                    Add Field
                  </button>
                </div>

                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg">
                      <input
                        type="text"
                        value={field.name}
                        onChange={e => updateField(index, { name: e.target.value })}
                        placeholder="Field name"
                        className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-white text-sm"
                      />
                      <select
                        value={field.type}
                        onChange={e => updateField(index, { type: e.target.value as CollectionField['type'] })}
                        className="bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-white text-sm"
                      >
                        {fieldTypes.map(ft => (
                          <option key={ft.value} value={ft.value}>{ft.label}</option>
                        ))}
                      </select>
                      <label className="flex items-center gap-2 text-sm text-gray-400">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={e => updateField(index, { required: e.target.checked })}
                          className="accent-indigo-600"
                        />
                        Required
                      </label>
                      <button onClick={() => removeField(index)} className="text-red-400 hover:text-red-300">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}

                  {fields.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No fields added yet.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t border-gray-800">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCollection}
                disabled={!collectionName.trim() || fields.length === 0}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                Create Collection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
