import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { nanoid } from 'nanoid'
import type { NextRequest } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const db = getDb()
    const stmt = db.prepare('SELECT * FROM testimonials ORDER BY createdAt DESC')
    const testimonials = stmt.all()
    return NextResponse.json(testimonials)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, nameBn, location, locationBn, review, reviewBn, initial, rating } = body

    if (!name || !review) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const db = getDb()
    const id = nanoid()
    const now = new Date().toISOString()

    const stmt = db.prepare(`
      INSERT INTO testimonials (id, name, nameBn, location, locationBn, review, reviewBn, initial, rating, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    stmt.run(id, name, nameBn || name, location || '', locationBn || '', review, reviewBn || review, initial || name.charAt(0), rating || 5, now)

    return NextResponse.json({ success: true, id })
  } catch {
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 })
  }
}
