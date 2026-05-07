import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getPageStateStmt, setPageStateStmt } from '@/lib/studio-db'

// Validation schema for the request body
const PageStateSchema = z.object({
  pageKey: z.string().default('homepage'),
  settings: z.record(z.any()), // Full settings object from Zustand
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const key = searchParams.get('key') || 'homepage'
    
    // Synchronous call to better-sqlite3
    const row = getPageStateStmt.get(key) as { value: string } | undefined
    
    if (!row) {
      return NextResponse.json({ settings: null, pageKey: key })
    }

    return NextResponse.json({
      pageKey: key,
      ...JSON.parse(row.value)
    })
  } catch (error) {
    console.error('Studio Pro load error:', error)
    return NextResponse.json({ error: 'Load failed' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = PageStateSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid data format', details: result.error.format() }, { status: 400 })
    }

    const { pageKey, settings } = result.data
    const value = JSON.stringify({ settings })
    const now = Date.now()

    // Synchronous call to better-sqlite3
    setPageStateStmt.run(pageKey, value, now)

    return NextResponse.json({ success: true, savedAt: now })
  } catch (error) {
    console.error('Studio Pro save error:', error)
    return NextResponse.json({ error: 'Save failed' }, { status: 500 })
  }
}
