'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, X, Link, Cloud, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface UploadFile {
  id: string
  file?: File
  url?: string
  preview?: string
  status: 'pending' | 'uploading' | 'complete' | 'error'
  progress: number
  error?: string
}

interface MediaHubOverlayProps {
  isOpen: boolean
  onClose: () => void
  onUploadComplete: (files: UploadFile[]) => void
}

export function MediaHubOverlay({ isOpen, onClose, onUploadComplete }: MediaHubOverlayProps) {
  const [mode, setMode] = useState<'upload' | 'url'>('upload')
  const [urlInput, setUrlInput] = useState('')
  const [urlList, setUrlList] = useState<string[]>([])
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const newFiles: UploadFile[] = selectedFiles.map(file => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      status: 'pending' as const,
      progress: 0
    }))
    setFiles(prev => [...prev, ...newFiles])
    processUploads([...newFiles])
  }, [])

  const addUrl = () => {
    if (urlInput.trim()) {
      setUrlList(prev => [...prev, urlInput.trim()])
      setUrlInput('')
    }
  }

  const removeUrl = (index: number) => {
    setUrlList(prev => prev.filter((_, i) => i !== index))
  }

  const processUploads = async (filesToUpload: UploadFile[]) => {
    setIsProcessing(true)
    
    for (const uploadFile of filesToUpload) {
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id ? { ...f, status: 'uploading' as const, progress: 10 } : f
      ))

      await simulateUpload(uploadFile.id)

      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id ? { ...f, status: 'complete' as const, progress: 100 } : f
      ))
    }

    setIsProcessing(false)
  }

  const simulateUpload = (fileId: string) => {
    return new Promise<void>(resolve => {
      let progress = 10
      const interval = setInterval(() => {
        progress += Math.random() * 20
        if (progress >= 90) {
          clearInterval(interval)
          resolve()
        }
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, progress: Math.min(progress, 90) } : f
        ))
      }, 200)
    })
  }

  const processUrls = async () => {
    if (urlList.length === 0) return
    setIsProcessing(true)

    const urlFiles: UploadFile[] = urlList.map(url => ({
      id: crypto.randomUUID(),
      url,
      preview: url,
      status: 'uploading' as const,
      progress: 10
    }))
    setFiles(prev => [...prev, ...urlFiles])

    for (const urlFile of urlFiles) {
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
      setFiles(prev => prev.map(f => 
        f.id === urlFile.id ? { ...f, status: 'complete' as const, progress: 100 } : f
      ))
    }

    setIsProcessing(false)
    setUrlList([])
  }

  const removeFile = (id: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id)
      if (file?.preview && file.file) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter(f => f.id !== id)
    })
  }

  const handleConfirm = () => {
    const completedFiles = files.filter(f => f.status === 'complete')
    onUploadComplete(completedFiles)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-gray-700 shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div>
            <h2 className="text-lg font-semibold text-white">Media Hub</h2>
            <p className="text-xs text-gray-400">Upload or import media files</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="flex border-b border-gray-800">
          <button
            onClick={() => setMode('upload')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              mode === 'upload' 
                ? 'text-indigo-400 border-b-2 border-indigo-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Upload size={16} className="inline mr-2" />
            Bulk Upload
          </button>
          <button
            onClick={() => setMode('url')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              mode === 'url' 
                ? 'text-indigo-400 border-b-2 border-indigo-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Link size={16} className="inline mr-2" />
            URL Import
          </button>
        </div>

        <div className="p-4 max-h-[400px] overflow-y-auto">
          {mode === 'upload' && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-500 transition-colors"
              >
                <Cloud size={48} className="mx-auto text-gray-500 mb-3" />
                <p className="text-white font-medium">Drop files here or click to upload</p>
                <p className="text-sm text-gray-500 mt-1">Supports images and videos</p>
              </div>
            </div>
          )}

          {mode === 'url' && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addUrl()}
                  placeholder="Enter image URL..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={addUrl}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Add
                </button>
              </div>

              {urlList.length > 0 && (
                <div className="space-y-2">
                  {urlList.map((url, i) => (
                    <div key={i} className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
                      <Link size={14} className="text-gray-400" />
                      <span className="flex-1 text-sm text-white truncate">{url}</span>
                      <button onClick={() => removeUrl(i)} className="text-gray-400 hover:text-red-400">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={processUrls}
                    disabled={isProcessing}
                    className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : 'Import All URLs'}
                  </button>
                </div>
              )}
            </div>
          )}

          {files.length > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {files.map(file => (
                <div key={file.id} className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden">
                  {file.preview && (
                    <img src={file.preview} alt="" className="w-full h-full object-cover" />
                  )}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="absolute top-1 right-1 p-1 bg-black/60 rounded-full"
                  >
                    <X size={12} className="text-white" />
                  </button>
                  {file.status === 'uploading' && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Loader2 size={20} className="text-indigo-400 animate-spin" />
                    </div>
                  )}
                  {file.status === 'complete' && (
                    <div className="absolute top-1 left-1 p-1 bg-green-600 rounded-full">
                      <CheckCircle size={12} className="text-white" />
                    </div>
                  )}
                  {file.status === 'error' && (
                    <div className="absolute inset-0 bg-red-900/60 flex items-center justify-center">
                      <AlertCircle size={20} className="text-white" />
                    </div>
                  )}
                  {file.status === 'uploading' && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                      <div 
                        className="h-full bg-indigo-500 transition-all" 
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-4 border-t border-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={files.filter(f => f.status === 'complete').length === 0 || isProcessing}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add {files.filter(f => f.status === 'complete').length} Files
          </button>
        </div>
      </div>
    </div>
  )
}

export type { UploadFile }