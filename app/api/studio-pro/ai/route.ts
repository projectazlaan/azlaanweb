import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GOOGLE_AI_KEY || process.env.GEMINI_API_KEY || ''

type AIMode = 'section' | 'text' | 'palette' | 'colors'

// ─── System Prompts ────────────────────────────────────────────────────────────

const SYSTEM_PROMPTS: Record<AIMode, string> = {
  section: `You are a world-class web developer and UI designer.
Generate a complete, self-contained HTML section based on the user's prompt.
Rules:
- Output ONLY raw HTML (no markdown, no code fences, no explanation)
- Use modern inline CSS via style attributes (Tailwind NOT required)
- Make it visually stunning, production-ready, and responsive
- Add data-customizable="true" to editable elements
- Do NOT include <html>, <head>, <body> tags
- If context is provided, modify or improve the existing element accordingly`,

  text: `You are a professional copywriter and content editor.
Improve or rewrite the given text based on the user's instruction.
Rules:
- Output ONLY the improved text (no explanation, no quotes, no markdown)
- Keep the same language as input
- If the user asks to translate, translate it
- Be concise, compelling, and professional`,

  palette: `You are a professional UI/UX designer specializing in color theory.
Generate a cohesive color palette based on the user's prompt.
Rules:
- Output ONLY valid JSON in this exact format (no markdown, no code fences):
{"primary":"#hex","secondary":"#hex","background":"#hex","text":"#hex","accent":"#hex"}
- Use beautiful, modern hex colors with good contrast ratios
- Consider the mood and brand personality in the prompt`,

  colors: `You are a professional UI/UX designer specializing in color theory.
Generate a cohesive color palette based on the user's prompt.
Rules:
- Output ONLY valid JSON in this exact format (no markdown, no code fences):
{"primary":"#hex","secondary":"#hex","background":"#hex","text":"#hex","accent":"#hex"}
- Use beautiful, modern hex colors with good contrast ratios`,
}

// ─── Provider Calls ─────────────────────────────────────────────────────────

async function callGemini(systemPrompt: string, userPrompt: string, apiKey: string, model = 'gemini-2.0-flash'): Promise<string> {
  if (!apiKey) throw new Error('Gemini API key not configured on server. Add GOOGLE_AI_KEY to .env.local')
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
      generationConfig: { temperature: 0.8, maxOutputTokens: 4096 },
    }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error?.message || 'Gemini API Error')
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}

async function callOpenAI(systemPrompt: string, userPrompt: string, apiKey: string, model = 'gpt-4o'): Promise<string> {
  if (!apiKey) throw new Error('OpenAI API key is required. Enter it in Settings.')
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
      temperature: 0.8,
      max_tokens: 4096,
    }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error?.message || 'OpenAI API Error')
  return data.choices?.[0]?.message?.content ?? ''
}

async function callAnthropic(systemPrompt: string, userPrompt: string, apiKey: string, model = 'claude-3-5-sonnet-20241022'): Promise<string> {
  if (!apiKey) throw new Error('Anthropic API key is required. Enter it in Settings.')
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error?.message || 'Anthropic API Error')
  return data.content?.[0]?.text ?? ''
}

async function callOpenRouter(systemPrompt: string, userPrompt: string, apiKey: string, model = 'openai/gpt-4o'): Promise<string> {
  if (!apiKey) throw new Error('OpenRouter API key is required. Enter it in Settings.')
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://azlaan.com',
      'X-Title': 'Studio Pro V12',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
      temperature: 0.8,
    }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error?.message || 'OpenRouter API Error')
  return data.choices?.[0]?.message?.content ?? ''
}

// ─── Main Route ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { prompt, mode = 'section', provider = 'gemini', model, customKey, context } = body

    if (!prompt) return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })

    // Build system prompt based on mode
    const systemPrompt = SYSTEM_PROMPTS[(mode as AIMode)] ?? SYSTEM_PROMPTS.section

    // Enrich user prompt with element context if provided
    let userPrompt = prompt
    if (context) {
      const contextLines: string[] = []
      if (context.tag)   contextLines.push(`Element: <${context.tag}>`)
      if (context.text)  contextLines.push(`Current text: "${context.text}"`)
      if (context.styles && Object.keys(context.styles).length > 0) {
        const styleSnippet = Object.entries(context.styles)
          .slice(0, 10)
          .map(([k, v]) => `${k}: ${v}`)
          .join('; ')
        contextLines.push(`Current styles: ${styleSnippet}`)
      }
      userPrompt = `${contextLines.join('\n')}\n\nInstruction: ${prompt}`
    }

    let result = ''

    // Map UI model IDs to actual API model strings if needed
    let apiModel = model;
    if (model === 'gemini-high') apiModel = 'gemini-1.5-pro-latest';
    else if (model === 'gemini-low') apiModel = 'gemini-1.5-flash-latest';
    else if (model === 'gemini') apiModel = 'gemini-2.0-flash';
    else if (model === 'anthropic') apiModel = 'claude-3-5-sonnet-20241022';
    else if (model === 'anthropic-opus') apiModel = 'claude-3-opus-20240229';
    else if (model === 'openai') apiModel = 'gpt-4o';

    switch (provider) {
      case 'gemini':
        result = await callGemini(systemPrompt, userPrompt, customKey || GEMINI_API_KEY, apiModel)
        break
      case 'openai':
        result = await callOpenAI(systemPrompt, userPrompt, customKey || '', apiModel)
        break
      case 'anthropic':
        result = await callAnthropic(systemPrompt, userPrompt, customKey || '', apiModel)
        break
      case 'opencode':
        // Opencode uses OpenRouter with a code-specialized model
        result = await callOpenRouter(systemPrompt, userPrompt, customKey || '', 'qwen/qwen-2.5-coder-32b-instruct')
        break
      case 'custom':
        result = await callOpenRouter(systemPrompt, userPrompt, customKey || '', 'openai/gpt-4o')
        break
      default:
        result = await callGemini(systemPrompt, userPrompt, customKey || GEMINI_API_KEY)
    }

    // For palette mode, try to parse JSON
    if (mode === 'palette' || mode === 'colors') {
      try {
        const cleaned = result.trim().replace(/```json\n?|```\n?/g, '').trim()
        const colors = JSON.parse(cleaned)
        return NextResponse.json({ success: true, colors, result: cleaned })
      } catch {
        return NextResponse.json({ success: true, result: result.trim() })
      }
    }

    return NextResponse.json({ success: true, result: result.trim() })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[AI Studio Pro]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
