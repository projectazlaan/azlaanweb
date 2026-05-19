import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const db = getDb()
    const stmt = db.prepare('SELECT * FROM hero LIMIT 1')
    let hero = stmt.get() as any
    const settings = db.prepare('SELECT * FROM settings').get() as any

    if (!hero) {
      const insert = db.prepare('INSERT INTO hero (id) VALUES (?)')
      insert.run('default')
      hero = stmt.get()
    }

    const mergedHero = {
      ...hero,
      title: settings?.heroHeadline || hero?.title || "Azlaan",
      description: settings?.heroSubheadline || hero?.description || "Bangladeshi Premium Clothing",
      cta1Text: settings?.heroButtonText || hero?.cta1Text || "Shop Now",
      bgImage: hero?.bgImage?.includes('unsplash') || !hero?.bgImage 
        ? '/media-pro/cover/cover 1.jpg' 
        : hero.bgImage
    }

    return NextResponse.json(mergedHero)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch hero' }, { status: 500 })
  }
}
