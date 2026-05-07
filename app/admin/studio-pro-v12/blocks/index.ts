import { HeroBlocks } from './hero'
import { FeatureBlocks } from './features'
import { TestimonialBlocks } from './testimonials'
import { BasicBlocks } from './basic'

export type BlockVariant = {
  id: string
  label: string
  html: string
}

export type BlockCategory = {
  id: string
  title: string
  icon: string
  variants: BlockVariant[]
}

export const StudioBlocks: BlockCategory[] = [
  {
    id: 'heroes',
    title: 'Hero Sections',
    icon: '🚀',
    variants: HeroBlocks
  },
  {
    id: 'features',
    title: 'Features',
    icon: '✨',
    variants: FeatureBlocks
  },
  {
    id: 'testimonials',
    title: 'Testimonials',
    icon: '💬',
    variants: TestimonialBlocks
  },
  {
    id: 'basic',
    title: 'Basic Elements',
    icon: '🧱',
    variants: BasicBlocks
  }
]
