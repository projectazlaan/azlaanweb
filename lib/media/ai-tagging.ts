interface AltTextOptions {
  imageUrl: string
  apiKey?: string
}

interface AltTextResult {
  success: boolean
  altText?: string
  tags?: string[]
  description?: string
  error?: string
}

export async function generateAltText({ 
  imageUrl, 
  apiKey 
}: AltTextOptions): Promise<AltTextResult> {
  const googleKey = apiKey || process.env.GOOGLE_AI_API_KEY
  
  if (!googleKey) {
    return { success: false, error: 'Google AI API key required' }
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${googleKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

    const altTextMatch = text.match(/ALT_TEXT:\s*(.+?)(?=TAGS:|$)/s)
    const tagsMatch = text.match(/TAGS:\s*(.+?)(?=DESCRIPTION:|$)/s)
    const descMatch = text.match(/DESCRIPTION:\s*(.+?)$/s)

    return {
      success: true,
      altText: altTextMatch?.[1]?.trim() || 'Image description unavailable',
      tags: tagsMatch?.[1]?.split(',').map((t: string) => t.trim()).filter(Boolean).slice(0, 8) || [],
      description: descMatch?.[1]?.trim() || ''
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
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

export async function generateAltTextClient(
  imageUrl: string,
  apiKey: string
): Promise<{ altText: string; tags: string[] }> {
  const response = await fetch('/api/ai/alt-text', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageUrl, apiKey })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to generate alt-text')
  }

  const data = await response.json()
  return data.result
}

export type { AltTextOptions, AltTextResult }