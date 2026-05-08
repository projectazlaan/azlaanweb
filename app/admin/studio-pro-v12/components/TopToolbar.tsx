'use client'
import { Save, Undo2, Redo2, Eye, Upload, Image, Command, ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useHistory, useStudioStore } from '../store'
import toast from 'react-hot-toast'
interface TopToolbarProps {
  onOpenGallery: () => void
  onOpenCommandPalette: () => void
  onSave: () => void
  onExport: () => void
  onUndo: () => void
  onRedo: () => void
}
export default function TopToolbar({ onOpenGallery, onOpenCommandPalette, onSave, onExport, onUndo, onRedo }: TopToolbarProps) {
  const { canUndo, canRedo } = useHistory()
  const { isSaving, lastSaved, canvasUrl } = useStudioStore()
  const handleUndo = () => { if (canUndo) { onUndo(); toast('Undone', { icon: '↩️' }) } }
  const handleRedo = () => { if (canRedo) { onRedo(); toast('Redone', { icon: '↪️' }) } }
  const lastSavedText = lastSaved
    ? `Saved ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : 'Not saved yet'
  return (
    <header className="h-14 bg-[#111] border-b border-white/5 flex items-center px-4 gap-3 flex-shrink-0 relative">
      {/* Back to Portal */}
      <Link
        href="/admin"
        className="flex items-center gap-1.5 text-gray-500 hover:text-white transition-colors mr-2"
        title="Back to Portal"
      >
        <ArrowLeft size={16} />
      </Link>
      {/* Brand */}
      <div className="flex items-center gap-2 mr-4">
        <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-fuchsia-600 rounded-lg flex items-center justify-center">
          <span className="text-[10px] font-black text-white">V12</span>
        </div>
        <span className="text-sm font-bold text-white hidden md:block">Studio Pro</span>
      </div>
      {/* Separator */}
      <div className="h-6 w-px bg-white/10" />
      {/* Undo / Redo */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <Undo2 size={15} />
        </button>
        <button
          onClick={handleRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
          className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <Redo2 size={15} />
        </button>
      </div>
      {/* Separator */}
      <div className="h-6 w-px bg-white/10" />
      {/* Gallery */}
      <button
        onClick={onOpenGallery}
        title="Gallery (G)"
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
      >
        <Image size={14} />
        <span className="hidden md:block">Gallery</span>
      </button>
      {/* Command Palette */}
      <button
        onClick={onOpenCommandPalette}
        title="Command Palette (Ctrl+K)"
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
      >
        <Command size={14} />
        <span className="hidden md:block">Commands</span>
        <kbd className="hidden lg:block text-[10px] bg-white/10 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
      </button>
      {/* Spacer */}
      <div className="flex-1" />
      {/* Last saved */}
      <span className="text-[11px] text-gray-600 hidden lg:block">{lastSavedText}</span>
      {/* Preview */}
      <a
        href={canvasUrl}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
      >
        <Eye size={14} />
        <span className="hidden md:block">Preview</span>
      </a>
      {/* Save */}
      <button
        onClick={onSave}
        disabled={isSaving}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20"
      >
        <Save size={14} />
        {isSaving ? 'Saving…' : 'Save'}
      </button>
      {/* Publish */}
      <button
        onClick={onExport}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg"
      >
        <Upload size={14} />
        <span className="hidden md:block">Export</span>
      </button>
      {/* Mirrored AI Button */}
      {/* Removed - Moved to Canvas Bottom Right */}
      {/* Modern Loading Bar */}
      {isSaving && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-indigo-500 w-[40%] animate-[save-progress_1.5s_infinite_linear] shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
        </div>
      )}
      <style jsx>{`
        @keyframes save-progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </header>
  )
}
