'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'

export interface Breakpoint {
  name: string
  label: string
  minWidth: number
  maxWidth: number | null
  query: string
}

export interface BreakpointState {
  current: Breakpoint | null
  isDesktop: boolean
  isLaptop: boolean
  isTablet: boolean
  isMobile: boolean
  width: number
}

export const BREAKPOINTS: Breakpoint[] = [
  {
    name: 'desktop',
    label: 'Desktop',
    minWidth: 1440,
    maxWidth: null,
    query: '(min-width: 1440px)'
  },
  {
    name: 'laptop',
    label: 'Laptop',
    minWidth: 768,
    maxWidth: 1439,
    query: '(min-width: 768px) and (max-width: 1439px)'
  },
  {
    name: 'tablet',
    label: 'Tablet',
    minWidth: 375,
    maxWidth: 767,
    query: '(min-width: 375px) and (max-width: 767px)'
  },
  {
    name: 'mobile',
    label: 'Mobile',
    minWidth: 0,
    maxWidth: 374,
    query: '(max-width: 374px)'
  }
]

export const DEVICE_BREAKPOINTS: Record<string, number> = {
  mobile: 375,
  tablet: 768,
  laptop: 1440,
  desktop: 1920
}

export type DeviceType = 'mobile' | 'tablet' | 'laptop' | 'desktop'

export function getDeviceBreakpoint(width: number): DeviceType {
  if (width >= DEVICE_BREAKPOINTS.desktop) return 'desktop'
  if (width >= DEVICE_BREAKPOINTS.laptop) return 'laptop'
  if (width >= DEVICE_BREAKPOINTS.tablet) return 'tablet'
  return 'mobile'
}

export function getBreakpointForWidth(width: number): Breakpoint {
  if (width >= BREAKPOINTS[0].minWidth) return BREAKPOINTS[0]
  
  for (let i = 0; i < BREAKPOINTS.length; i++) {
    const bp = BREAKPOINTS[i]
    if (width >= bp.minWidth && (bp.maxWidth === null || width <= bp.maxWidth)) {
      return bp
    }
  }
  
  return BREAKPOINTS[BREAKPOINTS.length - 1]
}

export function isBreakpointActive(query: string): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(query).matches
}

export function useBreakpoint(): BreakpointState {
  const [breakpoint, setBreakpoint] = useState<Breakpoint | null>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth
      setWidth(newWidth)
      setBreakpoint(getBreakpointForWidth(newWidth))
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    const mediaQueries = BREAKPOINTS.map(bp => {
      const mq = window.matchMedia(bp.query)
      mq.addEventListener('change', handleResize)
      return { mq, query: bp.query }
    })

    return () => {
      window.removeEventListener('resize', handleResize)
      mediaQueries.forEach(({ mq, query }) => {
        mq.removeEventListener('change', handleResize)
      })
    }
  }, [])

  return useMemo(() => ({
    current: breakpoint,
    isDesktop: breakpoint?.name === 'desktop',
    isLaptop: breakpoint?.name === 'laptop',
    isTablet: breakpoint?.name === 'tablet',
    isMobile: breakpoint?.name === 'mobile',
    width
  }), [breakpoint, width])
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)

    const handler = (event: MediaQueryListEvent) => setMatches(event.matches)
    mediaQuery.addEventListener('change', handler)

    return () => mediaQuery.removeEventListener('change', handler)
  }, [query])

  return matches
}

export function useAboveBreakpoint(minWidth: number): boolean {
  return useMediaQuery(`(min-width: ${minWidth}px)`)
}

export function useBelowBreakpoint(maxWidth: number): boolean {
  return useMediaQuery(`(max-width: ${maxWidth}px)`)
}

export function useBetweenBreakpoint(minWidth: number, maxWidth: number): boolean {
  return useMediaQuery(`(min-width: ${minWidth}px) and (max-width: ${maxWidth}px)`)
}

export function useResponsiveValue<T>(values: Record<DeviceType, T>): T {
  const { current } = useBreakpoint()
  return current ? values[current.name as DeviceType] || values.mobile : values.mobile
}

export function getResponsiveStyle(
  values: Partial<Record<DeviceType, string>>
): string {
  const sorted: { device: DeviceType; value: string }[] = []
  
  Object.entries(values).forEach(([device, value]) => {
    if (value) sorted.push({ device: device as DeviceType, value })
  })

  sorted.sort((a, b) => DEVICE_BREAKPOINTS[b.device] - DEVICE_BREAKPOINTS[a.device])

  if (sorted.length === 0) return ''
  if (sorted.length === 1) return sorted[0].value

  let css = ''
  const sortedDevices = ['desktop', 'laptop', 'tablet', 'mobile'] as DeviceType[]
  
  sorted.forEach(({ device, value }, index) => {
    const bp = DEVICE_BREAKPOINTS[device]
    if (index === 0) {
      css = value
    } else {
      css = `@media (max-width: ${bp - 1}px) { ${css.split('\n').map((line: string) => `  ${line}`).join('\n')} }` + '\n' + value
    }
  })

  return css
}

export class BreakpointManager {
  private callbacks: Map<string, Set<(breakpoint: Breakpoint) => void>> = new Map()
  private current: Breakpoint | null = null
  private listeners: Set<() => void> = new Set()

  constructor() {
    if (typeof window !== 'undefined') {
      this.init()
    }
  }

  private init() {
    const handleResize = () => {
      const newBreakpoint = getBreakpointForWidth(window.innerWidth)
      if (!this.current || this.current.name !== newBreakpoint.name) {
        const prev = this.current
        this.current = newBreakpoint
        
        this.listeners.forEach(fn => fn())
        
        const handlers = this.callbacks.get(newBreakpoint.name)
        if (handlers) {
          handlers.forEach(handler => handler(newBreakpoint))
        }
        
        if (prev) {
          const exitHandlers = this.callbacks.get(`exit:${prev.name}`)
          if (exitHandlers) {
            exitHandlers.forEach(handler => handler(prev))
          }
        }
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()
  }

  getBreakpoint(): Breakpoint | null {
    return this.current
  }

  getDeviceType(): DeviceType | null {
    return this.current?.name as DeviceType || null
  }

  on(event: string, handler: (breakpoint: Breakpoint) => void): () => void {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, new Set())
    }
    this.callbacks.get(event)!.add(handler)

    return () => {
      this.callbacks.get(event)?.delete(handler)
    }
  }

  onChange(handler: () => void): () => void {
    this.listeners.add(handler)
    return () => this.listeners.delete(handler)
  }

  destroy() {
    this.callbacks.clear()
    this.listeners.clear()
  }
}

export const breakpointManager = typeof window !== 'undefined' ? new BreakpointManager() : null

export const BREAKPOINT_CSS = `
/* Generated Breakpoint Styles */
@media (max-width: 374px) {
  :root {
    --bp-name: mobile;
    --bp-value: 375px;
  }
}
@media (min-width: 375px) and (max-width: 767px) {
  :root {
    --bp-name: tablet;
    --bp-value: 768px;
  }
}
@media (min-width: 768px) and (max-width: 1439px) {
  :root {
    --bp-name: laptop;
    --bp-value: 1440px;
  }
}
@media (min-width: 1440px) {
  :root {
    --bp-name: desktop;
    --bp-value: 1920px;
  }
}
`