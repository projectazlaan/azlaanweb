'use client'

import { useEffect, useCallback } from 'react'
import { useStudioStore } from '../store'
import type { PostMessagePayload } from '../types'

// ─────────────────────────────────────────────────────────────────
// useMessageListener
// Mount ONCE at the page root. Listens to incoming postMessages
// from the iframe bridge and updates the Zustand store.
// ─────────────────────────────────────────────────────────────────

export function useMessageListener() {
  const setSelectedElement = useStudioStore(s => s.setSelectedElement)

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (!event.data?.type) return

      const payload = event.data as PostMessagePayload

      switch (payload.type) {
        case 'SELECT_COMPONENT': {
          if (!payload.data) {
            setSelectedElement(null)
            break
          }
          const d = payload.data as {
            key: string
            type: string
            tagName: string
            textContent?: string
            src?: string
            alt?: string
            href?: string
            rect?: { top: number; left: number; width: number; height: number }
            computedStyles: Record<string, string>
            dataAttributes: Record<string, string>
          }
          setSelectedElement({
            key: d.key,
            type: d.type as import('../types').ElementType,
            tagName: d.tagName,
            textContent: d.textContent,
            src: d.src,
            alt: d.alt,
            href: d.href,
            rect: d.rect,
            computedStyles: d.computedStyles ?? {},
            dataAttributes: d.dataAttributes ?? {},
          })
          break
        }

        case 'ELEMENTS_SCANNED': {
          // Dispatched as a custom event so LayersPanel can pick it up
          window.dispatchEvent(
            new CustomEvent('studio:elements-scanned', { detail: payload.data })
          )
          break
        }

        case 'UPDATE_CONTENT': {
          // Inline edit from bridge — update selected element text
          const key = payload.elementKey
          const content = (payload.data as { content: string })?.content
          if (key && content !== undefined) {
            const el = useStudioStore.getState().selectedElement
            if (el?.key === key) {
              useStudioStore.setState({
                selectedElement: { ...el, textContent: content },
              })
            }
          }
          break
        }

        case 'PONG': {
          console.log('[Studio V12] 🔗 Bridge connected ✓')
          break
        }

        default:
          break
      }
    }

    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [setSelectedElement])
}
