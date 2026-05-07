'use client'

import { useState } from 'react'
import { Sparkles, X, Copy, Check, Tags, FileText } from 'lucide-react'

interface AltTextGeneratorProps {
  imageSrc: string
  onSave: (data: { altText: string; tags: string[] }) => void
  onCancel: () => void
}

interface AnalysisResult {
  altText: string
  tags: string[]
  description: string
}

export function AltTextGenerator({ imageSrc, onSave, onCancel }: AltTextGeneratorProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState('')
  const [copied, setCopied] = useState(false)

  const analyzeImage = async () => {
    if (!apiKey) {
      setError('Please enter a Google AI API key')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/alt-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: imageSrc, apiKey })
      })

      if (!response.ok) {
        throw new Error('Failed to analyze image')
      }

      const data = await response.json()
      setResult(data.result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = () => {
    if (result) {
      onSave({ altText: result.altText, tags: result.tags })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-gray-700 shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div>
            <h2 className="text-lg font-semibold text-white">AI Alt-text & Auto-tagging</h2>
            <p className="text-xs text-gray-400">Generate accessibility text and tags</p>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="text-sm text-gray-400 mb-2 block">Google AI API Key (Gemini)</label>
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="AIza..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">Get your API key from Google AI Studio</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-3">Image</h3>
              <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden border-2 border-dashed border-gray-700">
                <img src={imageSrc} alt="To analyze" className="w-full h-full object-contain" />
              </div>
            </div>
            <div className="space-y-4">
              {result ? (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2">
                        <FileText size={16} />
                        Alt Text
                      </h3>
                      <button
                        onClick={() => copyToClipboard(result.altText)}
                        className="text-gray-400 hover:text-white"
                      >
                        {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                    <p className="text-white text-sm bg-gray-800 p-3 rounded-lg">{result.altText}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2 mb-2">
                      <Tags size={16} />
                      Auto-tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-indigo-900/50 text-indigo-300 text-sm rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  {isProcessing ? (
                    <div className="text-center">
                      <Sparkles size={32} className="mx-auto mb-2 text-indigo-400 animate-pulse" />
                      <p>Analyzing image...</p>
                    </div>
                  ) : (
                    <p>Click "Generate" to analyze</p>
                  )}
                </div>
              )}
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
            onClick={analyzeImage}
            disabled={isProcessing}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Sparkles size={16} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generate
              </>
            )}
          </button>
          {result && (
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  )
}