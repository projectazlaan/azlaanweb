import { NextRequest, NextResponse } from 'next/server'
import { readdir, readFile, stat } from 'fs/promises'
import path from 'path'
import { getAllGalleryMetaStmt, setGalleryMetaStmt } from '@/lib/studio-db'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'studio-uploads')

export async function GET() {
  try {
    // Ensure directory exists
    try { await stat(UPLOAD_DIR) } catch {
      return NextResponse.json({ images: [] })
    }

    const files = await readdir(UPLOAD_DIR)
    const imageFiles = files.filter(f =>
      /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f)
    )

    // Fetch all metadata once
    const metas = getAllGalleryMetaStmt.all() as { id: string, tags: string, favorite: number }[]
    const metaMap = new Map(metas.map(m => [m.id, m]))

    const images = await Promise.all(
      imageFiles.map(async (filename) => {
        const filePath = path.join(UPLOAD_DIR, filename)
        const stats = await stat(filePath)
        const id = filename.replace(/\.[^/.]+$/, '')
        const meta = metaMap.get(id)
        let tags: string[] = []
        if (meta?.tags) {
          try { tags = JSON.parse(meta.tags) } catch { /* ignore */ }
        }

        return {
          id,
          url: `/studio-uploads/${filename}`,
          filename,
          size: stats.size,
          mimeType: `image/${filename.split('.').pop()?.toLowerCase()}`,
          tags,
          favorite: meta?.favorite === 1,
          createdAt: stats.birthtime.toISOString(),
        }
      })
    )

    // Sort by newest first
    images.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return NextResponse.json({ images })
  } catch (error) {
    console.error('Gallery GET error:', error)
    return NextResponse.json({ images: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, tags, favorite } = body

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    setGalleryMetaStmt.run(
      id,
      tags ? JSON.stringify(tags) : '[]',
      favorite ? 1 : 0
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Gallery POST error:', error)
    return NextResponse.json({ error: 'Failed to update metadata' }, { status: 500 })
  }
}
