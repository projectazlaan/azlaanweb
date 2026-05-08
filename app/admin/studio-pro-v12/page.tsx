'use client'
import { useEffect, useRef, useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { Toaster } from 'react-hot-toast'
import { useStudioStore, useHistory } from './store'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { useMessageListener, usePostMessage } from './hooks/usePostMessage'
import TopToolbar from './components/TopToolbar'
import LeftSidebar from './components/LeftSidebar'
import RightPanel from './components/RightPanel'
import GalleryDrawer from './components/GalleryDrawer'
import ExportModal from './components/ExportModal'
import SaveSuccessModal from './components/SaveSuccessModal'
// ─── Heavy canvas loaded client-only ──────────────────────────
const CanvasPreview = dynamic(() => import('./components/CanvasPreview'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-[#0a0a0a]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-gray-500 text-sm font-medium">Loading Studio Canvas…</span>
      </div>
    </div>
  )
})
// ─── Command Palette ───────────────────────────────────────────
function CommandPalette({
  isOpen,
  onClose,
  onSave,
  onOpenGallery,
}: {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  onOpenGallery: () => void
}) {
  const [query, setQuery] = useState('')
  const setDeviceMode = useStudioStore(s => s.setDeviceMode)
  const commands = [
    { icon: '💾', label: 'Save Design',          group: 'Actions',    shortcut: '⌘S', action: () => { onSave(); onClose() } },
    { icon: '🖼️', label: 'Open Media Gallery',   group: 'Actions',    shortcut: 'G',  action: () => { onOpenGallery(); onClose() } },
    { icon: '🖥️', label: 'Switch to Desktop',    group: 'Device',     shortcut: '',   action: () => { setDeviceMode('desktop'); onClose() } },
    { icon: '📱', label: 'Switch to Mobile',     group: 'Device',     shortcut: '',   action: () => { setDeviceMode('mobile'); onClose() } },
    { icon: '🗂️', label: 'Switch to Tablet',     group: 'Device',     shortcut: '',   action: () => { setDeviceMode('tablet'); onClose() } },
    { icon: '← ', label: 'Back to Portal',       group: 'Navigate',   shortcut: '',   action: () => { window.location.href = '/admin'; onClose() } },
  ]
  const filtered = query
    ? commands.filter(c =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.group.toLowerCase().includes(query.toLowerCase())
      )
    : commands
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-[#161616] rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
          <span className="text-gray-600 text-lg">⌘</span>
          <input
            autoFocus
            type="text"
            placeholder="Type a command or search…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => { if (e.key === 'Escape') onClose() }}
            className="flex-1 bg-transparent text-white placeholder-gray-600 focus:outline-none text-base"
          />
          <kbd className="text-xs text-gray-600 bg-white/5 px-2 py-1 rounded-lg">ESC</kbd>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-600 text-sm py-6">No commands found</p>
          ) : (
            filtered.map((cmd, i) => (
              <button
                key={i}
                onClick={cmd.action}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-left group"
              >
                <span className="text-lg w-7 text-center">{cmd.icon}</span>
                <div className="flex-1">
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{cmd.label}</span>
                  <span className="text-[10px] text-gray-600 ml-2 uppercase tracking-wider">{cmd.group}</span>
                </div>
                {cmd.shortcut && (
                  <kbd className="text-[10px] text-gray-600 bg-white/5 px-2 py-1 rounded-lg font-mono">{cmd.shortcut}</kbd>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
// ─── Main Page ─────────────────────────────────────────────────
export default function StudioProV12Page() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  // ── Single root message listener ──
  useMessageListener()
  const { undo, redo } = useHistory()
  const { sendMessage } = usePostMessage(iframeRef)
  const handleUndo = () => {
    const restored = undo()
    if (restored) sendMessage({ type: 'UPDATE_THEME', data: restored as unknown as Record<string, unknown> })
  }
  const handleRedo = () => {
    const restored = redo()
    if (restored) sendMessage({ type: 'UPDATE_THEME', data: restored as unknown as Record<string, unknown> })
  }
  const {
    saveToServer,
    openGallery,
    selectedElement,
    updateSettings,
    canvasUrl,
  } = useStudioStore()
  // ── Derived Page Key ──
  const currentPageKey = useMemo(() => {
    try {
      if (!canvasUrl) return 'homepage'
      const url = new URL(canvasUrl)
      const path = url.pathname.replace(/^\/|\/$/g, '')
      return path === '' ? 'homepage' : path
    } catch {
      return 'homepage'
    }
  }, [canvasUrl])
  // ── Restore saved settings on load & when page changes ──
  useEffect(() => {
    fetch(`/api/studio-pro/save?key=${currentPageKey}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.settings) {
          updateSettings(data.settings)
        }
      })
      .catch(() => {}) // silent fail
  }, [updateSettings, currentPageKey])
  // ── Keyboard Shortcuts ──
  useKeyboardShortcuts({
    iframeRef,
    onSave: () => saveToServer(currentPageKey),
    onOpenGallery: () => openGallery(),
    onOpenCommandPalette: () => setCommandPaletteOpen(true),
    onDuplicate: () => {},
    onDelete: () => {},
  })
  // Expose currentPageKey for debugging
  // eslint-disable-next-line no-console
  // console.debug('[Studio] currentPageKey =', currentPageKey)
  return (
    <div className="h-screen bg-black flex flex-col overflow-hidden text-white font-sans">
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            fontSize: '13px',
          },
        }}
      />
      <TopToolbar
        onOpenGallery={() => openGallery()}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onSave={() => saveToServer(currentPageKey)}
        onExport={() => setExportOpen(true)}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />
      <div className="flex-1 flex overflow-hidden">
        <LeftSidebar iframeRef={iframeRef} />
        <main className="flex-1 overflow-hidden flex flex-col">
          <CanvasPreview iframeRef={iframeRef} />
        </main>
        <RightPanel iframeRef={iframeRef} />
      </div>
      <GalleryDrawer />
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSave={() => saveToServer(currentPageKey)}
        onOpenGallery={() => openGallery()}
      />
      <ExportModal isOpen={exportOpen} onClose={() => setExportOpen(false)} />
      <SaveSuccessModal />
    </div>
  )
}
