import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import type { NextRequest } from 'next/server'

export const runtime = 'nodejs'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = getDb()
    const stmt = db.prepare('SELECT * FROM products WHERE id = ?')
    const product = stmt.get(id)
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, nameBn, price, image, category, categoryBn, description, descriptionBn, inStock } = body

    const db = getDb()
    const now = new Date().toISOString()
    const priceNum = price !== undefined ? (typeof price === 'string' ? parseInt(price.replace(/[^\d]/g, '')) : price) : undefined
    const priceDisplay = priceNum !== undefined ? `৳${priceNum.toLocaleString('en-IN')}` : undefined

    const stmt = db.prepare(`
      UPDATE products
      SET name = COALESCE(?, name),
          nameBn = COALESCE(?, nameBn),
          price = COALESCE(?, price),
          priceDisplay = COALESCE(?, priceDisplay),
          image = COALESCE(?, image),
          category = COALESCE(?, category),
          categoryBn = COALESCE(?, categoryBn),
          description = COALESCE(?, description),
          descriptionBn = COALESCE(?, descriptionBn),
          inStock = COALESCE(?, inStock),
          updatedAt = ?
      WHERE id = ?
    `)
    stmt.run(name || null, nameBn || null, priceNum || null, priceDisplay || null, image || null, category || null, categoryBn || null, description || null, descriptionBn || null, inStock !== undefined ? (inStock ? 1 : 0) : null, now, id)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = getDb()
    const stmt = db.prepare('DELETE FROM products WHERE id = ?')
    stmt.run(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
