import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import type { NextRequest } from 'next/server'

export const runtime = 'nodejs'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, nameBn, location, locationBn, review, reviewBn, initial, rating } = body

    const db = getDb()
    const stmt = db.prepare(`
      UPDATE testimonials
      SET name = COALESCE(?, name),
          nameBn = COALESCE(?, nameBn),
          location = COALESCE(?, location),
          locationBn = COALESCE(?, locationBn),
          review = COALESCE(?, review),
          reviewBn = COALESCE(?, reviewBn),
          initial = COALESCE(?, initial),
          rating = COALESCE(?, rating)
      WHERE id = ?
    `)
    stmt.run(name || null, nameBn || null, location || null, locationBn || null, review || null, reviewBn || null, initial || null, rating || null, id)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = getDb()
    const stmt = db.prepare('DELETE FROM testimonials WHERE id = ?')
    stmt.run(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 })
  }
}
