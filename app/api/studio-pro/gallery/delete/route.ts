import { NextRequest, NextResponse } from 'next/server'
import { unlink } from 'fs/promises'
import path from 'path'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'studio-uploads')

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'No id provided' }, { status: 400 })

    // Find the file by id (id = filename without extension)
    const extensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg']
    let deleted = false

    for (const ext of extensions) {
      const filePath = path.join(UPLOAD_DIR, `${id}.${ext}`)
      try {
        await unlink(filePath)
        deleted = true
        break
      } catch {
        // try next extension
      }
    }

    if (!deleted) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Gallery delete error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
