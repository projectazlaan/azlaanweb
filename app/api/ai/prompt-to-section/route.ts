import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { prompt, apiKey } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const googleApiKey = apiKey || process.env.GOOGLE_AI_API_KEY
    
    if (!googleApiKey) {
      const fallback = generateFallbackSection(prompt)
      return NextResponse.json({ result: fallback })
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
            parts: [{
              text: `Generate a single UI section based on this request: "${prompt}"

Create a hero section with HTML and CSS that can be embedded in a webpage. 

Output a JSON object with this exact structure (no markdown, just the raw JSON):
{
  "html": "<div class='section'>...HTML content...</div>",
  "css": ".section { ...CSS styles... }",
  "explanation": "Brief description of what was created"
}

Make it look professional with:
- Modern, clean design
- Proper spacing and typography
- Responsive considerations
- Use dark theme colors (dark backgrounds, light text)
- Include at least one CTA button if appropriate`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000
          }
        })
      }
    )

    if (!response.ok) {
      throw new Error('Failed to generate section')
    }

    const data = await response.json()
    const text = data.candidates[0].content.parts[0].text

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0])
        return NextResponse.json({ result })
      }
    } catch {
      const fallback = generateFallbackSection(prompt)
      return NextResponse.json({ result: fallback })
    }

    const fallback = generateFallbackSection(prompt)
    return NextResponse.json({ result: fallback })

  } catch (error) {
    console.error('Prompt-to-section error:', error)
    const fallback = generateFallbackSection('custom section')
    return NextResponse.json({ result: fallback })
  }
}

function generateFallbackSection(prompt: string): { html: string; css: string; explanation: string } {
  const html = `
<div class="hero-section">
  <div class="hero-content">
    <h1 class="hero-title">Welcome to Our Platform</h1>
    <p class="hero-subtitle">Build amazing experiences with our tools</p>
    <div class="hero-cta">
      <button class="cta-primary">Get Started</button>
      <button class="cta-secondary">Learn More</button>
    </div>
  </div>
</div>`.trim()

  const css = `
.hero-section {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 4rem 2rem;
  text-align: center;
}
.hero-content {
  max-width: 800px;
}
.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1rem;
  line-height: 1.2;
}
.hero-subtitle {
  font-size: 1.25rem;
  color: #a0aec0;
  margin-bottom: 2rem;
}
.hero-cta {
  display: flex;
  gap: 1rem;
  justify-content: center;
}
.cta-primary {
  padding: 1rem 2rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}
.cta-primary:hover {
  background: #4f46e5;
  transform: translateY(-2px);
}
.cta-secondary {
  padding: 1rem 2rem;
  background: transparent;
  color: #a0aec0;
  border: 2px solid #4a5568;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}
.cta-secondary:hover {
  border-color: #6366f1;
  color: #6366f1;
}
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  .hero-cta {
    flex-direction: column;
  }
}`.trim()

  return {
    html,
    css,
    explanation: 'A modern hero section with gradient background, centered content, and call-to-action buttons.'
  }
}