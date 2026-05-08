'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
export interface IframeSandboxConfig {
  src: string
  title?: string
  width?: string | number
  height?: string | number
  sandbox?: string
  allow?: string
  style?: React.CSSProperties
  className?: string
  onLoad?: () => void
  onError?: (error: Error) => void
}
export interface CSPPolicy {
  'default-src'?: string[]
  'script-src'?: string[]
  'style-src'?: string[]
  'img-src'?: string[]
  'connect-src'?: string[]
  'frame-src'?: string[]
  'font-src'?: string[]
  'media-src'?: string[]
  'object-src'?: string[]
  'base-uri'?: string[]
  'form-action'?: string[]
  'frame-ancestors'?: string[]
}
export interface SecurityHeaders {
  'Content-Security-Policy'?: string
  'X-Content-Type-Options'?: string
  'X-Frame-Options'?: string
  'Referrer-Policy'?: string
  'Permissions-Policy'?: string
  'Strict-Transport-Security'?: string
}
const DEFAULT_SANDBOX = 'allow-scripts allow-same-origin'
export function generateCSPHeader(policy: CSPPolicy): string {
  const directives: string[] = []
  Object.entries(policy).forEach(([directive, values]) => {
    if (values && values.length > 0) {
      directives.push(`${directive} ${values.join(' ')}`)
    }
  })
  return directives.join('; ')
}
export function createCSPPolicy(config: {
  defaultSrc?: string[]
  self?: boolean
  nonce?: string
  readonly?: boolean
}): CSPPolicy {
  const { defaultSrc = ["'self'"], nonce, readonly = false } = config
  const policy: CSPPolicy = {
    'default-src': [...defaultSrc],
    'script-src': readonly 
      ? ["'self'", "'unsafe-inline'"] 
      : ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    'style-src': readonly 
      ? [...defaultSrc, "'unsafe-inline'"] 
      : [...defaultSrc, "'unsafe-inline'"],
    'img-src': [...defaultSrc, 'data:', 'blob:'],
    'connect-src': [...defaultSrc],
    'frame-src': ["'self'"],
    'font-src': [...defaultSrc],
    'object-src': ["'none'"],
    'base-uri': defaultSrc,
    'form-action': defaultSrc
  }
  if (nonce) {
    if (policy['script-src']) policy['script-src'].push(`'nonce-${nonce}'`)
    if (policy['style-src']) policy['style-src'].push(`'nonce-${nonce}'`)
  }
  return policy
}
export function generateSecurityHeaders(config?: {
  csp?: CSPPolicy
  nosniff?: boolean
  noframe?: boolean
  referrer?: string
  readonly?: boolean
}): SecurityHeaders {
  const headers: SecurityHeaders = {}
  if (config?.csp) {
    headers['Content-Security-Policy'] = generateCSPHeader(config.csp)
  }
  if (config?.nosniff !== false) {
    headers['X-Content-Type-Options'] = 'nosniff'
  }
  if (config?.noframe !== false) {
    headers['X-Frame-Options'] = 'SAMEORIGIN'
  }
  if (config?.referrer) {
    headers['Referrer-Policy'] = config.referrer
  } else {
    headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
  }
  if (config?.readonly) {
    headers['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()'
  }
  headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
  return headers
}
export function useSandboxedIframe(config: IframeSandboxConfig) {
  const {
    src,
    title = 'Sandboxed Content',
    width = '100%',
    height = '100%',
    sandbox = DEFAULT_SANDBOX,
    allow,
    style,
    className,
    onLoad,
    onError
  } = config
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const handleLoad = useCallback(() => {
    setIsLoaded(true)
    setHasError(false)
    onLoad?.()
  }, [onLoad])
  const handleError = useCallback(() => {
    setHasError(true)
    onError?.(new Error('Failed to load iframe content'))
  }, [onError])
  const iframeProps = {
    ref: iframeRef,
    src,
    title,
    width,
    height,
    sandbox,
    allow,
    style,
    className,
    onLoad: handleLoad,
    onError: handleError
  }
  return {
    iframeProps,
    isLoaded,
    hasError,
    iframeRef
  }
}
export function createSecureIframe(
  container: HTMLElement,
  src: string,
  options: {
    width?: number
    height?: number
    sandbox?: string
    title?: string
    onLoad?: () => void
  } = {}
): HTMLIFrameElement {
  const {
    width,
    height,
    sandbox = DEFAULT_SANDBOX,
    title = 'Sandboxed Content',
    onLoad
  } = options
  const iframe = document.createElement('iframe')
  iframe.src = src
  if (width) iframe.width = width.toString()
  if (height) iframe.height = height.toString()
  iframe.title = title
  const sandboxList = sandbox.split(' ')
  sandboxList.forEach(value => {
    if (value) iframe.sandbox.add(value)
  })
  iframe.style.cssText = `
    border: none;
    display: block;
    width: ${width || '100%'};
    height: ${height || '100%'};
  `
  if (onLoad) {
    iframe.addEventListener('load', onLoad)
  }
  container.appendChild(iframe)
  return iframe
}
export function validateOrigin(origin: string, allowedOrigins: string[]): boolean {
  return allowedOrigins.includes('*') || allowedOrigins.includes(origin)
}
export function getCSPMetaTag(policy: CSPPolicy): string {
  return generateCSPHeader(policy)
}
export function SecurityHeadersComponent({ policy }: { policy: CSPPolicy }) {
  const cspString = generateCSPHeader(policy)
  return (
    <meta
      httpEquiv="Content-Security-Policy"
      content={cspString}
    />
  )
}
export function SandboxedIframe({
  src,
  title = 'Sandboxed Content',
  width = '100%',
  height = '100%',
  sandbox = DEFAULT_SANDBOX,
  allow,
  style,
  className,
  onLoad,
  onError
}: IframeSandboxConfig) {
  const [isLoaded, setIsLoaded] = useState(false)
  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }
  const handleError = () => {
    onError?.(new Error('Failed to load iframe content'))
  }
  return (
    <iframe
      src={src}
      title={title}
      width={width}
      height={height}
      sandbox={sandbox}
      allow={allow}
      style={style}
      className={className}
      onLoad={handleLoad}
      onError={handleError}
    />
  )
}
export function createIframeBridge(iframe: HTMLIFrameElement) {
  const targetOrigin = new URL(iframe.src).origin
  return {
    postMessage: (type: string, payload: unknown) => {
      if (iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type, payload }, targetOrigin)
      }
    },
    onMessage: (handler: (event: MessageEvent) => void) => {
      window.addEventListener('message', handler)
      return () => window.removeEventListener('message', handler)
    }
  }
}
export const DEFAULT_CSP_POLICY: CSPPolicy = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", "data:", "blob:"],
  'connect-src': ["'self'"],
  'frame-src': ["'self'"],
  'font-src': ["'self'"],
  'media-src': ["'self'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"]
}
export const STRICT_CSP_POLICY: CSPPolicy = {
  'default-src': ["'none'"],
  'script-src': ["'nonce-{nonce}'", "'self'"],
  'style-src': ["'self'"],
  'img-src': ["'self'"],
  'connect-src': ["'self'"],
  'frame-src': ["'none'"],
  'font-src': ["'self'"],
  'media-src': ["'self'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"]
}
export const PERMISSIVE_CSP_POLICY: CSPPolicy = {
  "default-src": ["'self'", "https:"],
  "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https:"],
  "style-src": ["'self'", "'unsafe-inline'", "https:"],
  "img-src": ["'self'", "data:", "blob:", "https:"],
  "connect-src": ["'self'", "https:", "wss:"],
  "frame-src": ["'self'", "https:"],
  "font-src": ["'self'", "data:", "https:"],
  "media-src": ["'self'", "https:"],
  "object-src": ["'self'", "blob:"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"]
}