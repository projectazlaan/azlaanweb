'use client'

import { useCallback } from 'react'
import { useStudioStore } from '../store'
import type { PostMessagePayload } from '../types'

// ─────────────────────────────────────────────────────────────────
// useMessageSender
// Safe to call in any component — does NOT add event listeners.
// Provides sendMessage + all derived helper functions.
// ─────────────────────────────────────────────────────────────────

export function useMessageSender(iframeRef: React.RefObject<HTMLIFrameElement | null>) {
  const { updateElementStyle, pushHistory, settings } = useStudioStore()

  // Core send
  const sendMessage = useCallback(
    (payload: PostMessagePayload) => {
      if (!iframeRef.current?.contentWindow) return
      iframeRef.current.contentWindow.postMessage(payload, '*')
    },
    [iframeRef]
  )

  // Apply CSS styles (store + iframe)
  const updateStyle = useCallback(
    (key: string, styles: Record<string, string>, label = 'Style update') => {
      pushHistory(label, settings)
      updateElementStyle(key, styles)
      sendMessage({ type: 'UPDATE_STYLE', elementKey: key, data: { styles } })
    },
    [sendMessage, updateElementStyle, pushHistory, settings]
  )

  // Update text content
  const updateContent = useCallback(
    (key: string, content: string) => {
      pushHistory('Text edit', settings)
      sendMessage({ type: 'UPDATE_CONTENT', elementKey: key, data: { content } })
    },
    [sendMessage, pushHistory, settings]
  )

  // Update attributes (src, href, alt…)
  const updateAttribute = useCallback(
    (key: string, attributes: Record<string, string>) => {
      pushHistory('Attribute update', settings)
      sendMessage({ type: 'UPDATE_ATTRIBUTE', elementKey: key, data: { attributes } })
    },
    [sendMessage, pushHistory, settings]
  )

  // Delete element
  const deleteElement = useCallback(
    (key: string) => {
      pushHistory('Delete element', settings)
      sendMessage({ type: 'DELETE_ELEMENT', elementKey: key })
    },
    [sendMessage, pushHistory, settings]
  )

  // Duplicate element
  const duplicateElement = useCallback(
    (key: string) => {
      pushHistory('Duplicate element', settings)
      sendMessage({ type: 'DUPLICATE_ELEMENT', elementKey: key })
    },
    [sendMessage, pushHistory, settings]
  )

  // Highlight (hover from layers)
  const highlightElement = useCallback(
    (key: string | null) => {
      sendMessage({
        type: key ? 'HIGHLIGHT_ELEMENT' : 'CLEAR_SELECTION',
        elementKey: key ?? undefined,
      })
    },
    [sendMessage]
  )

  // Ping iframe
  const pingIframe = useCallback(() => {
    sendMessage({ type: 'PING' })
  }, [sendMessage])

  return {
    sendMessage,
    updateStyle,
    updateContent,
    updateAttribute,
    deleteElement,
    duplicateElement,
    highlightElement,
    pingIframe,
  }
}
