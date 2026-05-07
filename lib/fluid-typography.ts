'use client'

export interface TypographyScale {
  name: string
  minSize: number
  maxSize: number
  minWidth: number
  maxWidth: number
  lineHeight?: number
  fontWeight?: number | string
  letterSpacing?: string
}

export interface FluidTypographyConfig {
  minSize?: number
  maxSize?: number
  minWidth?: number
  maxWidth?: number
  precision?: number
  unit?: 'px' | 'rem' | 'em'
}

export interface GeneratedClamp {
  property: string
  value: string
  css: string
}

export const TYPOGRAPHY_SCALES: TypographyScale[] = [
  { name: 'display', minSize: 48, maxSize: 96, minWidth: 375, maxWidth: 1920, lineHeight: 1.1, fontWeight: 700 },
  { name: 'h1', minSize: 36, maxSize: 72, minWidth: 375, maxWidth: 1920, lineHeight: 1.2, fontWeight: 700 },
  { name: 'h2', minSize: 28, maxSize: 56, minWidth: 375, maxWidth: 1920, lineHeight: 1.25, fontWeight: 600 },
  { name: 'h3', minSize: 24, maxSize: 40, minWidth: 375, maxWidth: 1920, lineHeight: 1.3, fontWeight: 600 },
  { name: 'h4', minSize: 20, maxSize: 32, minWidth: 375, maxWidth: 1920, lineHeight: 1.35, fontWeight: 600 },
  { name: 'h5', minSize: 18, maxSize: 24, minWidth: 375, maxWidth: 1920, lineHeight: 1.4, fontWeight: 500 },
  { name: 'h6', minSize: 16, maxSize: 20, minWidth: 375, maxWidth: 1920, lineHeight: 1.45, fontWeight: 500 },
  { name: 'body-lg', minSize: 18, maxSize: 20, minWidth: 375, maxWidth: 1920, lineHeight: 1.6, fontWeight: 400 },
  { name: 'body', minSize: 16, maxSize: 18, minWidth: 375, maxWidth: 1920, lineHeight: 1.6, fontWeight: 400 },
  { name: 'body-sm', minSize: 14, maxSize: 16, minWidth: 375, maxWidth: 1920, lineHeight: 1.5, fontWeight: 400 },
  { name: 'caption', minSize: 12, maxSize: 14, minWidth: 375, maxWidth: 1920, lineHeight: 1.5, fontWeight: 400 },
  { name: 'overline', minSize: 10, maxSize: 12, minWidth: 375, maxWidth: 1920, lineHeight: 1.5, fontWeight: 500, letterSpacing: 'uppercase' }
]

export function roundTo(value: number, precision: number = 2): number {
  const factor = Math.pow(10, precision)
  return Math.round(value * factor) / factor
}

export function pxToRem(px: number, baseFontSize: number = 16): number {
  return roundTo(px / baseFontSize, 4)
}

export function remToPx(rem: number, baseFontSize: number = 16): number {
  return rem * baseFontSize
}

export function generateClamp(
  config: FluidTypographyConfig
): string {
  const {
    minSize = 16,
    maxSize = 18,
    minWidth = 375,
    maxWidth = 1920,
    precision = 4,
    unit = 'rem'
  } = config

  if (minSize === maxSize) {
    return unit === 'rem' ? `${pxToRem(minSize)}rem` : `${minSize}px`
  }

  const slope = (maxSize - minSize) / (maxWidth - minWidth)
  const yAxisIntersection = -minWidth * slope + minSize

  const minViewport = roundTo(minWidth / 100, precision)
  const maxViewport = roundTo(maxWidth / 100, precision)
  const preferredValue = roundTo(slope * 100, precision)
  const fixedValue = roundTo(yAxisIntersection, precision)

  if (unit === 'rem') {
    const baseFontSize = 16
    const minRem = pxToRem(minSize)
    const maxRem = pxToRem(maxSize)
    const preferredRem = roundTo(slope * 100 / baseFontSize, precision)
    const fixedRem = roundTo(yAxisIntersection / baseFontSize, precision)
    return `clamp(${minRem}rem, ${fixedRem}rem + ${preferredRem}vw, ${maxRem}rem)`
  }

  return `clamp(${minSize}px, ${fixedValue}px + ${preferredValue}vw, ${maxSize}px)`
}

export function generateFluidCSS(scales: TypographyScale[]): string {
  let css = ':root {\n'

  scales.forEach(scale => {
    const fontSize = generateClamp({
      minSize: scale.minSize,
      maxSize: scale.maxSize,
      minWidth: scale.minWidth,
      maxWidth: scale.maxWidth
    })
    css += `  --font-size-${scale.name}: ${fontSize};\n`

    if (scale.lineHeight) {
      css += `  --line-height-${scale.name}: ${scale.lineHeight};\n`
    }
    if (scale.fontWeight) {
      css += `  --font-weight-${scale.name}: ${scale.fontWeight};\n`
    }
  })

  css += '}\n'
  return css
}

export function getFluidValue(
  minSize: number,
  maxSize: number,
  currentWidth: number,
  config?: Partial<{ minWidth: number; maxWidth: number }>
): number {
  const { minWidth = 375, maxWidth = 1920 } = config || {}
  
  if (currentWidth <= minWidth) return minSize
  if (currentWidth >= maxWidth) return maxSize

  const slope = (maxSize - minSize) / (maxWidth - minWidth)
  const value = minSize + slope * (currentWidth - minWidth)
  
  return roundTo(value)
}

export function createFluidTypographyHook(defaultScales?: TypographyScale[]) {
  return function useFluidTypography(scaleName: string): string {
    const scales = defaultScales || TYPOGRAPHY_SCALES
    const scale = scales.find(s => s.name === scaleName)
    
    if (!scale) {
      console.warn(`Typography scale "${scaleName}" not found`)
      return '1rem'
    }

    return generateClamp({
      minSize: scale.minSize,
      maxSize: scale.maxSize,
      minWidth: scale.minWidth,
      maxWidth: scale.maxWidth
    })
  }
}

export function generateFluidSpacing(
  minSize: number,
  maxSize: number,
  config?: Partial<FluidTypographyConfig>
): string {
  return generateClamp({
    minSize,
    maxSize,
    minWidth: 375,
    maxWidth: 1920,
    ...config
  })
}

export function generateFluidMarginPadding(): string {
  const spacing = [
    { name: '0', minSize: 0, maxSize: 0 },
    { name: '1', minSize: 4, maxSize: 8 },
    { name: '2', minSize: 8, maxSize: 16 },
    { name: '3', minSize: 12, maxSize: 24 },
    { name: '4', minSize: 16, maxSize: 32 },
    { name: '5', minSize: 24, maxSize: 48 },
    { name: '6', minSize: 32, maxSize: 64 },
    { name: '8', minSize: 40, maxSize: 80 },
    { name: '10', minSize: 48, maxSize: 96 },
    { name: '12', minSize: 64, maxSize: 128 },
    { name: '16', minSize: 80, maxSize: 160 }
  ]

  let css = ':root {\n'
  spacing.forEach(s => {
    const value = generateClamp({
      minSize: s.minSize,
      maxSize: s.maxSize
    })
    css += `  --space-${s.name}: ${value};\n`
  })
  css += '}\n'
  return css
}

export const FLUID_TYPOGRAPHY_PRESET = `
/* Fluid Typography System */

:root {
  /* Display */
  --font-display: clamp(3rem, 2.125rem + 4.375vw, 6rem);
  --line-display: 1.1;
  --font-weight-display: 700;
  
  /* Headings */
  --font-h1: clamp(2.25rem, 1.375rem + 4.375vw, 4.5rem);
  --line-h1: 1.2;
  --font-weight-h1: 700;
  
  --font-h2: clamp(1.75rem, 0.875rem + 4.375vw, 3.5rem);
  --line-h2: 1.25;
  --font-weight-h2: 600;
  
  --font-h3: clamp(1.5rem, 0.75rem + 3.75vw, 2.5rem);
  --line-h3: 1.3;
  --font-weight-h3: 600;
  
  --font-h4: clamp(1.25rem, 0.5rem + 3.75vw, 2rem);
  --line-h4: 1.35;
  --font-weight-h4: 600;
  
  --font-h5: clamp(1.125rem, 0.375rem + 3.75vw, 1.5rem);
  --line-h5: 1.4;
  --font-weight-h5: 500;
  
  --font-h6: clamp(1rem, 0.25rem + 3.75vw, 1.25rem);
  --line-h6: 1.45;
  --font-weight-h6: 500;
  
  /* Body */
  --font-body-lg: clamp(1.125rem, 0.125rem + 5vw, 1.25rem);
  --line-body-lg: 1.6;
  
  --font-body: clamp(1rem, 0rem + 5vw, 1.125rem);
  --line-body: 1.6;
  
  --font-body-sm: clamp(0.875rem, -0.125rem + 5vw, 1rem);
  --line-body-sm: 1.5;
  
  /* Caption */
  --font-caption: clamp(0.75rem, -0.25rem + 5vw, 0.875rem);
  --line-caption: 1.5;
}

/* Usage: 
   font-size: var(--font-h1);
   line-height: var(--line-h1);
   font-weight: var(--font-weight-h1);
*/
`