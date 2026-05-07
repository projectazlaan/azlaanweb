interface RemoveBackgroundOptions {
  imageUrl: string
  apiKey?: string
}

interface RemoveBackgroundResult {
  success: boolean
  resultUrl?: string
  error?: string
}

export async function removeBackground({ 
  imageUrl, 
  apiKey 
}: RemoveBackgroundOptions): Promise<RemoveBackgroundResult> {
  const replicateKey = apiKey || process.env.REPLICATE_API_KEY
  
  if (!replicateKey) {
    return { success: false, error: 'Replicate API key required' }
  }

  try {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${replicateKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: 'latest',
        input: {
          image: imageUrl,
          remove_background: true
        }
      })
    })

    if (!response.ok) {
      throw new Error('Failed to create prediction')
    }

    const prediction = await response.json()
    let result = prediction

    while (result.status !== 'succeeded' && result.status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const statusResponse = await fetch(result.urls.get, {
        headers: { 'Authorization': `Bearer ${replicateKey}` }
      })
      result = await statusResponse.json()
    }

    if (result.status === 'failed') {
      return { success: false, error: result.error || 'Processing failed' }
    }

    return { success: true, resultUrl: result.output }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

export async function removeBackgroundClient(
  imageUrl: string,
  apiKey: string
): Promise<string> {
  const response = await fetch('/api/ai/background-removal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageUrl, apiKey })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to remove background')
  }

  const data = await response.json()
  return data.result
}

export type { RemoveBackgroundOptions, RemoveBackgroundResult }