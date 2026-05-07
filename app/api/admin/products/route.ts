import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { nanoid } from 'nanoid'
import type { NextRequest } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const db = getDb()
    const stmt = db.prepare('SELECT * FROM products ORDER BY createdAt DESC')
    const products = stmt.all()
    return NextResponse.json(products)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, nameBn, price, image, category, categoryBn, description, descriptionBn } = body

    if (!name || !price || !image || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const db = getDb()
    const id = nanoid()
    const now = new Date().toISOString()
    const priceNum = typeof price === 'string' ? parseInt(price.replace(/[^\d]/g, '')) : price
    const priceDisplay = `৳${priceNum.toLocaleString('en-IN')}`

    const stmt = db.prepare(`
      INSERT INTO products (id, name, nameBn, price, priceDisplay, image, category, categoryBn, description, descriptionBn, inStock, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
    `)
    stmt.run(id, name, nameBn || name, priceNum, priceDisplay, image, category, categoryBn || category, description || null, descriptionBn || null, now, now)

    return NextResponse.json({ success: true, id })
  } catch {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
