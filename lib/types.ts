export interface Product {
  id: string
  name: string
  nameBn: string
  price: number
  priceDisplay: string
  image: string
  category: 'Men' | 'Women' | 'Kids'
  categoryBn: string
  description?: string
  descriptionBn?: string
  inStock: boolean
  createdAt: string
  updatedAt: string
}

export interface Testimonial {
  id: string
  name: string
  nameBn: string
  location: string
  locationBn: string
  review: string
  reviewBn: string
  initial: string
  rating: number
  createdAt: string
}

export interface HeroContent {
  id: string
  title: string
  subtitle: string
  description: string
  bgImage: string
  cta1Text: string
  cta1Link: string
  cta2Text: string
  cta2Link: string
}

export interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  address: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
}

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  totalOrders: number
  totalSpent: number
  createdAt: string
}

export interface SiteSettings {
  id: string
  siteName: string
  siteNameBn: string
  description: string
  contactEmail: string
  contactPhone: string
  address: string
  facebook?: string
  instagram?: string
  newsletterEnabled: boolean
}

export interface AdminUser {
  id: string
  username: string
  passwordHash: string
  createdAt: string
}

export interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalCustomers: number
  revenue: number
  recentOrders: Order[]
  topProducts: { name: string; sales: number }[]
}

export interface JwtPayload {
  userId: string
  username: string
  exp?: number
}
