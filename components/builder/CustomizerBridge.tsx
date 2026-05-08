'use client'
import { useEffect } from 'react'
export default function CustomizerBridge() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    // Show a premium toast notification
    const showToast = (message: string, type: 'success' | 'info' = 'success') => {
      const toast = document.createElement('div')
      toast.className = `fixed bottom-10 left-1/2 -translate-x-1/2 px-8 py-4 rounded-2xl shadow-2xl z-[10000] font-black text-xs uppercase tracking-[0.2em] animate-in fade-in slide-in-from-bottom-4 duration-500 flex items-center gap-3 ${
        type === 'success' ? 'bg-[#0071E3] text-white' : 'bg-white text-black'
      }`
      toast.innerHTML = `<div class="w-2 h-2 rounded-full bg-white animate-pulse"></div> ${message}`
      document.body.appendChild(toast)
      setTimeout(() => {
        toast.classList.add('fade-out')
        setTimeout(() => toast.remove(), 500)
      }, 3000)
    }
    // Initial load message
    showToast('Azlaan Bridge Connected', 'info')
    const handleMessage = (event: MessageEvent) => {
      const { type, key, value, command } = event.data
      // 1. Update Content
      if (type === 'UPDATE_CONTENT') {
        const element = document.querySelector(`[data-customizer-key="${key}"]`)
        if (element) {
          // If it's a Hero Title or similar, update specifically
          const title = element.querySelector('h1') || element
          title.textContent = value
          element.classList.add('scale-[1.01]', 'transition-all', 'duration-300')
          setTimeout(() => element.classList.remove('scale-[1.01]'), 300)
        }
      }
      // 1.1 Update Image SRC
      if (type === 'UPDATE_IMAGE') {
        // Try to find the currently selected element or a relevant image
        const selected = document.querySelector('.customizer-selected')
        const img = selected?.querySelector('img') || selected as HTMLImageElement
        if (img && (img.tagName === 'IMG' || img.querySelector('img'))) {
          const targetImg = img.tagName === 'IMG' ? img : img.querySelector('img')
          if (targetImg) {
            targetImg.src = value
            showToast('Image updated successfully!')
          }
        } else {
          // Fallback: look for common hero or section images if none selected
          const heroImg = document.querySelector('img') 
          if (heroImg) {
            heroImg.src = value
            showToast('Image updated successfully!')
          }
        }
      }
      // 2. Add Blocks & Commands
      if (type === 'RUN_COMMAND') {
        if (command.startsWith('add-block-')) {
          const blockType = command.replace('add-block-', '')
          const main = document.querySelector('main')
          if (main) {
            const newBlock = document.createElement('section')
            newBlock.className = 'py-20 px-10 text-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl m-10'
            newBlock.setAttribute('data-customizer-key', `New-${blockType}-${Date.now()}`)
            if (blockType === 'text') {
              newBlock.innerHTML = `<h2 class="text-4xl font-black mb-4">New ${blockType} block added</h2><p class="text-gray-500">You can now click here to edit this text live.</p>`
            } else if (blockType === 'image') {
              newBlock.innerHTML = `<img src="/media-pro/women/Design 1/673949386_122125962357151981_1889495426070156223_n.webp" class="w-full max-w-2xl mx-auto rounded-3xl shadow-2xl mb-6" /><h2 class="text-2xl font-bold uppercase">Fashion Photography</h2>`
            } else {
               newBlock.innerHTML = `<div class="p-20 bg-white rounded-3xl shadow-xl"><h3 class="text-2xl font-bold uppercase">${blockType} Component Placeholder</h3></div>`
            }
            main.appendChild(newBlock)
            newBlock.scrollIntoView({ behavior: 'smooth' })
            showToast(`${blockType} added successfully!`)
          }
        }
        if (command === 'undo') window.history.back()
        if (command === 'redo') window.history.forward()
        if (command === 'open-assets') showToast('Loading Media Hub...', 'info')
      }
      // 3. Update Theme (Global Fonts & Colors)
      if (type === 'UPDATE_THEME') {
        const { fontFamily, colors } = event.data.payload || {}
        if (fontFamily) {
          // Remove existing studio font link
          const existing = document.getElementById('studio-font-link')
          if (existing) existing.remove()
          // Create new link tag
          const link = document.createElement('link')
          link.id = 'studio-font-link'
          link.rel = 'stylesheet'
          link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:wght@300;400;500;600;700;800;900&display=swap`
          document.head.appendChild(link)
          // Apply to body
          document.body.style.fontFamily = `"${fontFamily}", sans-serif`
          showToast(`Font: ${fontFamily}`)
        }
        if (colors) {
          const root = document.documentElement
          Object.entries(colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value as string)
          })
        }
      }
    }
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const customKey = target.closest('[data-customizer-key]')
      if (customKey) {
        e.preventDefault()
        e.stopPropagation()
        // Remove existing outlines
        document.querySelectorAll('.customizer-selected').forEach(el => el.classList.remove('customizer-selected', 'ring-4', 'ring-[#0071E3]'))
        // Add highlight
        customKey.classList.add('customizer-selected', 'ring-4', 'ring-[#0071E3]', 'ring-offset-4', 'transition-all', 'duration-300')
        const key = customKey.getAttribute('data-customizer-key')
        const currentText = customKey.textContent
        const styles = window.getComputedStyle(customKey)
        window.parent.postMessage({
          type: 'SELECT_COMPONENT',
          key: key,
          metadata: {
            currentText,
            computedStyles: {
              fontSize: styles.fontSize,
              color: styles.color,
              fontFamily: styles.fontFamily
            }
          }
        }, '*')
      }
    }
    window.addEventListener('message', handleMessage)
    document.addEventListener('click', handleClick, true)
    return () => {
      window.removeEventListener('message', handleMessage)
      document.removeEventListener('click', handleClick, true)
    }
  }, [])
  return null
}
