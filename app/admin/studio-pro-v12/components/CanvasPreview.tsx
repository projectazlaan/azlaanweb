'use client'
import { useRef, useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import {
  Monitor, Tablet, Smartphone, RefreshCw, ExternalLink,
  ZoomIn, ZoomOut, Maximize2, ChevronDown, Layout, ChevronRight,
  Clock, Search, Globe, Shield, ShieldCheck, ArrowRight, Sparkles,
  ChevronLeft
} from 'lucide-react'
import { useStudioStore, useDeviceMode } from '../store'
import { usePostMessage } from '../hooks/usePostMessage'
interface CanvasPreviewProps {
  iframeRef: React.RefObject<HTMLIFrameElement | null>
}
const DEVICE_CONFIG = {
  desktop:  { width: '100%',  height: '100%',  label: 'Desktop',  icon: Monitor },
  tablet:   { width: '768px', height: '100%',  label: 'Tablet',   icon: Tablet },
  mobile:   { width: '390px', height: '100%',  label: 'Mobile',   icon: Smartphone },
} as const
// ─── Page Tree Definition ──────────────────────────────────────
type PageNode = {
  label: string
  icon: string
  path?: string
  children?: { label: string; icon: string; path: string }[]
}
const SITE_PAGES: PageNode[] = [
  { label: 'Home Page',         icon: '🏠', path: '/' },
  { label: 'About Us',          icon: '✨', path: '/about' },
  { label: 'Blog / News',       icon: '📝', path: '/blog' },
  { label: 'Portfolio',         icon: '💼', path: '/portfolio' },
  { label: 'Contact Us',        icon: '📞', path: '/contact' },
  {
    label: 'Shop & Categories',
    icon: '🛍️',
    children: [
      { label: 'All Products',   icon: '📦', path: '/shop' },
      { label: 'Electronics',    icon: '💻', path: '/shop/electronics' },
      { label: 'Fashion / Wear', icon: '👕', path: '/shop/fashion' },
      { label: 'Home & Living',  icon: '🏡', path: '/shop/home' },
      { label: 'Special Offers', icon: '🔥', path: '/shop/offers' },
    ],
  },
  {
    label: 'Our Services',
    icon: '🛠️',
    children: [
      { label: 'Web Design',     icon: '🎨', path: '/services/design' },
      { label: 'Development',    icon: '🚀', path: '/services/dev' },
      { label: 'SEO & Growth',   icon: '📈', path: '/services/seo' },
      { label: 'Consultation',   icon: '🤝', path: '/services/consult' },
    ],
  },
]
// ─── Portal Dropdown ───────────────────────────────────────────
function PageNavigatorPortal({
  anchorRef,
  isOpen,
  onClose,
  onSelect,
}: {
  anchorRef: React.RefObject<HTMLButtonElement | null>
  isOpen: boolean
  onClose: () => void
  onSelect: (path: string) => void
}) {
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    if (isOpen && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect()
      setPos({ top: rect.bottom + 8, left: rect.left })
    }
    if (!isOpen) setExpandedCategory(null)
  }, [isOpen, anchorRef])
  if (!mounted || !isOpen) return null
  return createPortal(
    <>
      <div className="fixed inset-0" style={{ zIndex: 99998 }} onClick={onClose} />
      <div
        style={{
          position: 'fixed',
          top: pos.top,
          left: pos.left,
          zIndex: 99999,
          width: 320,
        }}
      >
        <div className="bg-[#111] border border-white/10 rounded-[24px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-3xl">
          <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Sitemap Explorer</span>
            <Layout size={14} className="text-gray-600" />
          </div>
          <div className="p-2 max-h-[450px] overflow-y-auto">
            {SITE_PAGES.map((page, i) => {
              const hasChildren = !!page.children
              const isExpanded = expandedCategory === page.label
              return (
                <div key={i} className="mb-1">
                  <button
                    onClick={() => hasChildren ? setExpandedCategory(isExpanded ? null : page.label) : page.path && onSelect(page.path)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-2xl transition-all group ${isExpanded ? 'bg-indigo-500/10 border border-indigo-500/20' : 'hover:bg-white/5 border border-transparent'}`}
                  >
                    <span className="w-10 h-10 flex items-center justify-center bg-black/40 border border-white/10 rounded-xl text-xl shadow-inner group-hover:scale-110 transition-transform">
                      {page.icon}
                    </span>
                    <div className="flex-1 text-left">
                      <p className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">{page.label}</p>
                      <p className="text-[9px] text-gray-500 font-mono mt-0.5">{hasChildren ? `${page.children!.length} sub-pages` : page.path}</p>
                    </div>
                    {hasChildren && <ChevronDown size={14} className={`text-gray-600 group-hover:text-white transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />}
                  </button>
                  {hasChildren && isExpanded && (
                    <div className="ml-6 pl-4 border-l border-white/10 mt-1 space-y-1 py-1">
                      {page.children!.map((child, ci) => (
                        <button
                          key={ci}
                          onClick={() => onSelect(child.path)}
                          className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 group"
                        >
                          <span className="text-sm opacity-60">{child.icon}</span>
                          <div className="flex-1 text-left">
                            <p className="text-[11px] font-semibold text-gray-300 group-hover:text-white">{child.label}</p>
                            <p className="text-[9px] text-gray-600 font-mono">{child.path}</p>
                          </div>
                          <ArrowRight size={10} className="text-gray-700 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}
// ─── History Portal ────────────────────────────────────────────
function HistoryPortal({
  anchorRef,
  isOpen,
  onClose,
  onSelect,
  history,
}: {
  anchorRef: React.RefObject<HTMLButtonElement | null>
  isOpen: boolean
  onClose: () => void
  onSelect: (url: string) => void
  history: string[]
}) {
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    if (isOpen && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect()
      setPos({ top: rect.bottom + 8, left: rect.left - 150 })
    }
  }, [isOpen, anchorRef])
  if (!mounted || !isOpen) return null
  return createPortal(
    <>
      <div className="fixed inset-0" style={{ zIndex: 99998 }} onClick={onClose} />
      <div style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 99999, width: 260 }}>
        <div className="bg-[#0c0c0c]/90 border border-white/10 rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.9)] backdrop-blur-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="p-3 border-b border-white/5 bg-white/5 flex items-center gap-2">
            <Clock size={12} className="text-amber-500" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recent Sessions</span>
          </div>
          <div className="p-1 max-h-[300px] overflow-y-auto">
            {history.length === 0 ? (
              <p className="p-4 text-[10px] text-gray-600 text-center italic">No history yet</p>
            ) : (
              history.map((url, i) => (
                <button
                  key={i}
                  onClick={() => { onSelect(url); onClose() }}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 text-left transition-all group"
                >
                  <div className="w-6 h-6 rounded-lg bg-black/50 border border-white/5 flex items-center justify-center text-[10px]">
                    <Globe size={10} className="text-gray-500 group-hover:text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-gray-300 truncate">{url.replace(/^https?:\/\//, '')}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}
// ─── Main Component ────────────────────────────────────────────
export default function CanvasPreview({ iframeRef }: CanvasPreviewProps) {
  const deviceMode = useDeviceMode()
  const setDeviceMode = useStudioStore(s => s.setDeviceMode)
  const canvasUrl = useStudioStore(s => s.canvasUrl)
  const setCanvasUrl = useStudioStore(s => s.setCanvasUrl)
  const urlHistory = useStudioStore(s => s.urlHistory)
  const [isLoading, setIsLoading] = useState(true)
  const [zoom, setZoom] = useState(100)
  const [showPageMenu, setShowPageMenu] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [localUrl, setLocalUrl] = useState(canvasUrl)
  const [isDragOver, setIsDragOver] = useState(false)
  const [urlBarFocused, setUrlBarFocused] = useState(false)
  const pageMenuBtnRef = useRef<HTMLButtonElement>(null)
  const historyBtnRef = useRef<HTMLButtonElement>(null)
  const { pingIframe, sendMessage } = usePostMessage(iframeRef)
  const device = DEVICE_CONFIG[deviceMode]
  const studioUrl = `${canvasUrl}?studio=true`
  // Protocol Check
  const isLocal = localUrl.includes('localhost') || localUrl.includes('127.0.0.1')
  const isSecure = localUrl.startsWith('https')
  useEffect(() => { setLocalUrl(canvasUrl) }, [canvasUrl])
  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    const onLoad = () => { setIsLoading(false); setTimeout(pingIframe, 500) }
    iframe.addEventListener('load', onLoad)
    return () => iframe.removeEventListener('load', onLoad)
  }, [pingIframe, iframeRef])
  const reload = () => {
    if (!iframeRef.current) return
    setIsLoading(true)
    iframeRef.current.src = studioUrl
  }
  const selectPage = useCallback((path: string) => {
    try {
      const url = new URL(canvasUrl)
      url.pathname = path
      const finalUrl = url.origin + url.pathname
      setCanvasUrl(finalUrl)
      setLocalUrl(finalUrl)
    } catch {
      setCanvasUrl(path)
      setLocalUrl(path)
    }
    setIsLoading(true)
    setShowPageMenu(false)
  }, [canvasUrl, setCanvasUrl])
  const handleUrlSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { 
      let url = localUrl
      // localUrl might be a bare domain/path from the input (protocol stripped for display)
      // Reconstruct with protocol if missing
      if (!url.startsWith('http')) url = 'http://' + url
      setLocalUrl(url)
      setCanvasUrl(url)
      setIsLoading(true)
    }
  }
  const handleDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('text/html-block')) { e.preventDefault(); setIsDragOver(true) }
  }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const html = e.dataTransfer.getData('text/html-block')
    if (html) sendMessage({ type: 'INJECT_BLOCK', data: { html } })
  }
  return (
    <div className="flex flex-col h-full bg-black">
      {/* ─── Premium Header ─── */}
      <div className="flex items-center justify-between px-6 py-3 bg-black border-t border-b border-white/5 relative z-50">
        <div className="absolute inset-x-0 top-0 h-px bg-slate-800/40" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-slate-800/40" />
        {/* ─── Left Section: Browser Controls ─── */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Navigation Arrows */}
          <div className="flex items-center gap-0.5 bg-white/5 rounded-xl p-0.5 border border-white/5">
            <button
              onClick={() => iframeRef.current?.contentWindow?.history.back()}
              className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              title="Go Back"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={() => iframeRef.current?.contentWindow?.history.forward()}
              className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              title="Go Forward"
            >
              <ChevronRight size={15} />
            </button>
            <button
              onClick={() => {
                if (iframeRef.current) iframeRef.current.src = iframeRef.current.src
              }}
              className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              title="Reload Canvas"
            >
              <RefreshCw size={14} />
            </button>
          </div>
          {/* Device Controls */}
          <div className="flex items-center gap-1 bg-white/5 rounded-xl p-0.5 border border-white/5">
            {(Object.entries(DEVICE_CONFIG) as [keyof typeof DEVICE_CONFIG, typeof DEVICE_CONFIG[keyof typeof DEVICE_CONFIG]][]).map(([key, cfg]) => {
              const Icon = cfg.icon
              const active = deviceMode === key
              return (
                <button
                  key={key}
                  onClick={() => setDeviceMode(key)}
                  className={`p-2 rounded-lg transition-all duration-300 relative ${active ? 'text-white bg-indigo-600/20' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  <Icon size={15} />
                </button>
              )
            })}
          </div>
          {/* Page Navigator */}
          <button
            ref={pageMenuBtnRef}
            onClick={() => setShowPageMenu(v => !v)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-bold transition-all border border-white/5 ${
              showPageMenu ? 'text-indigo-400 bg-indigo-600/10 border-indigo-500/20' : 'text-gray-400 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            <Layout size={13} />
            <span className="hidden lg:block">Pages</span>
            <ChevronDown size={10} className={`transition-transform ${showPageMenu ? 'rotate-180' : ''}`} />
          </button>
        </div>
        {/* ─── Advanced Address Bar ─── */}
        <div className={`flex-1 mx-8 max-w-2xl transition-all duration-500 ${urlBarFocused ? 'max-w-3xl' : ''}`}>
          <div className={`flex items-center gap-3 bg-black/60 rounded-[24px] px-4 py-2 border border-slate-800/40 shadow-2xl transition-all duration-300 ${urlBarFocused ? 'border-indigo-500/50 shadow-[0_0_30px_rgba(79,70,229,0.2)]' : 'hover:border-slate-700/60'}`}>
            {/* Site Favicon & Security */}
            <div className="flex items-center gap-2 pr-3 border-r border-white/5">
              <div className="w-6 h-6 bg-white/5 rounded-lg flex items-center justify-center">
                <img src="/favicon.ico" alt="" className="w-3.5 h-3.5 opacity-40 group-hover:opacity-80 transition-opacity" />
              </div>
              <div className={`flex items-center gap-1 transition-colors ${isSecure ? 'text-green-500/60' : 'text-amber-500/60'}`} title={isSecure ? "Connection is Secure" : "Local Development"}>
                {isSecure ? <ShieldCheck size={14} /> : <Shield size={14} />}
              </div>
            </div>
            {/* URL Input */}
            <div className="flex-1 flex items-center gap-1 overflow-hidden">
              <span className="text-slate-600 text-[10px] font-bold select-none uppercase tracking-tighter">
                {localUrl.startsWith('https') ? 'https://' : localUrl.startsWith('http') ? 'http://' : ''}
              </span>
              <input
                type="text"
                value={localUrl.replace(/^https?:\/\//, '')}
                onChange={e => setLocalUrl(e.target.value)}
                onKeyDown={handleUrlSubmit}
                onFocus={() => setUrlBarFocused(true)}
                onBlur={() => setTimeout(() => setUrlBarFocused(false), 200)}
                placeholder="domain.com/path..."
                className="bg-transparent text-[12px] text-gray-200 w-full font-mono placeholder-gray-800 outline-none border-none selection:bg-indigo-500/30"
              />
            </div>
            {/* Shortcuts & Actions */}
            <div className="flex items-center gap-2 border-l border-white/5 pl-3">
              <div className="hidden lg:flex items-center gap-1.5 mr-2">
                <span className="px-1.5 py-0.5 bg-slate-800/40 rounded text-[8px] text-gray-500 font-black border border-slate-700/20">⌘S</span>
                <span className="px-1.5 py-0.5 bg-slate-800/40 rounded text-[8px] text-gray-500 font-black border border-slate-700/20">⌘Z</span>
              </div>
              <button 
                ref={historyBtnRef}
                onClick={() => setShowHistory(v => !v)}
                className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                title="Recent History"
              >
                <Clock size={15} />
              </button>
              <button onClick={reload} className="p-1.5 text-gray-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all" title="Reload Canvas">
                <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
        </div>
        {/* Zoom & Utility */}
        <div className="flex items-center gap-1 bg-black/60 rounded-2xl p-1 border border-white/5">
          <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="p-1.5 text-gray-500 hover:text-white transition-colors"><ZoomOut size={14} /></button>
          <button onClick={() => setZoom(100)} className="px-2 py-1 text-[10px] font-bold text-gray-500 hover:text-white transition-colors">{zoom}%</button>
          <button onClick={() => setZoom(z => Math.min(150, z + 10))} className="p-1.5 text-gray-500 hover:text-white transition-colors"><ZoomIn size={14} /></button>
        </div>
      </div>
      {/* Portals */}
      <PageNavigatorPortal
        anchorRef={pageMenuBtnRef}
        isOpen={showPageMenu}
        onClose={() => setShowPageMenu(false)}
        onSelect={selectPage}
      />
      <HistoryPortal
        anchorRef={historyBtnRef}
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onSelect={(url) => { setCanvasUrl(url); setIsLoading(true) }}
        history={urlHistory}
      />
      {/* ─── Canvas Area ─── */}
      <div className="flex-1 relative overflow-hidden">
        <div
          className={`absolute inset-0 overflow-auto flex items-start justify-center p-8 transition-all duration-700 ${isDragOver ? 'bg-indigo-900/10' : 'bg-black'}`}
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
        >
          <div
            className="relative bg-black rounded-[32px] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] transition-all duration-500 border border-white/5"
            style={{
              width: device.width,
              maxWidth: device.width === '100%' ? '100%' : device.width,
              height: device.height,
              minHeight: '700px',
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
            }}
          >
            {isLoading && (
              <div className="absolute inset-0 bg-[#0a0a0a]/90 backdrop-blur-md flex items-center justify-center z-30">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-indigo-500/20 rounded-full" />
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin absolute inset-0" />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Connecting</span>
                    <span className="text-[9px] text-gray-500 font-mono">{localUrl}</span>
                  </div>
                </div>
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={studioUrl}
              className="w-full h-full border-none"
              title="Studio Pro Canvas"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
