'use client'
import { useEffect } from 'react'
// ─────────────────────────────────────────────────────────────
// Studio Pro V12 — Live Bridge
// Activates when ?customizer=true OR ?studio=true is in the URL.
// Handles two-way postMessage communication with the studio iframe.
// ─────────────────────────────────────────────────────────────
export default function CustomizerBridge() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const isStudioMode =
      urlParams.get('customizer') === 'true' ||
      urlParams.get('studio') === 'true'
    if (!isStudioMode) return
    // ── 1. Inject Selection CSS ──────────────────────────────
    document.body.classList.add('studio-bridge-active')
    const styleEl = document.createElement('style')
    styleEl.id = 'studio-bridge-styles'
    styleEl.innerHTML = `
      .studio-bridge-active [data-customizable] {
        position: relative !important;
        cursor: pointer !important;
        transition: outline 0.1s ease !important;
      }
      .studio-bridge-active [data-customizable]:hover {
        outline: 2px solid rgba(99,102,241,0.6) !important;
        outline-offset: 2px !important;
      }
      .studio-selected {
        outline: 2px solid #6366f1 !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 4px rgba(99,102,241,0.15) !important;
      }
      .studio-highlighted {
        outline: 1px dashed rgba(99,102,241,0.4) !important;
        outline-offset: 2px !important;
      }
      .studio-element-label {
        position: absolute;
        top: -22px;
        left: 0;
        background: #6366f1;
        color: white;
        font-size: 9px;
        font-weight: 700;
        padding: 2px 8px;
        border-radius: 4px 4px 0 0;
        z-index: 99999;
        pointer-events: none;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        white-space: nowrap;
        font-family: sans-serif;
      }
      [contenteditable="true"]:focus {
        outline: 2px solid #6366f1 !important;
        background: rgba(99,102,241,0.04) !important;
        border-radius: 2px !important;
        cursor: text !important;
        caret-color: #6366f1 !important;
      }
    `
    document.head.appendChild(styleEl)
    // ── Helper: clear all selections ─────────────────────────
    const clearSelection = () => {
      document.querySelectorAll('.studio-selected').forEach(el => {
        el.classList.remove('studio-selected')
        ;(el as HTMLElement).contentEditable = 'false'
      })
      document.querySelectorAll('.studio-element-label').forEach(el => el.remove())
    }
    // ── Helper: get element type ─────────────────────────────
    const getElementType = (el: HTMLElement): string => {
      const tag = el.tagName.toLowerCase()
      const customType = el.getAttribute('data-custom-type')
      if (customType) return customType
      if (tag === 'img') return 'image'
      if (tag === 'a' || tag === 'button') return 'button'
      if (['h1','h2','h3','h4','h5','h6'].includes(tag)) return 'heading'
      if (tag === 'p' || tag === 'span') return 'text'
      if (tag === 'section') return 'section'
      if (tag === 'div') return 'div'
      return 'unknown'
    }
    // ── Helper: Trigger Selection ────────────────────────────
    const triggerSelection = (customizable: HTMLElement) => {
      clearSelection()
      customizable.classList.add('studio-selected')
      // Add label
      const label = document.createElement('div')
      label.className = 'studio-element-label'
      const key = customizable.getAttribute('data-custom-key') || ''
      label.textContent = key.replace(/([A-Z])/g, ' $1').trim() || customizable.tagName
      customizable.style.position = 'relative'
      customizable.appendChild(label)
      // Enable inline editing for text elements
      const elType = getElementType(customizable)
      if (['text', 'heading'].includes(elType) && customizable.tagName !== 'IMG') {
        customizable.contentEditable = 'true'
        customizable.focus()
        customizable.oninput = () => {
          window.parent.postMessage({
            type: 'UPDATE_CONTENT',
            elementKey: key,
            data: { content: customizable.innerText },
          }, '*')
        }
      }
      // Gather metadata for the studio properties panel
      const rect = customizable.getBoundingClientRect()
      const computed = window.getComputedStyle(customizable)
      // Collect all data-* attributes
      const dataAttributes: Record<string, string> = {}
      Array.from(customizable.attributes).forEach(attr => {
        if (attr.name.startsWith('data-')) {
          dataAttributes[attr.name] = attr.value
        }
      })
      window.parent.postMessage({
        type: 'SELECT_COMPONENT',
        elementKey: key,
        data: {
          key,
          type: elType,
          tagName: customizable.tagName,
          textContent: customizable.innerText?.slice(0, 200),
          src: (customizable as HTMLImageElement).src || customizable.querySelector('img')?.src,
          alt: (customizable as HTMLImageElement).alt || customizable.querySelector('img')?.alt,
          href: (customizable as HTMLAnchorElement).href,
          rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
          computedStyles: {
            fontSize:        computed.fontSize,
            color:           computed.color,
            backgroundColor: computed.backgroundColor,
            padding:         computed.padding,
            margin:          computed.margin,
            borderRadius:    computed.borderRadius,
            opacity:         computed.opacity,
            fontWeight:      computed.fontWeight,
            textAlign:       computed.textAlign,
            lineHeight:      computed.lineHeight,
            letterSpacing:   computed.letterSpacing,
            boxShadow:       computed.boxShadow,
            objectFit:       computed.objectFit,
          },
          dataAttributes,
        },
      }, '*')
    }
    // ── 2. Click handler — select elements ───────────────────
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const customizable = target.closest('[data-customizable]') as HTMLElement | null
      if (!customizable) {
        clearSelection()
        window.parent.postMessage({ type: 'SELECT_COMPONENT', data: null }, '*')
        return
      }
      // Prevent link navigation in studio mode
      if (customizable.tagName === 'A' || customizable.closest('a')) {
        e.preventDefault()
      }
      e.stopPropagation()
      triggerSelection(customizable)
    }
    document.addEventListener('click', handleClick, true)
    // ── 3. Message handler — receive from studio ─────────────
    const handleMessage = (event: MessageEvent) => {
      if (!event.data?.type) return
      const { type, elementKey, data } = event.data
      // Helper: find element by key
      const findEl = (key: string): HTMLElement | null =>
        document.querySelector(`[data-custom-key="${key}"]`) as HTMLElement | null
      switch (type) {
        // Apply CSS styles to an element
        case 'UPDATE_STYLE': {
          const el = findEl(elementKey)
          if (el && data?.styles) Object.assign(el.style, data.styles)
          break
        }
        // Update text content
        case 'UPDATE_CONTENT': {
          const el = findEl(elementKey)
          if (!el || data?.content === undefined) break
          if (el instanceof HTMLImageElement) {
            el.src = data.content
          } else {
            const label = el.querySelector('.studio-element-label')
            el.innerText = data.content
            if (label) el.appendChild(label)
          }
          break
        }
        // Update element attributes (src, alt, href, target…)
        case 'UPDATE_ATTRIBUTE': {
          const el = findEl(elementKey)
          if (el && data?.attributes) {
            Object.entries(data.attributes).forEach(([attr, val]) => {
              if (attr === 'src' && el instanceof HTMLImageElement) {
                el.src = val as string
              } else if (attr === 'href' && el instanceof HTMLAnchorElement) {
                el.href = val as string
              } else {
                el.setAttribute(attr, val as string)
              }
            })
          }
          break
        }
        // Toggle element visibility
        case 'TOGGLE_VISIBILITY': {
          const el = findEl(elementKey)
          if (el) {
            // Use computed style to detect real visibility — avoids inline-style-only check
            const computedDisplay = window.getComputedStyle(el).display
            el.style.display = computedDisplay === 'none' ? '' : 'none'
          }
          break
        }
        // Highlight element (hover from layers panel)
        case 'HIGHLIGHT_ELEMENT': {
          document.querySelectorAll('.studio-highlighted').forEach(el => el.classList.remove('studio-highlighted'))
          const el = findEl(elementKey)
          if (el) el.classList.add('studio-highlighted')
          break
        }
        // Clear highlight
        case 'CLEAR_SELECTION': {
          document.querySelectorAll('.studio-highlighted').forEach(el => el.classList.remove('studio-highlighted'))
          break
        }
        // Apply global theme (CSS variables + Google Fonts)
        case 'UPDATE_THEME': {
          const root = document.documentElement
          // ── Colors ───────────────────────────────────────────
          if (data?.colors) {
            if (data.colors.primary)    root.style.setProperty('--color-primary',    data.colors.primary)
            if (data.colors.secondary)  root.style.setProperty('--color-secondary',  data.colors.secondary)
            if (data.colors.background) root.style.setProperty('--color-background', data.colors.background)
            if (data.colors.text)       root.style.setProperty('--color-text',        data.colors.text)
          }
          // ── Typography / Google Font injection ────────────────
          if (data?.typography) {
            const { fontFamily, headingFont, baseFontSize, fontSlug } = data.typography
            // Inject Google Font link if not already present
            const injectFont = (slug: string) => {
              if (!slug) return
              const id = `gfont-${slug}`
              if (document.getElementById(id)) return
              const link = document.createElement('link')
              link.id = id
              link.rel = 'stylesheet'
              link.href = `https://fonts.googleapis.com/css2?family=${slug}:wght@400;600;700&display=swap`
              document.head.appendChild(link)
            }
            // Inject from explicit slug or derive from family names
            if (fontSlug) injectFont(fontSlug)
            if (fontFamily) injectFont(fontFamily.split(',')[0].trim().replace(/ /g, '+'))
            if (headingFont) injectFont(headingFont.split(',')[0].trim().replace(/ /g, '+'))
            // Apply to DOM
            if (fontFamily) {
              document.body.style.fontFamily = fontFamily
              document.querySelectorAll('p, span, a, li, td, button').forEach(el => {
                (el as HTMLElement).style.fontFamily = fontFamily
              })
            }
            if (headingFont) {
              document.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(el => {
                (el as HTMLElement).style.fontFamily = headingFont
              })
            }
            if (baseFontSize) {
              document.documentElement.style.fontSize = baseFontSize
            }
          }
          // ── Custom Styles ─────────────────────────────────────────
          if (data?.customStyles) {
            Object.entries(data.customStyles).forEach(([key, styles]) => {
              const el = findEl(key)
              if (el) {
                // reset styles before applying new ones to avoid lingering properties
                el.style.cssText = ''
                Object.assign(el.style, styles)
              }
            })
          }
          break
        }
        // Scan customizable elements — return recursive tree
        case 'SCAN_ELEMENTS': {
          const getElementType = (el: HTMLElement): string => {
            const tag = el.tagName.toLowerCase()
            const custom = el.getAttribute('data-custom-type')
            if (custom) return custom
            if (tag === 'img') return 'image'
            if (tag === 'a' || tag === 'button') return 'button'
            if (['h1','h2','h3','h4','h5','h6'].includes(tag)) return 'heading'
            if (tag === 'p' || tag === 'span') return 'text'
            if (tag === 'section') return 'section'
            if (tag === 'div') return 'div'
            return 'unknown'
          }
          // Build recursive tree — only top-level customizable elements as roots
          const buildTree = (container: HTMLElement | Document, depth = 0): any[] => {
            if (depth > 5) return [] // safety limit
            const directCustomizable = Array.from(
              container.querySelectorAll(':scope > [data-customizable], :scope > * > [data-customizable]')
            ) as HTMLElement[]
            return directCustomizable.map(el => {
              const key = el.getAttribute('data-custom-key') || `el-${Math.random().toString(36).slice(2, 6)}`
              const childEls = Array.from(el.querySelectorAll('[data-customizable]')) as HTMLElement[]
              return {
                key,
                label: el.getAttribute('data-custom-key')?.replace(/-/g, ' ') || el.tagName,
                type: getElementType(el),
                tagName: el.tagName,
                visible: el.style.display !== 'none',
                children: childEls.length > 0 ? childEls.map(child => ({
                  key: child.getAttribute('data-custom-key') || `child-${Math.random().toString(36).slice(2, 6)}`,
                  label: child.getAttribute('data-custom-key')?.replace(/-/g, ' ') || child.tagName,
                  type: getElementType(child),
                  tagName: child.tagName,
                  visible: child.style.display !== 'none',
                  children: [],
                })) : [],
              }
            })
          }
          const elements = buildTree(document)
          window.parent.postMessage({ type: 'ELEMENTS_SCANNED', data: { elements } }, '*')
          break
        }
        // Delete element from DOM
        case 'DELETE_ELEMENT': {
          const el = findEl(elementKey)
          if (el) el.remove()
          break
        }
        // Duplicate element (insert clone after)
        case 'DUPLICATE_ELEMENT': {
          const el = findEl(elementKey)
          if (el) {
            const clone = el.cloneNode(true) as HTMLElement
            const uniqueSuffix = `-copy-${Math.random().toString(36).slice(2, 8)}`
            // Rewrite all data-custom-key attributes within the cloned block
            const allCustomizables = [clone, ...Array.from(clone.querySelectorAll('[data-customizable]'))]
            allCustomizables.forEach((node, index) => {
              const oldKey = node.getAttribute('data-custom-key')
              if (oldKey) {
                node.setAttribute('data-custom-key', `${oldKey}${uniqueSuffix}`)
              } else {
                node.setAttribute('data-custom-key', `el-${Date.now()}-${index}`)
              }
            })
            el.insertAdjacentElement('afterend', clone)
          }
          break
        }
        // Scroll element into view and select it
        case 'SCROLL_TO_ELEMENT': {
          const el = findEl(elementKey)
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' })
            triggerSelection(el)
          }
          break
        }
        // Inject a new HTML block into the page
        case 'INJECT_BLOCK': {
          if (data?.html) {
            const wrapper = document.createElement('div')
            wrapper.innerHTML = data.html
            const block = wrapper.firstElementChild as HTMLElement | null
            if (block) {
              const uniqueSuffix = `-${Math.random().toString(36).slice(2, 8)}`
              // Rewrite all data-custom-key attributes within the block to be globally unique
              const allCustomizables = [block, ...Array.from(block.querySelectorAll('[data-customizable]'))]
              allCustomizables.forEach((node, index) => {
                const oldKey = node.getAttribute('data-custom-key')
                if (oldKey) {
                  node.setAttribute('data-custom-key', `${oldKey}${uniqueSuffix}`)
                } else {
                  node.setAttribute('data-custom-key', `el-${Date.now()}-${index}`)
                }
              })
              document.body.appendChild(block)
              // Scroll to the new block
              block.scrollIntoView({ behavior: 'smooth', block: 'center' })
              // Highlight it briefly
              block.classList.add('studio-selected')
              setTimeout(() => block.classList.remove('studio-selected'), 2000)
            }
          }
          break
        }
        // Ping from studio — respond to confirm bridge is alive
        case 'PING': {
          window.parent.postMessage({ type: 'PONG', data: { ready: true } }, '*')
          break
        }
        default:
          break
      }
    }
    window.addEventListener('message', handleMessage)
    // ── Cleanup ───────────────────────────────────────────────
    return () => {
      document.removeEventListener('click', handleClick, true)
      window.removeEventListener('message', handleMessage)
      styleEl.remove()
      document.body.classList.remove('studio-bridge-active')
    }
  }, [])
  return null
}
