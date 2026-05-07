import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import type { NextRequest } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const db = getDb()
    const stmt = db.prepare('SELECT * FROM settings LIMIT 1')
    let settings = stmt.get()
    if (!settings) {
      const insert = db.prepare('INSERT INTO settings (id) VALUES (?)')
      insert.run('default')
      settings = stmt.get()
    }
    return NextResponse.json(settings)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { siteName, siteNameBn, description, contactEmail, contactPhone, address, facebook, instagram, newsletterEnabled } = body

    const db = getDb()
    const stmt = db.prepare(`
      UPDATE settings
      SET siteName = COALESCE(?, siteName),
          siteNameBn = COALESCE(?, siteNameBn),
          description = COALESCE(?, description),
          contactEmail = COALESCE(?, contactEmail),
          contactPhone = COALESCE(?, contactPhone),
          address = COALESCE(?, address),
          facebook = COALESCE(?, facebook),
          instagram = COALESCE(?, instagram),
          newsletterEnabled = COALESCE(?, newsletterEnabled)
      WHERE id = 'default'
    `)
    stmt.run(siteName || null, siteNameBn || null, description || null, contactEmail || null, contactPhone || null, address || null, facebook || null, instagram || null, newsletterEnabled !== undefined ? (newsletterEnabled ? 1 : 0) : null)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
