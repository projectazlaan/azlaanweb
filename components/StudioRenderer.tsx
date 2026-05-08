'use client'
import { useEffect } from 'react'
interface StudioRendererProps {
  pageKey?: string
}
export default function StudioRenderer({ pageKey = 'homepage' }: StudioRendererProps) {
  useEffect(() => {
    const applyStyles = async () => {
      try {
        const res = await fetch(`/api/studio-pro/save?key=${pageKey}`)
        if (!res.ok) return
        const data = await res.json()
        if (!data?.settings?.customStyles) return
        const customStyles = data.settings.customStyles
        // Apply styles to elements with data-customizer-key
        Object.entries(customStyles).forEach(([key, styles]: [string, any]) => {
          const elements = document.querySelectorAll(`[data-customizer-key="${key}"]`)
          elements.forEach((el: any) => {
            Object.entries(styles).forEach(([prop, val]: [string, any]) => {
              el.style[prop] = val
            })
          })
        })
        console.log(`[StudioRenderer] Applied styles for: ${pageKey}`)
      } catch (err) {
        console.error('[StudioRenderer] Error loading styles:', err)
      }
    }
    applyStyles()
  }, [pageKey])
  return null // This component doesn't render anything, just applies styles
}
