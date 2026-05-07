'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  X, Send, Loader2, Plus, Check, Copy,
  AlertCircle, ArrowUp, Key, SquareCode, Type, Palette,
  Trash2, Settings, MousePointer2, Zap, Globe, Cpu, User, BrainCircuit
} from 'lucide-react'
import { useStudioStore } from '../store'
import { usePostMessage } from '../hooks/usePostMessage'
import toast from 'react-hot-toast'
import { createPortal } from 'react-dom'

// ─── Types ──────────────────────────────────────────────────────

type AIMode = 'section' | 'text' | 'palette'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'error'
  content: string
  mode: AIMode
  applied?: boolean
}

// ─── Config ─────────────────────────────────────────────────────

const MODES = [
  { id: 'section' as AIMode, label: 'Build',  icon: <SquareCode size={11} />, hint: 'Generate HTML sections' },
  { id: 'text'    as AIMode, label: 'Write',  icon: <Type size={11} />,       hint: 'Edit & rewrite text' },
  { id: 'palette' as AIMode, label: 'Colors', icon: <Palette size={11} />,    hint: 'Generate palettes' },
]

const MODELS = [
  { id: 'gemini-high', name: 'Gemini 3.1 Pro (High)', tag: 'New',  free: true },
  { id: 'gemini-low',  name: 'Gemini 3.1 Pro (Low)',  tag: 'New',  free: true },
  { id: 'gemini',      name: 'Gemini 3 Flash',        tag: null,   free: true },
  { id: 'anthropic',   name: 'Claude Sonnet 4.6 (Thinking)', tag: null, free: false },
  { id: 'anthropic-opus', name: 'Claude Opus 4.6 (Thinking)', tag: null, free: false },
  { id: 'openai',      name: 'GPT-OSS 120B (Medium)', tag: null,  free: false },
]

const QUICK = {
  section: ['Modern hero with CTA', 'Feature cards grid', 'Pricing table', 'FAQ accordion'],
  text:    ['More professional tone', 'Shorter & punchier', 'Translate to English', 'Add emojis'],
  palette: ['Dark SaaS minimal', 'Warm luxury brand', 'Vibrant startup', 'Ocean & calm'],
}

// ─── Studio AI Logo ──────────────────────────────────────────────

function StudioLogo() {
  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-600/30 to-violet-600/20 blur-xl" />
      <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center shadow-lg shadow-indigo-600/30">
        <Zap size={22} className="text-white" fill="white" />
      </div>
    </div>
  )
}

// ─── Portaled Dropdowns (Fixes Clipping) ─────────────────────────

function FloatingMenu({ 
  triggerRef, 
  onClose, 
  children,
  width = 240,
  align = 'left'
}: { 
  triggerRef: React.RefObject<HTMLElement>, 
  onClose: () => void, 
  children: React.ReactNode,
  width?: number,
  align?: 'left' | 'right'
}) {
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const [isPositioned, setIsPositioned] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPos({
        top: rect.top - 10, // 10px spacing above the trigger
        left: align === 'left' ? rect.left : rect.right - width
      })
      setIsPositioned(true)
    }
  }, [triggerRef, width, align])

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      // Don't close if clicking the trigger itself
      if (triggerRef.current?.contains(e.target as Node)) return
      if (!menuRef.current?.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [onClose, triggerRef])

  if (!isPositioned) return null

  return createPortal(
    <div 
      ref={menuRef}
      className="fixed bg-[#1c1c1c] border border-white/5 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden z-[99999] p-1.5 animate-in fade-in zoom-in-95 duration-200"
      style={{
        top: pos.top,
        left: pos.left,
        width,
        transform: 'translateY(-100%)' // Move it entirely above the calculated top position
      }}
    >
      {children}
    </div>,
    document.body
  )
}

// ─── Main ────────────────────────────────────────────────────────

export default function AIGenerator({ iframeRef }: { iframeRef: React.RefObject<HTMLIFrameElement | null> }) {
  const { setAiOpen, settings, updateSettings, selectedElement } = useStudioStore()
  const { sendMessage, updateContent } = usePostMessage(iframeRef)

  const [mode, setMode]               = useState<AIMode>('section')
  const [prompt, setPrompt]           = useState('')
  const [messages, setMessages]       = useState<Message[]>([])
  const [isLoading, setIsLoading]     = useState(false)
  const [showModel, setShowModel]     = useState(false)
  const [showQuick, setShowQuick]     = useState(false)
  const [showSettingsPanel, setShowSettingsPanel] = useState(false)
  const [apiKeys, setApiKeys]         = useState<Record<string, string>>({})
  const [copiedId, setCopiedId]       = useState<string | null>(null)

  const endRef      = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const plusBtnRef  = useRef<HTMLButtonElement>(null)
  const modelBtnRef = useRef<HTMLButtonElement>(null)
  
  const activeModel = MODELS.find(m => m.id === settings.ai.model) || MODELS.find(m => m.id === settings.ai.provider) || MODELS[2] // Default to Gemini 3 Flash

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isLoading])

  const resizeTextarea = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }

  const handleAction = (id: string) => {
    if (id === 'clear') setMessages([])
    else if (id === 'search') toast('Web search enabled for this prompt', { icon: '🌐' })
    else if (id === 'analysis') toast('Analyzing current page structure...', { icon: '🔍' })
    else if (id === 'code') setMode('section')
  }

  // ── Send ──
  const send = useCallback(async (override?: string) => {
    const text = (override ?? prompt).trim()
    if (!text || isLoading) return

    const userMsg: Message = { id: `u${Date.now()}`, role: 'user', content: text, mode }
    setMessages(p => [...p, userMsg])
    setPrompt('')
    setShowQuick(false)
    setShowSettingsPanel(false)
    if (textareaRef.current) { textareaRef.current.style.height = '36px' }
    setIsLoading(true)

    try {
      const body: Record<string, any> = {
        prompt: text, mode,
        provider: settings.ai.provider,
        model: settings.ai.model,
        customKey: apiKeys[settings.ai.provider] || undefined,
      }
      if (selectedElement) {
        body.context = {
          tag: selectedElement.tagName,
          text: selectedElement.textContent,
          styles: selectedElement.computedStyles,
        }
      }

      const res  = await fetch('/api/studio-pro/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      const content = (mode === 'palette' && data.colors) ? JSON.stringify(data.colors, null, 2) : data.result
      setMessages(p => [...p, { id: `a${Date.now()}`, role: 'assistant', content, mode }])
    } catch (e: any) {
      setMessages(p => [...p, { id: `e${Date.now()}`, role: 'error', content: e.message, mode }])
    } finally {
      setIsLoading(false)
    }
  }, [prompt, mode, settings.ai.provider, apiKeys, selectedElement, isLoading])

  // ── Apply ──
  const apply = useCallback((msg: Message) => {
    if (msg.mode === 'section') {
      sendMessage({ type: 'INJECT_BLOCK', data: { html: msg.content } })
      toast.success('Section injected into canvas!', { icon: '⚡' })
    } else if (msg.mode === 'text') {
      if (!selectedElement) { toast.error('Select a canvas element first', { icon: '🎯' }); return }
      updateContent(selectedElement.key, msg.content)
      toast.success('Text updated!', { icon: '✏️' })
    } else if (msg.mode === 'palette') {
      try {
        const colors = JSON.parse(msg.content)
        updateSettings({ colors: { ...settings.colors, ...colors } })
        toast.success('Palette applied to theme!', { icon: '🎨' })
      } catch { toast.error('Invalid palette JSON') }
    }
    setMessages(p => p.map(m => m.id === msg.id ? { ...m, applied: true } : m))
  }, [selectedElement, sendMessage, updateContent, updateSettings, settings.colors])

  // ── Copy ──
  const copy = (msg: Message) => {
    navigator.clipboard.writeText(msg.content)
    setCopiedId(msg.id)
    setTimeout(() => setCopiedId(null), 2000)
    toast.success('Copied!')
  }

  return (
    <div className="flex flex-col h-full bg-[#111] relative">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/5 flex-shrink-0 z-10 bg-[#111]">
        {/* Mode tabs */}
        <div className="flex gap-0.5 bg-white/4 p-0.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {MODES.map(m => (
            <button
              key={m.id}
              onClick={() => { setMode(m.id); setShowSettingsPanel(false); }}
              title={m.hint}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-[9px] font-bold transition-all ${
                mode === m.id && !showSettingsPanel ? 'bg-white/10 text-white shadow' : 'text-gray-600 hover:text-gray-400'
              }`}
            >
              {m.icon}{m.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          {/* Settings replaces Delete */}
          <button 
            onClick={() => setShowSettingsPanel(v => !v)} 
            title="Advanced Settings" 
            className={`p-1.5 rounded-lg transition-all ${showSettingsPanel ? 'text-indigo-400 bg-white/10' : 'text-gray-600 hover:text-white hover:bg-white/5'}`}
          >
            <Settings size={12} />
          </button>
          <button onClick={() => setAiOpen(false)} className="p-1.5 text-gray-600 hover:text-white hover:bg-white/5 rounded-lg transition-all">
            <X size={13} />
          </button>
        </div>
      </div>

      {/* ── Main Scroll Area ── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        
        {/* Settings View */}
        {showSettingsPanel ? (
          <div className="p-5 h-full bg-[#111] animate-in fade-in slide-in-from-bottom-2 duration-300 z-20 relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center">
                <BrainCircuit size={18} className="text-indigo-400" />
              </div>
              <div>
                <h2 className="text-white text-[13px] font-bold">Studio AI Hub</h2>
                <p className="text-gray-500 text-[9px]">Manage models & API keys</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* API Keys Config */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-white/5 pb-2">Custom API Keys</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <label className="text-[11px] font-medium text-gray-300">OpenAI (GPT-4o, etc)</label>
                    <span className="text-[9px] text-green-500/80 bg-green-500/10 px-1.5 py-0.5 rounded">Optional</span>
                  </div>
                  <div className="relative">
                    <Key size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input 
                      type="password" 
                      placeholder="sk-proj-..."
                      value={apiKeys['openai'] || ''}
                      onChange={e => setApiKeys(p => ({ ...p, openai: e.target.value }))}
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-2 pl-8 pr-3 text-[11px] text-white placeholder-gray-700 focus:outline-none focus:border-indigo-500/50 transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <label className="text-[11px] font-medium text-gray-300">Anthropic (Claude 3.5)</label>
                    <span className="text-[9px] text-green-500/80 bg-green-500/10 px-1.5 py-0.5 rounded">Optional</span>
                  </div>
                  <div className="relative">
                    <Key size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input 
                      type="password" 
                      placeholder="sk-ant-..."
                      value={apiKeys['anthropic'] || ''}
                      onChange={e => setApiKeys(p => ({ ...p, anthropic: e.target.value }))}
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-2 pl-8 pr-3 text-[11px] text-white placeholder-gray-700 focus:outline-none focus:border-indigo-500/50 transition-all font-mono"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <label className="text-[11px] font-medium text-gray-300">Google Gemini</label>
                    <span className="text-[9px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">Built-in available</span>
                  </div>
                  <div className="relative">
                    <Key size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input 
                      type="password" 
                      placeholder="AIzaSy..."
                      value={apiKeys['gemini'] || ''}
                      onChange={e => setApiKeys(p => ({ ...p, gemini: e.target.value }))}
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-2 pl-8 pr-3 text-[11px] text-white placeholder-gray-700 focus:outline-none focus:border-indigo-500/50 transition-all font-mono"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : messages.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center min-h-[80%] pb-6 px-4 gap-4">
            <StudioLogo />
            <div className="text-center">
              <p className="text-white font-semibold text-[13px] mb-1">Studio AI Pro</p>
              <p className="text-[10px] text-gray-600 leading-relaxed">
                {selectedElement
                  ? `Ready to edit <${selectedElement.tagName.toLowerCase()}>`
                  : 'Select canvas element or describe what to build'}
              </p>
            </div>

            {/* Quick actions */}
            <div className="w-full space-y-1">
              <p className="text-[8px] font-black text-gray-700 uppercase tracking-[0.15em] px-1 mb-1.5 mt-4">Quick start</p>
              {QUICK[mode].map(q => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="w-full text-left px-3 py-2 rounded-xl border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-600/5 transition-all group"
                  style={{ background: 'rgba(255,255,255,0.02)' }}
                >
                  <span className="text-[10px] text-gray-500 group-hover:text-gray-300 transition-colors">{q}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Messages */
          <div className="px-3 py-3 space-y-3 pb-10">
            {messages.map(msg => (
              <div key={msg.id}>
                {/* User */}
                {msg.role === 'user' && (
                  <div className="flex justify-end">
                    <div className="max-w-[88%] px-3 py-2.5 bg-indigo-600/80 rounded-2xl rounded-tr-sm">
                      <p className="text-[11px] text-white leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                )}

                {/* Error */}
                {msg.role === 'error' && (
                  <div className="flex gap-2 p-2.5 bg-red-950/30 border border-red-500/20 rounded-xl">
                    <AlertCircle size={12} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-red-300 leading-relaxed">{msg.content}</p>
                  </div>
                )}

                {/* Assistant */}
                {msg.role === 'assistant' && (
                  <div className="flex gap-2 items-start">
                    <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                      <Zap size={9} className="text-white" fill="white" />
                    </div>
                    <div className="flex-1 min-w-0 bg-[#1c1c1c] border border-white/6 rounded-2xl rounded-tl-sm overflow-hidden">
                      <div className="p-3 max-h-52 overflow-y-auto custom-scrollbar">
                        <pre className="text-[10px] text-gray-300 leading-relaxed whitespace-pre-wrap break-words font-mono">{msg.content}</pre>
                      </div>
                      <div className="flex border-t border-white/5">
                        <button
                          onClick={() => apply(msg)}
                          disabled={msg.applied}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[9px] font-bold transition-all ${
                            msg.applied ? 'text-green-500' : 'text-indigo-400 hover:bg-indigo-600/10 hover:text-white'
                          }`}
                        >
                          {msg.applied ? <><Check size={9} /> Applied</> : <><Zap size={9} /> Apply to Canvas</>}
                        </button>
                        <div className="w-px bg-white/5" />
                        <button onClick={() => copy(msg)} className="px-3 text-gray-600 hover:text-white hover:bg-white/5 transition-all">
                          {copiedId === msg.id ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 items-center px-1">
                <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center">
                  <Loader2 size={9} className="text-white animate-spin" />
                </div>
                <div className="flex gap-1">
                  {[0, 150, 300].map(d => (
                    <span key={d} className="w-1.5 h-1.5 bg-indigo-500/60 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        )}
      </div>

      {/* ── Context badge ── */}
      {selectedElement && !showSettingsPanel && (
        <div className="mx-3 mb-1.5 px-2.5 py-1.5 rounded-xl border border-indigo-500/15 flex items-center gap-2" style={{ background: 'rgba(99,102,241,0.06)' }}>
          <MousePointer2 size={9} className="text-indigo-500 flex-shrink-0" />
          <code className="text-[9px] text-indigo-400 truncate flex-1 font-mono">
            &lt;{selectedElement.tagName.toLowerCase()}&gt;
            {selectedElement.textContent ? ` "${selectedElement.textContent.substring(0, 16)}…"` : ''}
          </code>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse flex-shrink-0" />
        </div>
      )}

      {/* ── Input bar ── */}
      <div className="mx-3 mb-3 bg-[#1a1a1a] border-none rounded-2xl flex-shrink-0 z-20">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={e => { setPrompt(e.target.value); resizeTextarea(e.target) }}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          placeholder={showSettingsPanel ? 'Ask Studio AI...' : mode === 'section' ? 'Describe a section to build…' : mode === 'text' ? 'How should I rewrite this?' : 'Describe a color palette…'}
          rows={1}
          style={{ height: '36px' }}
          className="w-full bg-transparent px-4 pt-3 pb-1 text-[11px] text-gray-200 placeholder-gray-600 focus:outline-none resize-none overflow-hidden leading-snug"
        />

        {/* Bottom actions */}
        <div className="flex items-center justify-between px-3 pb-2.5 pt-0.5">
          <div className="flex items-center gap-1">
            {/* Plus Actions Menu (Using Portal to avoid clipping) */}
            <button
              ref={plusBtnRef}
              onClick={() => { setShowQuick(v => !v); setShowModel(false) }}
              title="Plus actions"
              className={`p-1.5 rounded-xl transition-all ${showQuick ? 'text-indigo-400 bg-white/10' : 'text-gray-600 hover:text-gray-400 hover:bg-white/5'}`}
            >
              <Plus size={16} />
            </button>
            
            {showQuick && (
              <FloatingMenu triggerRef={plusBtnRef as React.RefObject<HTMLElement>} onClose={() => setShowQuick(false)} width={200} align="left">
                {[
                  { id: 'search',   label: 'Search Web',    icon: <Globe size={13} className="text-sky-400" />,   desc: 'Get real-time info' },
                  { id: 'analysis', label: 'Analyze Page',  icon: <SquareCode size={13} className="text-violet-400" />, desc: 'Deep structure check' },
                  { id: 'code',     label: 'Code Pro',      icon: <Cpu size={13} className="text-amber-400" />,   desc: 'Complex generation' },
                  { id: 'clear',    label: 'Clear Chat',    icon: <Trash2 size={13} className="text-red-400" />,    desc: 'Reset conversation' },
                ].map(a => (
                  <button
                    key={a.id}
                    onClick={() => { handleAction(a.id); setShowQuick(false) }}
                    className="w-full flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-all text-left group"
                  >
                    <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">
                      {a.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-semibold text-gray-200">{a.label}</p>
                      <p className="text-[7px] text-gray-500">{a.desc}</p>
                    </div>
                  </button>
                ))}
              </FloatingMenu>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Portaled Model Selector */}
            <button
              ref={modelBtnRef}
              onClick={() => { setShowModel(v => !v); setShowQuick(false); }}
              className="flex items-center justify-center px-3 py-1.5 bg-[#262626] hover:bg-[#333] rounded-xl transition-all border border-transparent hover:border-white/5"
            >
              <span className="text-[10px] font-semibold text-gray-400">{activeModel.name}</span>
            </button>
            
            {showModel && (
              <FloatingMenu triggerRef={modelBtnRef as React.RefObject<HTMLElement>} onClose={() => setShowModel(false)} width={260} align="right">
                <div className="px-3 py-1 mb-1 border-b border-white/5 pb-2">
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">AI Models</p>
                </div>
                {MODELS.map(m => {
                  const isActive = m.id === settings.ai.provider
                  return (
                    <button
                      key={m.id}
                      onClick={() => { 
                        const provider = (m.id.startsWith('gemini') ? 'gemini' : 
                                       m.id.startsWith('anthropic') ? 'anthropic' : 
                                       m.id === 'openai' ? 'openai' : 'gemini') as import('../types').AISettings['provider'];
                        // Store the model id (e.g., 'gemini-high') alongside provider
                        updateSettings({ ai: { ...settings.ai, provider, model: m.id } }); 
                        toast.success(`Switched to ${m.name}`, { icon: '🤖' });
                        setShowModel(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-left mb-0.5 ${
                        (settings.ai.model === m.id || (!settings.ai.model && settings.ai.provider === m.id))
                          ? 'bg-indigo-500/10 border border-indigo-500/20' 
                          : 'border border-transparent hover:bg-white/5'
                      }`}
                    >
                      <span className={`text-[11px] font-medium flex-1 ${isActive ? 'text-indigo-400' : 'text-gray-300'}`}>
                        {m.name}
                      </span>
                      {m.tag && (
                        <span className="px-1.5 py-0.5 bg-white/10 text-gray-300 rounded text-[7px] font-bold uppercase tracking-wider">
                          {m.tag}
                        </span>
                      )}
                    </button>
                  )
                })}
              </FloatingMenu>
            )}

            {/* Send */}
            <button
              onClick={() => send()}
              disabled={!prompt.trim() || isLoading}
              className="w-7 h-7 flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/10 disabled:text-gray-600 disabled:opacity-50 text-white rounded-lg transition-all shadow-md shadow-indigo-600/20"
            >
              {isLoading
                ? <Loader2 size={12} className="animate-spin" />
                : <ArrowUp size={13} strokeWidth={2.5} />
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

