'use client'

import { useEffect, useCallback, useRef, useState } from 'react'

type MessageHandler = (payload: unknown) => void
type MessageCallback = {
  resolve: (value: unknown) => void
  reject: (error: Error) => void
  timeoutId: NodeJS.Timeout
}

export interface FreedomBridgeConfig {
  targetOrigin?: string
  timeout?: number
  debug?: boolean
}

export interface FreedomMessage {
  id: string
  type: string
  payload: unknown
  timestamp: number
  channel?: string
}

export interface FreedomBridgeAPI {
  send: (type: string, payload?: unknown) => void
  sendRequest: (type: string, payload?: unknown) => Promise<unknown>
  on: (type: string, handler: MessageHandler) => () => void
  once: (type: string, handler: MessageHandler) => void
  destroy: () => void
  isConnected: boolean
}

function generateMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

export function createFreedomBridge(
  target: Window | null,
  config: FreedomBridgeConfig = {}
): FreedomBridgeAPI {
  const {
    targetOrigin = '*',
    timeout = 30000,
    debug = false
  } = config

  const pendingCallbacks = new Map<string, MessageCallback>()
  const eventHandlers = new Map<string, Set<MessageHandler>>()
  const messageQueue = MessageChannel ? new Map<string, unknown>() : null
  
  let isConnected = false
  let messagePort: MessagePort | null = null

  const debugLog = (...args: unknown[]) => {
    if (debug) console.log('[FreedomBridge]', ...args)
  }

  const setupMessageChannel = useCallback(() => {
    if (!target) return

    const channel = new MessageChannel()
    messagePort = channel.port1

    messagePort.onmessage = (event: MessageEvent<FreedomMessage>) => {
      const message = event.data
      debugLog('Received:', message.type, message.payload)

      if (message.id && pendingCallbacks.has(message.id)) {
        const cb = pendingCallbacks.get(message.id)!
        clearTimeout(cb.timeoutId)
        pendingCallbacks.delete(message.id)
        cb.resolve(message.payload)
      }

      const handlers = eventHandlers.get(message.type)
      if (handlers) {
        handlers.forEach(handler => handler(message.payload))
      }
    }

    messagePort.start()
    target.postMessage({ type: 'freedom-bridge-init' }, targetOrigin, [channel.port2])
    isConnected = true
    debugLog('MessageChannel established')
  }, [target, targetOrigin, debug])

  const handleMessage = useCallback((event: MessageEvent<FreedomMessage>) => {
    if (!event.data || typeof event.data !== 'object') return
    
    const message = event.data as FreedomMessage
    if (message.type === 'freedom-bridge-init' && message.channel) {
      if (event.ports[0]) {
        messagePort = event.ports[0]
        messagePort.onmessage = (e: MessageEvent<FreedomMessage>) => {
          const msg = e.data
          debugLog('Received:', msg.type, msg.payload)

          if (msg.id && pendingCallbacks.has(msg.id)) {
            const cb = pendingCallbacks.get(msg.id)!
            clearTimeout(cb.timeoutId)
            pendingCallbacks.delete(msg.id)
            cb.resolve(msg.payload)
          }

          const handlers = eventHandlers.get(msg.type)
          if (handlers) {
            handlers.forEach(handler => handler(msg.payload))
          }
        }
        messagePort.start()
        isConnected = true
        debugLog('MessageChannel connected')
      }
    } else {
      const handlers = eventHandlers.get(message.type)
      if (handlers) {
        handlers.forEach(handler => handler(message.payload))
      }
    }
  }, [debug])

  useEffect(() => {
    if (!target) return () => {}

    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [target, handleMessage])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isConnected && target) {
        setupMessageChannel()
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [setupMessageChannel, target])

  const send = (type: string, payload?: unknown) => {
    const message: FreedomMessage = {
      id: generateMessageId(),
      type,
      payload,
      timestamp: Date.now()
    }

    if (messagePort) {
      messagePort.postMessage(message)
      debugLog('Sent:', type, payload)
    } else if (target) {
      target.postMessage(message, targetOrigin)
      debugLog('Sent (fallback):', type, payload)
    }
  }

  const sendRequest = (type: string, payload?: unknown): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      const id = generateMessageId()
      const message: FreedomMessage = {
        id,
        type,
        payload,
        timestamp: Date.now()
      }

      const timeoutId = setTimeout(() => {
        pendingCallbacks.delete(id)
        reject(new Error(`FreedomBridge: Timeout waiting for ${type}`))
      }, timeout)

      pendingCallbacks.set(id, { resolve, reject, timeoutId })

      if (messagePort) {
        messagePort.postMessage(message)
        debugLog('Sent request:', type, payload)
      } else if (target) {
        target.postMessage(message, targetOrigin)
        debugLog('Sent request (fallback):', type, payload)
      }
    })
  }

  const on = (type: string, handler: MessageHandler): (() => void) => {
    if (!eventHandlers.has(type)) {
      eventHandlers.set(type, new Set())
    }
    eventHandlers.get(type)!.add(handler)

    return () => {
      const handlers = eventHandlers.get(type)
      if (handlers) {
        handlers.delete(handler)
        if (handlers.size === 0) {
          eventHandlers.delete(type)
        }
      }
    }
  }

  const once = (type: string, handler: MessageHandler) => {
    const unwrap = (_payload: unknown) => {
      off()
      handler(_payload)
    }
    const off = on(type, unwrap)
  }

  const destroy = () => {
    pendingCallbacks.forEach(cb => {
      clearTimeout(cb.timeoutId)
    })
    pendingCallbacks.clear()
    eventHandlers.clear()
    if (messagePort) {
      messagePort.close()
      messagePort = null
    }
    isConnected = false
  }

  return {
    send,
    sendRequest,
    on,
    once,
    destroy,
    get isConnected() {
      return isConnected
    }
  }
}

export function useFreedomBridge(target: Window | null, config?: FreedomBridgeConfig): FreedomBridgeAPI | null {
  const bridgeRef = useRef<FreedomBridgeAPI | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!target) return

    const bridge = createFreedomBridge(target, config)
    bridgeRef.current = bridge

    const checkReady = setInterval(() => {
      if (bridge.isConnected) {
        setIsReady(true)
        clearInterval(checkReady)
      }
    }, 100)

    setTimeout(() => {
      clearInterval(checkReady)
      setIsReady(true)
    }, 500)

    return () => {
      bridge.destroy()
    }
  }, [target, config?.targetOrigin, config?.timeout, config?.debug])

  return bridgeRef.current
}

export function createSandboxedIframe(
  src: string,
  container: HTMLElement,
  options: {
    width?: number
    height?: number
    sandbox?: string
    title?: string
  } = {}
): HTMLIFrameElement {
  const iframe = document.createElement('iframe')
  
  iframe.src = src
  iframe.width = options.width?.toString() || '100%'
  iframe.height = options.height?.toString() || '100%'
  iframe.title = options.title || 'Sandboxed Content'
  iframe.sandbox.add(options.sandbox || 'allow-scripts allow-same-origin')
  iframe.style.cssText = `
    border: none;
    display: block;
    width: 100%;
    height: 100%;
  `
  
  container.appendChild(iframe)
  return iframe
}

export function validateParentOrigin(allowedOrigins: string[]): boolean {
  return allowedOrigins.includes('*') || allowedOrigins.includes(window.location.origin)
}