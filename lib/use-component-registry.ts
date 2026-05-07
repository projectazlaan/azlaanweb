'use client'

import { useState, useEffect, useCallback } from 'react'
import { getAllComponents, getComponentsByCategory, type ComponentCategory, type ComponentConfig } from './component-registry'

interface RegistryState {
  initialized: boolean
  components: ComponentConfig[]
  selectedComponent: string | null
}

export function useComponentRegistry() {
  const [state, setState] = useState<RegistryState>({
    initialized: false,
    components: [],
    selectedComponent: null,
  })

  useEffect(() => {
    const components = getAllComponents().map(c => c.config)
    setState(prev => ({
      ...prev,
      initialized: true,
      components,
    }))
  }, [])

  const selectComponent = useCallback((key: string | null) => {
    setState(prev => ({ ...prev, selectedComponent: key }))
  }, [])

  const getComponentConfig = useCallback((key: string): ComponentConfig | undefined => {
    return state.components.find(c => c.key === key)
  }, [state.components])

  const getByCategory = useCallback((category: ComponentCategory) => {
    return getComponentsByCategory(category).map(c => c.config)
  }, [])

  return {
    ...state,
    selectComponent,
    getComponentConfig,
    getByCategory,
    categories: ['layout', 'hero', 'content', 'products', 'media', 'forms', 'marketing'] as ComponentCategory[],
  }
}

export function useBuilderComponents() {
  const { components, categories } = useComponentRegistry()

  const getCategoryBlocks = useCallback((category: string) => {
    return components.filter(c => c.category === category)
  }, [components])

  const getAllBlocks = useCallback(() => {
    return categories.map(cat => ({
      id: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
      blocks: getCategoryBlocks(cat),
    }))
  }, [categories, getCategoryBlocks])

  return {
    components,
    categories,
    getCategoryBlocks,
    getAllBlocks,
  }
}