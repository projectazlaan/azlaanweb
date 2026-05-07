interface Product {
  id: string
  name: string
  price: number
  description?: string
  image?: string
  sku?: string
  inventory: number
}

interface CartItem extends Product {
  quantity: number
}

interface StripeConfig {
  publishableKey: string
  secretKey?: string
}

interface PaymentResult {
  success: boolean
  transactionId?: string
  error?: string
}

let products: Product[] = []
let cart: CartItem[] = []
let stripeConfig: StripeConfig | null = null

export function registerProduct(product: Omit<Product, 'id'>): Product {
  const newProduct: Product = { ...product, id: crypto.randomUUID() }
  products.push(newProduct)
  return newProduct
}

export function getProducts(): Product[] {
  return [...products]
}

export function getProduct(id: string): Product | undefined {
  return products.find(p => p.id === id)
}

export function syncProducts(externalProducts: Product[]): void {
  products = [...externalProducts]
}

export function addToCart(productId: string, quantity: number = 1): CartItem | undefined {
  const product = products.find(p => p.id === productId)
  if (!product) return undefined

  const existingItem = cart.find(item => item.id === productId)
  if (existingItem) {
    existingItem.quantity += quantity
    return existingItem
  }

  const cartItem: CartItem = { ...product, quantity }
  cart.push(cartItem)
  return cartItem
}

export function removeFromCart(productId: string): void {
  cart = cart.filter(item => item.id !== productId)
}

export function updateCartQuantity(productId: string, quantity: number): void {
  const item = cart.find(item => item.id === productId)
  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      item.quantity = quantity
    }
  }
}

export function getCart(): CartItem[] {
  return [...cart]
}

export function getCartTotal(): number {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
}

export function clearCart(): void {
  cart = []
}

export function configureStripe(config: StripeConfig): void {
  stripeConfig = config
}

export async function processStripePayment(amount: number, currency: string = 'usd'): Promise<PaymentResult> {
  if (!stripeConfig) {
    return { success: false, error: 'Stripe not configured' }
  }

  try {
    const response = await fetch('/api/payment/stripe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, currency, publishableKey: stripeConfig.publishableKey })
    })

    if (!response.ok) {
      throw new Error('Payment failed')
    }

    const data = await response.json()
    return { success: true, transactionId: data.transactionId }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Payment error' }
  }
}

export function processSSLCommerzPayment(amount: number, transactionId: string): string {
  const sslUrl = process.env.SSLCOMMERZ_URL || 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php'
  const storeId = process.env.SSLCOMMERZ_STORE_ID
  const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD

  const params = new URLSearchParams({
    store_id: storeId || '',
    store_passwd: storePassword || '',
    total_amount: String(amount),
    currency: 'BDT',
    tran_id: transactionId,
    success_url: `${window.location.origin}/payment/success`,
    fail_url: `${window.location.origin}/payment/fail`,
    cancel_url: `${window.location.origin}/payment/cancel`,
  })

  return `${sslUrl}?${params.toString()}`
}

export type { Product, CartItem, StripeConfig, PaymentResult }
