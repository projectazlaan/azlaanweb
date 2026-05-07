'use client'

import { useState, useEffect, useCallback } from 'react'

export interface ComponentState {
  [key: string]: string | number | boolean | undefined
}

interface UseComponentCustomizationOptions {
  componentKey: string
  initialData?: ComponentState
  persistKey?: string
}

export function useComponentCustomization<T extends ComponentState>(
  options: UseComponentCustomizationOptions
) {
  const { componentKey, initialData = {}, persistKey } = options
  const [data, setData] = useState<T>(initialData as T)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (persistKey) {
      const stored = localStorage.getItem(`custom_${persistKey}`)
      if (stored) {
        try {
          setData(JSON.parse(stored))
        } catch (e) {
          console.error('Failed to parse stored data:', e)
        }
      }
    }
  }, [persistKey])

  const updateField = useCallback((key: string, value: string | number | boolean) => {
    setData(prev => {
      const updated = { ...prev, [key]: value }
      if (persistKey) {
        localStorage.setItem(`custom_${persistKey}`, JSON.stringify(updated))
      }
      return updated
    })
  }, [persistKey])

  const updateMultiple = useCallback((updates: Partial<T>) => {
    setData(prev => {
      const updated = { ...prev, ...updates }
      if (persistKey) {
        localStorage.setItem(`custom_${persistKey}`, JSON.stringify(updated))
      }
      return updated
    })
  }, [persistKey])

  const resetToDefault = useCallback(() => {
    setData(initialData as T)
    if (persistKey) {
      localStorage.removeItem(`custom_${persistKey}`)
    }
  }, [initialData, persistKey])

  const getCustomizableProps = useCallback(() => {
    return {
      'data-customizable': 'true',
      'data-custom-key': componentKey,
    }
  }, [componentKey])

  return {
    data,
    updateField,
    updateMultiple,
    resetToDefault,
    isEditing,
    setIsEditing,
    getCustomizableProps,
  }
}

export function createCustomizableProps(componentKey: string, additionalProps?: Record<string, string>) {
  return {
    'data-customizable': 'true',
    'data-custom-key': componentKey,
    ...additionalProps,
  }
}