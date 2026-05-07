import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const db = getDb()
    const stmt = db.prepare('SELECT * FROM hero LIMIT 1')
    let hero = stmt.get()
    if (!hero) {
      const insert = db.prepare('INSERT INTO hero (id) VALUES (?)')
      insert.run('default')
      hero = stmt.get()
    }
    return NextResponse.json(hero)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch hero' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { title, subtitle, description, bgImage, cta1Text, cta1Link, cta2Text, cta2Link } = body

    const db = getDb()
    const stmt = db.prepare(`
      UPDATE hero
      SET title = COALESCE(?, title),
          subtitle = COALESCE(?, subtitle),
          description = COALESCE(?, description),
          bgImage = COALESCE(?, bgImage),
          cta1Text = COALESCE(?, cta1Text),
          cta1Link = COALESCE(?, cta1Link),
          cta2Text = COALESCE(?, cta2Text),
          cta2Link = COALESCE(?, cta2Link)
      WHERE id = 'default'
    `)
    stmt.run(title || null, subtitle || null, description || null, bgImage || null, cta1Text || null, cta1Link || null, cta2Text || null, cta2Link || null)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update hero' }, { status: 500 })
  }
}
