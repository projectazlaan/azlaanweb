'use client'

import { useState } from 'react'
import { Wand2, X, Download, RefreshCw, Image as ImageIcon } from 'lucide-react'

interface BackgroundRemovalProps {
  imageSrc: string
  onSave: (resultImage: string) => void
  onCancel: () => void
}

export function BackgroundRemoval({ imageSrc, onSave, onCancel }: BackgroundRemovalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState('')

  const processImage = async () => {
    if (!apiKey) {
      setError('Please enter a Replicate API key')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/background-removal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: imageSrc, apiKey })
      })

      if (!response.ok) {
        throw new Error('Failed to process image')
      }

      const data = await response.json()
      setResult(data.result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadResult = () => {
    if (result) {
      const link = document.createElement('a')
      link.href = result
      link.download = 'removed-background.png'
      link.click()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-700 shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div>
            <h2 className="text-lg font-semibold text-white">AI Background Removal</h2>
            <p className="text-xs text-gray-400">Remove background using AI</p>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="text-sm text-gray-400 mb-2 block">Replicate API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="r8_..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">Get your API key from replicate.com</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-3">Original</h3>
              <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden border-2 border-dashed border-gray-700">
                <img src={imageSrc} alt="Original" className="w-full h-full object-contain" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-3">Result</h3>
              <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden border-2 border-dashed border-gray-700 relative">
                {result ? (
                  <img src={result} alt="Result" className="w-full h-full object-contain" />
                ) : isProcessing ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <RefreshCw size={48} className="text-indigo-400 animate-spin" />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    <ImageIcon size={48} />
                  </div>
                )}
                {result && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <button
                      onClick={downloadResult}
                      className="p-3 bg-white text-black rounded-full hover:bg-gray-200"
                    >
                      <Download size={24} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-4 border-t border-gray-800">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={processImage}
            disabled={isProcessing}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Wand2 size={16} />
                Remove Background
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}