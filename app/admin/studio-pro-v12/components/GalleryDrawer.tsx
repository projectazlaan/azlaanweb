'use client'
import { useState, useCallback, useRef } from 'react'
import { X, Upload, Search, Grid, List, Heart, Trash2, Image as ImageIcon, FolderOpen } from 'lucide-react'
import { useGallery } from '../store'
import toast from 'react-hot-toast'
export default function GalleryDrawer() {
  const {
    images, isOpen, isLoading, filters, viewMode,
    closeGallery, uploadImages, deleteImage,
    toggleFavorite, setFilters, setViewMode,
    onSelectCallback,
  } = useGallery()
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const filteredImages = images.filter(img => {
    if (filters.favorites && !img.favorite) return false
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase()
      if (!img.filename.toLowerCase().includes(q)) return false
    }
    return true
  })
  const handleSelect = (url: string) => {
    if (onSelectCallback) {
      onSelectCallback(url)
      closeGallery()
      toast.success('Image selected!')
    }
  }
  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return
    const fileArr = Array.from(files)
    const toastId = toast.loading(`Uploading ${fileArr.length} file(s)…`)
    await uploadImages(fileArr)
    toast.success(`${fileArr.length} file(s) uploaded!`, { id: toastId })
    setActiveTab('library')
  }, [uploadImages])
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    await deleteImage(id)
    toast.success('Image deleted')
  }
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeGallery} />
      {/* Drawer */}
      <div className="relative w-full max-w-2xl bg-[#111] border-l border-white/10 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h2 className="text-white font-bold text-lg">Media Gallery</h2>
            <p className="text-gray-500 text-xs mt-0.5">{images.length} files</p>
          </div>
          <button onClick={closeGallery} className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-xl transition-all">
            <X size={18} />
          </button>
        </div>
        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {(['library', 'upload'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-bold transition-all capitalize ${
                activeTab === tab
                  ? 'text-white border-b-2 border-indigo-500'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              {tab === 'library' ? '📁 Library' : '⬆️ Upload'}
            </button>
          ))}
        </div>
        {activeTab === 'library' && (
          <>
            {/* Search + Controls */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
              <div className="flex-1 relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search files…"
                  value={filters.searchQuery}
                  onChange={e => setFilters({ searchQuery: e.target.value })}
                  className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <button
                onClick={() => setFilters({ favorites: !filters.favorites })}
                className={`p-2 rounded-xl transition-all ${filters.favorites ? 'bg-pink-500/20 text-pink-400' : 'text-gray-500 hover:text-white hover:bg-white/10'}`}
                title="Show favorites"
              >
                <Heart size={16} />
              </button>
              <div className="flex bg-white/5 rounded-xl p-1">
                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-500'}`}><Grid size={14} /></button>
                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-500'}`}><List size={14} /></button>
              </div>
            </div>
            {/* Image Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filteredImages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-gray-600">
                  <FolderOpen size={32} className="mb-3 opacity-50" />
                  <p className="text-sm">No images yet. Upload some!</p>
                </div>
              ) : (
                <div className={viewMode === 'grid'
                  ? 'grid grid-cols-3 md:grid-cols-4 gap-3'
                  : 'flex flex-col gap-2'
                }>
                  {filteredImages.map(img => (
                    <div
                      key={img.id}
                      className={`group relative cursor-pointer rounded-xl overflow-hidden border border-white/5 hover:border-indigo-500/50 transition-all ${
                        viewMode === 'list' ? 'flex items-center gap-3 p-2 bg-white/5 hover:bg-white/10' : 'aspect-square bg-white/5'
                      }`}
                      onClick={() => handleSelect(img.url)}
                    >
                      {viewMode === 'grid' ? (
                        <>
                          <img src={img.url} alt={img.altText || img.filename} className="w-full h-full object-cover" loading="lazy" />
                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button onClick={e => { e.stopPropagation(); toggleFavorite(img.id) }} className={`p-2 rounded-full bg-black/60 transition-colors ${img.favorite ? 'text-pink-400' : 'text-white'}`}>
                              <Heart size={14} />
                            </button>
                            <button onClick={e => handleDelete(img.id, e)} className="p-2 rounded-full bg-black/60 text-red-400 hover:text-red-300 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <img src={img.url} alt={img.filename} className="w-12 h-12 object-cover rounded-lg flex-shrink-0" loading="lazy" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{img.filename}</p>
                            <p className="text-xs text-gray-500">{(img.size / 1024).toFixed(1)} KB</p>
                          </div>
                          <button onClick={e => handleDelete(img.id, e)} className="p-1.5 text-gray-600 hover:text-red-400 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
        {activeTab === 'upload' && (
          <div className="flex-1 p-6 flex flex-col gap-4">
            {/* Drop Zone */}
            <div
              onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex-1 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed cursor-pointer transition-all ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-500/10'
                  : 'border-white/10 hover:border-white/30 hover:bg-white/5'
              }`}
            >
              <Upload size={32} className={`mb-4 ${isDragging ? 'text-indigo-400' : 'text-gray-600'}`} />
              <p className="text-white font-bold mb-1">Drop files here</p>
              <p className="text-gray-500 text-sm">or click to browse</p>
              <p className="text-gray-600 text-xs mt-2">JPG, PNG, WebP, GIF, SVG — max 10MB</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={e => handleFiles(e.target.files)}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <Upload size={16} />
              Choose Files
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
