'use client'

export type ComponentCategory = 
  | 'layout'
  | 'hero'
  | 'content'
  | 'products'
  | 'media'
  | 'forms'
  | 'marketing'

export interface ComponentConfig {
  key: string
  name: string
  nameBn: string
  category: ComponentCategory
  description: string
  descriptionBn: string
  defaultData?: Record<string, unknown>
  customizableFields: CustomizableField[]
}

export interface CustomizableField {
  key: string
  label: string
  labelBn: string
  type: 'text' | 'textarea' | 'image' | 'color' | 'select' | 'number' | 'toggle'
  defaultValue: string | number | boolean
  options?: { value: string; label: string; labelBn: string }[]
}

export interface RegisteredComponent {
  config: ComponentConfig
  component: React.ComponentType<any>
}

const componentRegistry = new Map<string, RegisteredComponent>()

export function registerComponent(config: ComponentConfig, component: React.ComponentType<any>) {
  componentRegistry.set(config.key, { config, component })
}

export function getComponent(key: string): RegisteredComponent | undefined {
  return componentRegistry.get(key)
}

export function getAllComponents(): RegisteredComponent[] {
  return Array.from(componentRegistry.values())
}

export function getComponentsByCategory(category: ComponentCategory): RegisteredComponent[] {
  return Array.from(componentRegistry.values()).filter(
    (entry) => entry.config.category === category
  )
}

export function getComponentCategories(): ComponentCategory[] {
  return ['layout', 'hero', 'content', 'products', 'media', 'forms', 'marketing']
}