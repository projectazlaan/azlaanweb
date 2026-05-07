import { NextRequest, NextResponse } from 'next/server'
import { getPageStateStmt } from '@/lib/studio-db'

export async function POST(req: NextRequest) {
  try {
    const { format = 'json', settings } = await req.json()

    if (format === 'json') {
      return NextResponse.json(
        { settings, exportedAt: new Date().toISOString(), version: 'v12' },
        {
          headers: {
            'Content-Disposition': 'attachment; filename="studio-pro-v12-export.json"',
            'Content-Type': 'application/json',
          },
        }
      )
    }

    if (format === 'html') {
      // Load saved data
      let savedSettings = settings
      if (!savedSettings) {
        try {
          // Fallback: Read from SQLite DB
          const row = getPageStateStmt.get('homepage') as { value: string } | undefined
          if (row) {
            savedSettings = JSON.parse(row.value).settings
          }
        } catch { /* use defaults */ }
      }

      const colors = savedSettings?.colors ?? {}
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Exported from Studio Pro V12</title>
  <style>
    :root {
      --color-primary: ${colors.primary ?? '#1a1a2e'};
      --color-secondary: ${colors.secondary ?? '#e94560'};
      --color-background: ${colors.background ?? '#ffffff'};
      --color-text: ${colors.text ?? '#1a1a1a'};
    }
    body {
      margin: 0;
      font-family: Inter, sans-serif;
      background: var(--color-background);
      color: var(--color-text);
    }
    /* Custom element overrides */
    ${Object.entries(savedSettings?.customStyles ?? {}).map(([key, styles]) =>
      `[data-custom-key="${key}"] { ${Object.entries(styles as Record<string, string>).map(([p, v]) => `${p.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v}`).join('; ')} }`
    ).join('\n    ')}
  </style>
</head>
<body>
  <!-- Exported from Azlaan Studio Pro V12 -->
  <!-- Custom styles and theme are applied via CSS variables above -->
  <!-- Re-integrate your page components here -->
</body>
</html>`

      return new NextResponse(html, {
        headers: {
          'Content-Disposition': 'attachment; filename="studio-export.html"',
          'Content-Type': 'text/html',
        },
      })
    }

    return NextResponse.json({ error: 'Invalid format' }, { status: 400 })
  } catch (error) {
    console.error('[Export]', error)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}
