import { getAllComponents, getComponentsByCategory, type ComponentCategory } from './component-registry'

export interface BuilderBlock {
  id: string
  label: string
  labelBn: string
  category: string
  content: string
  attributes: Record<string, string>
}

export function generateBuilderBlocks(): BuilderBlock[] {
  const components = getAllComponents()
  
  return components.map(entry => ({
    id: entry.config.key,
    label: entry.config.name,
    labelBn: entry.config.nameBn,
    category: entry.config.category,
    content: `<div data-custom-key="${entry.config.key}" data-customizable="true"></div>`,
    attributes: {
      'data-custom-key': entry.config.key,
      'data-customizable': 'true',
    },
  }))
}

export function generateBlocksByCategory(category: ComponentCategory): BuilderBlock[] {
  const components = getComponentsByCategory(category)
  
  return components.map(entry => ({
    id: entry.config.key,
    label: entry.config.name,
    labelBn: entry.config.nameBn,
    category: entry.config.category,
    content: `<div data-custom-key="${entry.config.key}" data-customizable="true"></div>`,
    attributes: {
      'data-custom-key': entry.config.key,
      'data-customizable': 'true',
    },
  }))
}

export interface BuilderBlockCategory {
  id: string
  label: string
  labelBn: string
  blocks: BuilderBlock[]
}

export function generateBlockCategories(): BuilderBlockCategory[] {
  const categories = ['layout', 'hero', 'content', 'products', 'media', 'forms', 'marketing'] as ComponentCategory[]
  
  return categories.map(category => {
    const blocks = generateBlocksByCategory(category)
    if (blocks.length === 0) return null
    
    return {
      id: category,
      label: category.charAt(0).toUpperCase() + category.slice(1),
      labelBn: getCategoryLabelBn(category),
      blocks,
    }
  }).filter(Boolean) as BuilderBlockCategory[]
}

function getCategoryLabelBn(category: ComponentCategory): string {
  const labels: Record<ComponentCategory, string> = {
    layout: 'লেআউট',
    hero: 'হিরো',
    content: 'কন্টেন্ট',
    products: 'প্রোডাক্টস',
    media: 'মিডিয়া',
    forms: 'ফর্মস',
    marketing: 'মার্কেটিং',
  }
  return labels[category] || category
}

export function getComponentConfig(key: string) {
  const components = getAllComponents()
  return components.find(c => c.config.key === key)?.config
}