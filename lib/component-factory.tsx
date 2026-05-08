'use client'
import dynamic from 'next/dynamic'
const componentMap: Record<string, React.ComponentType<any>> = {
  Navbar: dynamic(() => import('@/components/Navbar').then(mod => mod.default), { ssr: false }),
  HeroSection: dynamic(() => import('@/components/HeroSection').then(mod => mod.default), { ssr: false }),
  CategorySection: dynamic(() => import('@/components/CategorySection').then(mod => mod.default), { ssr: false }),
  FeaturedProducts: dynamic(() => import('@/components/FeaturedProducts').then(mod => mod.default), { ssr: false }),
  BrandStory: dynamic(() => import('@/components/BrandStory').then(mod => mod.default), { ssr: false }),
  Testimonials: dynamic(() => import('@/components/Testimonials').then(mod => mod.default), { ssr: false }),
  Newsletter: dynamic(() => import('@/components/Newsletter').then(mod => mod.default), { ssr: false }),
  Footer: dynamic(() => import('@/components/Footer').then(mod => mod.default), { ssr: false }),
}
export function getComponentByKey(key: string): React.ComponentType<any> | null {
  return componentMap[key] || null
}
export function renderComponent(key: string, props?: Record<string, any>) {
  const Component = getComponentByKey(key)
  if (!Component) {
    console.warn(`Component "${key}" not found in factory`)
    return null
  }
  return <Component {...props} />
}
export function isComponentRegistered(key: string): boolean {
  return key in componentMap
}
export function getRegisteredComponents(): string[] {
  return Object.keys(componentMap)
}
export { componentMap }