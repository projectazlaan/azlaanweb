import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import type { NextRequest } from 'next/server'

export const runtime = 'nodejs'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { status } = await request.json()

    const db = getDb()
    const stmt = db.prepare('UPDATE orders SET status = ? WHERE id = ?')
    stmt.run(status, id)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
