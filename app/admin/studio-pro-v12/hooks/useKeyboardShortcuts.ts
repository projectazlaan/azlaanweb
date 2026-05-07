'use client'

import { useEffect, useCallback } from 'react'
import { useStudioStore } from '../store'

interface KeyboardShortcutOptions {
  iframeRef: React.RefObject<HTMLIFrameElement | null>
  onSave: () => void
  onOpenGallery: () => void
  onOpenCommandPalette: () => void
  onDuplicate: () => void
  onDelete: () => void
}

export function useKeyboardShortcuts({
  onSave,
  onOpenGallery,
  onOpenCommandPalette,
  onDuplicate,
  onDelete,
}: KeyboardShortcutOptions) {
  const { undo, redo, setSelectedElement, canUndo, canRedo } = useStudioStore()

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey

      // Ctrl+S — Save
      if (ctrl && e.key === 's') {
        e.preventDefault()
        onSave()
        return
      }

      // Ctrl+Z — Undo
      if (ctrl && !e.shiftKey && e.key === 'z') {
        e.preventDefault()
        if (canUndo) undo()
        return
      }

      // Ctrl+Y / Ctrl+Shift+Z — Redo
      if ((ctrl && e.key === 'y') || (ctrl && e.shiftKey && e.key === 'z')) {
        e.preventDefault()
        if (canRedo) redo()
        return
      }

      // Ctrl+D — Duplicate
      if (ctrl && e.key === 'd') {
        e.preventDefault()
        onDuplicate()
        return
      }

      // Ctrl+K — Command Palette
      if (ctrl && e.key === 'k') {
        e.preventDefault()
        onOpenCommandPalette()
        return
      }

      // Ctrl+G / G — Gallery
      if ((ctrl && e.key === 'g') || e.key === 'g') {
        // Only if not typing in an input or contenteditable
        if (document.activeElement?.tagName === 'INPUT') return
        if (document.activeElement?.tagName === 'TEXTAREA') return
        if ((document.activeElement as HTMLElement)?.isContentEditable) return
        e.preventDefault()
        onOpenGallery()
        return
      }

      // Escape — Clear selection
      if (e.key === 'Escape') {
        setSelectedElement(null)
        return
      }

      // Delete / Backspace — Delete element
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (document.activeElement?.tagName === 'INPUT') return
        if (document.activeElement?.tagName === 'TEXTAREA') return
        if ((document.activeElement as HTMLElement)?.isContentEditable) return
        e.preventDefault()
        onDelete()
        return
      }
    },
    [undo, redo, canUndo, canRedo, setSelectedElement, onSave, onOpenGallery, onOpenCommandPalette, onDuplicate, onDelete]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
