import { NextResponse } from 'next/server'
import { getAllProducts } from '@/lib/data'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const products = await getAllProducts();
    
    // Transform data to match the legacy format expected by FeaturedProducts
    const legacyProducts = products.map(p => ({
      ...p,
      image: p.images[0], // Use first image as main image
      category: p.categorySlug.charAt(0).toUpperCase() + p.categorySlug.slice(1), // Capitalize
      priceDisplay: `৳${p.price.toLocaleString()}`
    }))

    return NextResponse.json(legacyProducts)
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
