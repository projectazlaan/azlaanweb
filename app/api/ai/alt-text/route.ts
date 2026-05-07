import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, apiKey } = await req.json()

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 })
    }

    const googleApiKey = apiKey || process.env.GOOGLE_AI_API_KEY
    
    if (!googleApiKey) {
      return NextResponse.json({ 
        error: 'API key required',
        fallback: true 
      }, { status: 400 })
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${googleApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: `Analyze this image and provide:
1. A descriptive alt-text for accessibility (1-2 sentences)
2. A list of 5-8 relevant tags for categorization
3. A brief description of what's in the image

Format your response as:
ALT_TEXT: [your alt text here]
TAGS: [tag1, tag2, tag3, tag4, tag5, tag6, tag7, tag8]
DESCRIPTION: [2-3 sentence description]`
              },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: await getBase64FromUrl(imageUrl)
                }
              }
            ]
          }]
        })
      }
    )

    if (!response.ok) {
      throw new Error('Failed to analyze image')
    }

    const data = await response.json()
    const text = data.candidates[0].content.parts[0].text

    const altTextMatch = text.match(/ALT_TEXT:\s*([\s\S]+?)(?=TAGS:|$)/)
    const tagsMatch = text.match(/TAGS:\s*([\s\S]+?)(?=DESCRIPTION:|$)/)
    const descMatch = text.match(/DESCRIPTION:\s*([\s\S]+?)$/)

    const altText = altTextMatch ? altTextMatch[1].trim() : 'Image description unavailable'
    const tags = tagsMatch ? tagsMatch[1].split(',').map((t: string) => t.trim()).filter(Boolean).slice(0, 8) : []
    const description = descMatch ? descMatch[1].trim() : ''

    return NextResponse.json({ 
      result: {
        altText,
        tags,
        description
      }
    })

  } catch (error) {
    console.error('Alt-text generation error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'An error occurred' 
    }, { status: 500 })
  }
}

async function getBase64FromUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url)
    const buffer = await response.arrayBuffer()
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  } catch {
    return ''
  }
}