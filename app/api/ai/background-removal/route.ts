import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, apiKey } = await req.json()

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 })
    }

    const replicateApiKey = apiKey || process.env.REPLICATE_API_KEY
    
    if (!replicateApiKey) {
      return NextResponse.json({ 
        error: 'API key required',
        fallback: true 
      }, { status: 400 })
    }

    const predictionResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${replicateApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: 'latest',
        input: {
          image: imageUrl,
          mask: null,
          remove_background: true
        }
      })
    })

    if (!predictionResponse.ok) {
      throw new Error('Failed to create prediction')
    }

    const prediction = await predictionResponse.json()

    let result = prediction
    while (result.status !== 'succeeded' && result.status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const statusResponse = await fetch(result.urls.get, {
        headers: {
          'Authorization': `Bearer ${replicateApiKey}`
        }
      })
      result = await statusResponse.json()
    }

    if (result.status === 'failed') {
      throw new Error(result.error || 'Prediction failed')
    }

    return NextResponse.json({ 
      result: result.output,
      status: result.status 
    })

  } catch (error) {
    console.error('Background removal error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'An error occurred' 
    }, { status: 500 })
  }
}