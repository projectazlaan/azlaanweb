import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

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
