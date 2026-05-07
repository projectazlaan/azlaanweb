export interface AuditResult {
  score: number
  lcp: LCPResult
  accessibility: AccessibilityResult
  seo: SEOResult
  webpConversion: WebPResult
  recommendations: string[]
}

export interface LCPResult {
  value: number
  unit: string
  rating: 'good' | 'needs-improvement' | 'poor'
  elements: LCPCandidate[]
}

export interface LCPCandidate {
  element: string
  time: number
  selector: string
}

export interface AccessibilityResult {
  score: number
  violations: AccessibilityViolation[]
  passes: number
  warnings: AccessibilityViolation[]
}

export interface AccessibilityViolation {
  id: string
  impact: 'minor' | 'moderate' | 'serious' | 'critical'
  description: string
  selector: string
  help: string
  helpUrl: string
}

export interface SEOResult {
  score: number
  metaTags: MetaTagAnalysis
  headings: HeadingAnalysis
  images: ImageAnalysis
  links: LinkAnalysis
}

export interface MetaTagAnalysis {
  title: { exists: boolean; length: number; content: string }
  description: { exists: boolean; length: number; content: string }
  ogTags: { [key: string]: boolean }
  twitterTags: { [key: string]: boolean }
}

export interface HeadingAnalysis {
  h1Count: number
  h1Texts: string[]
  structure: { level: number; text: string }[]
  issues: string[]
}

export interface ImageAnalysis {
  total: number
  withAlt: number
  withoutAlt: number
  largeImages: string[]
  webpRecommended: string[]
}

export interface LinkAnalysis {
  internal: number
  external: number
  broken: string[]
  noFollow: number
}

export interface WebPResult {
  converted: number
  total: number
  savings: string
  images: WebPImage[]
}

export interface WebPImage {
  original: string
  webp: string
  originalSize: number
  webpSize: number
  savings: number
}

export function auditLCP(html: string): LCPResult {
  const images = html.match(/<img[^>]*>/g) || []
  const videos = html.match(/<video[^>]*>/g) || []
  const bgElements = html.match(/style="[^"]*background[^"]*"/g) || []
  
  const elements: LCPCandidate[] = []
  
  images.forEach((img, idx) => {
    const src = img.match(/src="([^"]*)"/)?.[1] || ''
    const size = img.match(/data-size="(\d+)"/)?.[1]
    const estimatedTime = size ? parseInt(size) / 1000 : 2000 + idx * 500
    
    elements.push({
      element: 'img',
      time: Math.min(estimatedTime, 5000),
      selector: `img:nth-of-type(${idx + 1})`
    })
  })
  
  const maxTime = elements.length > 0 ? Math.max(...elements.map(e => e.time)) : 2500
  const lcpValue = Math.min(maxTime, 5000)
  
  let rating: 'good' | 'needs-improvement' | 'poor' = 'good'
  if (lcpValue > 4000) rating = 'poor'
  else if (lcpValue > 2500) rating = 'needs-improvement'
  
  return {
    value: lcpValue,
    unit: 'ms',
    rating,
    elements: elements.sort((a, b) => b.time - a.time).slice(0, 5)
  }
}

export function auditAccessibility(html: string): AccessibilityResult {
  const violations: AccessibilityViolation[] = []
  const warnings: AccessibilityViolation[] = []
  let passes = 0
  
  const images = html.match(/<img[^>]*>/g) || []
  images.forEach((img, idx) => {
    const hasAlt = /alt="[^"]*"/.test(img)
    if (!hasAlt) {
      violations.push({
        id: 'image-alt',
        impact: 'serious',
        description: 'Images must have alt text',
        selector: `img:nth-of-type(${idx + 1})`,
        help: 'Add alt attribute to image',
        helpUrl: 'https://dequeuniversity.com/rules/axe/4.7/image-alt'
      })
    } else {
      passes++
    }
  })
  
  const buttons = html.match(/<button[^>]*>/g) || []
  buttons.forEach((btn, idx) => {
    const hasText = btn.match(/>[^<]*</)?.[1]?.trim()
    const hasAria = /aria-label="[^"]*"/.test(btn)
    if (!hasText && !hasAria) {
      violations.push({
        id: 'button-name',
        impact: 'critical',
        description: 'Buttons must have discernible text',
        selector: `button:nth-of-type(${idx + 1})`,
        help: 'Add text or aria-label to button',
        helpUrl: 'https://dequeuniversity.com/rules/axe/4.7/button-name'
      })
    } else {
      passes++
    }
  })
  
  const hasLang = /<html[^>]*lang="/.test(html)
  if (!hasLang) {
    violations.push({
      id: 'html-lang',
      impact: 'serious',
      description: 'HTML element must have lang attribute',
      selector: 'html',
      help: 'Add lang attribute to html element',
      helpUrl: 'https://dequeuniversity.com/rules/axe/4.7/html-lang'
    })
  } else {
    passes++
  }
  
  const score = Math.max(0, 100 - violations.length * 10 - warnings.length * 5)
  
  return {
    score,
    violations,
    passes,
    warnings
  }
}

export function auditSEO(html: string): SEOResult {
  const titleMatch = html.match(/<title>([^<]*)<\/title>/)
  const title = titleMatch ? titleMatch[1] : ''
  
  const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/)
  const description = descMatch ? descMatch[1] : ''
  
  const ogTags = {
    'og:title': /<meta[^>]*property="og:title"/.test(html),
    'og:description': /<meta[^>]*property="og:description"/.test(html),
    'og:image': /<meta[^>]*property="og:image"/.test(html),
    'og:url': /<meta[^>]*property="og:url"/.test(html)
  }
  
  const twitterTags = {
    'twitter:card': /<meta[^>]*name="twitter:card"/.test(html),
    'twitter:title': /<meta[^>]*name="twitter:title"/.test(html),
    'twitter:description': /<meta[^>]*name="twitter:description"/.test(html)
  }
  
  const h1s = html.match(/<h1[^>]*>([^<]*)<\/h1>/g) || []
  const headings = html.match(/<h([1-6])[^>]*>([^<]*)<\/h\1>/g) || []
  
  const headingStructure = headings.map(h => {
    const match = h.match(/<h([1-6])[^>]*>([^<]*)<\/h\1>/)
    return {
      level: parseInt(match?.[1] || '1'),
      text: match?.[2] || ''
    }
  })
  
  const headingIssues: string[] = []
  if (h1s.length === 0) headingIssues.push('No H1 tag found')
  if (h1s.length > 1) headingIssues.push('Multiple H1 tags found')
  
  const images = html.match(/<img[^>]*>/g) || []
  const imagesWithAlt = images.filter(img => /alt="[^"]*"/.test(img)).length
  
  const links = html.match(/<a[^>]*href="([^"]*)"[^>]*>/g) || []
  const internal = links.filter(a => {
    const href = a.match(/href="([^"]*)"/)?.[1] || ''
    return !href.startsWith('http') && !href.startsWith('#')
  }).length
  const external = links.length - internal
  
  const seoScore = calculateSEOScore({
    hasTitle: !!title,
    titleLength: title.length,
    hasDescription: !!description,
    descLength: description.length,
    ogTagsCount: Object.values(ogTags).filter(Boolean).length,
    twitterTagsCount: Object.values(twitterTags).filter(Boolean).length,
    h1Count: h1s.length,
    headingIssues: headingIssues.length
  })
  
  return {
    score: seoScore,
    metaTags: {
      title: { exists: !!title, length: title.length, content: title },
      description: { exists: !!description, length: description.length, content: description },
      ogTags,
      twitterTags
    },
    headings: {
      h1Count: h1s.length,
      h1Texts: h1s.map(h => h.replace(/<[^>]*>/g, '')),
      structure: headingStructure,
      issues: headingIssues
    },
    images: {
      total: images.length,
      withAlt: imagesWithAlt,
      withoutAlt: images.length - imagesWithAlt,
      largeImages: [],
      webpRecommended: []
    },
    links: {
      internal,
      external,
      broken: [],
      noFollow: 0
    }
  }
}

function calculateSEOScore(params: {
  hasTitle: boolean
  titleLength: number
  hasDescription: boolean
  descLength: number
  ogTagsCount: number
  twitterTagsCount: number
  h1Count: number
  headingIssues: number
}): number {
  let score = 100
  if (!params.hasTitle) score -= 20
  else if (params.titleLength < 30 || params.titleLength > 60) score -= 5
  if (!params.hasDescription) score -= 15
  else if (params.descLength < 70 || params.descLength > 160) score -= 5
  if (params.ogTagsCount < 3) score -= 10
  if (params.twitterTagsCount < 2) score -= 5
  if (params.h1Count !== 1) score -= 10
  score -= params.headingIssues * 5
  return Math.max(0, score)
}

export function analyzeWebPConversion(html: string): WebPResult {
  const images = html.match(/<img[^>]*src="([^"]*)"[^>]*>/g) || []
  
  const webpImages: WebPImage[] = images
    .map((img, idx) => {
      const src = img.match(/src="([^"]*)"/)?.[1] || ''
      if (!src || src.includes('.webp') || src.includes('data:')) {
        return null
      }
      
      const webpSrc = src.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp')
      const estimatedOriginalSize = 200000
      const estimatedWebPSize = estimatedOriginalSize * 0.75
      
      return {
        original: src,
        webp: webpSrc,
        originalSize: estimatedOriginalSize,
        webpSize: estimatedWebPSize,
        savings: estimatedOriginalSize - estimatedWebPSize
      }
    })
    .filter((img): img is WebPImage => img !== null)
  
  const totalSavings = webpImages.reduce((sum, img) => sum + img.savings, 0)
  
  return {
    converted: webpImages.length,
    total: images.length,
    savings: `${(totalSavings / 1024).toFixed(2)} KB`,
    images: webpImages
  }
}

export function runFullAudit(html: string): AuditResult {
  const lcp = auditLCP(html)
  const accessibility = auditAccessibility(html)
  const seo = auditSEO(html)
  const webpConversion = analyzeWebPConversion(html)
  
  const score = Math.round(
    (lcp.rating === 'good' ? 100 : lcp.rating === 'needs-improvement' ? 70 : 40) * 0.3 +
    accessibility.score * 0.3 +
    seo.score * 0.3 +
    (webpConversion.converted / Math.max(webpConversion.total, 1) * 100) * 0.1
  )
  
  const recommendations: string[] = []
  
  if (lcp.rating !== 'good') {
    recommendations.push(`Improve LCP: currently ${lcp.value}ms (target: <2500ms)`)
  }
  if (accessibility.score < 90) {
    recommendations.push(`Fix ${accessibility.violations.length} accessibility violations`)
  }
  if (seo.score < 80) {
    recommendations.push('Improve SEO meta tags and heading structure')
  }
  if (webpConversion.converted < webpConversion.total) {
    recommendations.push(`Convert ${webpConversion.total - webpConversion.converted} images to WebP format`)
  }
  
  return {
    score,
    lcp,
    accessibility,
    seo,
    webpConversion,
    recommendations
  }
}

export function generateWebPHtml(html: string): string {
  return html.replace(/<img([^>]*)src="([^"]+)\.(jpg|jpeg|png|gif)"([^>]*)>/gi, 
    '<img$1src="$2.webp"$4>')
}
