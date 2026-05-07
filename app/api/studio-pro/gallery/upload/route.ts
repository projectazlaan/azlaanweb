import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, stat } from 'fs/promises'
import path from 'path'
import { nanoid } from 'nanoid'
import sharp from 'sharp'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'studio-uploads')
const MAX_SIZE = 50 * 1024 * 1024 // Increased to 50MB because we'll optimize it down
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export async function POST(req: NextRequest) {
  try {
    // Ensure upload directory exists
    try { await stat(UPLOAD_DIR) } catch {
      await mkdir(UPLOAD_DIR, { recursive: true })
    }

    const formData = await req.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    const uploaded: string[] = []

    for (const file of files) {
      // Validate type (allowing SVG separately since sharp shouldn't optimize vector icons the same way)
      if (file.type === 'image/svg+xml') {
        const uniqueId = nanoid(12)
        const filename = `${uniqueId}.svg`
        const filePath = path.join(UPLOAD_DIR, filename)
        const buffer = Buffer.from(await file.arrayBuffer())
        await writeFile(filePath, buffer)
        uploaded.push(`/studio-uploads/${filename}`)
        continue
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        continue
      }

      // Validate size
      if (file.size > MAX_SIZE) {
        continue
      }

      const uniqueId = nanoid(12)
      const filename = `${uniqueId}.webp` // Force webp
      const filePath = path.join(UPLOAD_DIR, filename)

      const buffer = Buffer.from(await file.arrayBuffer())
      
      // OPTIMIZATION MAGIC
      const optimizedBuffer = await sharp(buffer)
        .resize(1600, null, { // Max width 1600px, auto height
          withoutEnlargement: true, // Don't upscale small images
          fit: 'inside'
        })
        .webp({ quality: 80, effort: 6 }) // Convert to webp with high effort for better compression
        .toBuffer()

      await writeFile(filePath, optimizedBuffer)
      uploaded.push(`/studio-uploads/${filename}`)
    }

    return NextResponse.json({
      success: true,
      uploaded,
      count: uploaded.length,
    })
  } catch (error) {
    console.error('Gallery upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
