'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, X, Bot, User, Sparkles, RefreshCw, Download, Code, Eye } from 'lucide-react'
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}
interface SectionPreview {
  html: string
  css: string
}
interface PromptToSectionProps {
  onSave: (section: SectionPreview) => void
  onCancel: () => void
}
export function PromptToSection({ onSave, onCancel }: PromptToSectionProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI design assistant. Describe what you want to create, and I'll generate a section for you. For example: 'Create a hero section with a dark gradient background, centered headline, and CTA button'",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [preview, setPreview] = useState<SectionPreview | null>(null)
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview')
  const [apiKey, setApiKey] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  const sendMessage = async () => {
    if (!input.trim() || isProcessing) return
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsProcessing(true)
    try {
      const response = await fetch('/api/ai/prompt-to-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, apiKey })
      })
      if (!response.ok) {
        throw new Error('Failed to generate section')
      }
      const data = await response.json()
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.result.explanation,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      setPreview({ html: data.result.html, css: data.result.css })
    } catch (err) {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `I encountered an error: ${err instanceof Error ? err.message : 'Unknown error'}. Please try again.`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden border border-gray-700 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Bot size={20} className="text-indigo-400" />
              AI Prompt-to-Section
            </h2>
            <p className="text-xs text-gray-400">Generate UI sections from natural language</p>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>
        <div className="flex-1 flex overflow-hidden">
          <div className="w-1/2 border-r border-gray-800 flex flex-col">
            <div className="p-4 border-b border-gray-800">
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="Enter API key (optional - uses fallback prompts if empty)"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.role === 'user' ? 'bg-indigo-600' : 'bg-gray-700'
                  }`}>
                    {msg.role === 'user' ? (
                      <User size={16} className="text-white" />
                    ) : (
                      <Bot size={16} className="text-indigo-400" />
                    )}
                  </div>
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-800 text-gray-200'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    <Sparkles size={16} className="text-indigo-400 animate-pulse" />
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <p className="text-sm text-gray-400">Generating section...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-800">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Describe your section..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isProcessing}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
          <div className="w-1/2 flex flex-col">
            <div className="p-3 border-b border-gray-800 flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('preview')}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    viewMode === 'preview' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Eye size={14} className="inline mr-1" />
                  Preview
                </button>
                <button
                  onClick={() => setViewMode('code')}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    viewMode === 'code' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Code size={14} className="inline mr-1" />
                  Code
                </button>
              </div>
              {preview && (
                <button
                  onClick={() => setPreview(null)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  title="Clear preview"
                >
                  <RefreshCw size={16} className="text-gray-400" />
                </button>
              )}
            </div>
            <div className="flex-1 overflow-auto bg-white">
              {preview ? (
                viewMode === 'preview' ? (
                  <div className="p-4">
                    <style>{preview.css}</style>
                    <div dangerouslySetInnerHTML={{ __html: preview.html }} />
                  </div>
                ) : (
                  <div className="p-4 font-mono text-sm">
                    <div className="mb-4">
                      <h3 className="text-gray-500 mb-2">HTML</h3>
                      <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto text-gray-800 whitespace-pre-wrap">
                        {preview.html}
                      </pre>
                    </div>
                    <div>
                      <h3 className="text-gray-500 mb-2">CSS</h3>
                      <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto text-gray-800 whitespace-pre-wrap">
                        {preview.css}
                      </pre>
                    </div>
                  </div>
                )
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <Bot size={48} className="mx-auto mb-3 text-gray-300" />
                    <p>Generated section will appear here</p>
                  </div>
                </div>
              )}
            </div>
            {preview && (
              <div className="p-4 border-t border-gray-800 flex justify-end">
                <button
                  onClick={() => onSave(preview)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Download size={16} />
                  Save Section
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export type { SectionPreview }