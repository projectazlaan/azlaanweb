import type { ComponentJSON } from './compiler'

export type FrameworkType = 'nextjs' | 'static-html' | 'vue'

export interface ExportOptions {
  framework: FrameworkType
  ssr?: boolean
  minify?: boolean
  includeStyles?: boolean
  pageName?: string
}

export interface ExportResult {
  code: string
  filename: string
  mimeType: string
  framework: FrameworkType
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function componentToHTML(component: ComponentJSON, indent = 0): string {
  const spaces = ' '.repeat(indent)
  const tag = component.tagName || 'div'
  
  let attrs = ''
  if (component.attributes) {
    Object.entries(component.attributes).forEach(([key, value]) => {
      attrs += ` ${key}="${escapeHtml(String(value))}"`
    })
  }
  if (component.classes && component.classes.length > 0) {
    attrs += ` class="${component.classes.join(' ')}"`
  }
  if (component.styles) {
    const styleStr = Object.entries(component.styles)
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ')
    attrs += ` style="${styleStr}"`
  }
  
  const children = component.components || []
  const content = component.content || ''
  
  if (children.length === 0 && !content) {
    return `${spaces}<${tag}${attrs} />`
  }
  
  let inner = ''
  if (content) {
    inner = `${spaces}  ${content}\n`
  }
  if (children.length > 0) {
    inner = children
      .map(child => componentToHTML(child, indent + 2))
      .join('\n') + '\n'
  }
  
  return `${spaces}<${tag}${attrs}>\n${inner}${spaces}</${tag}>`
}

function componentToVue(component: ComponentJSON, indent = 0): string {
  const spaces = ' '.repeat(indent)
  const tag = component.tagName || 'div'
  
  let attrs = ''
  if (component.attributes) {
    Object.entries(component.attributes).forEach(([key, value]) => {
      if (key === 'src' || key === 'href') {
        attrs += ` :${key}="'${value}'"`
      } else {
        attrs += ` ${key}="${value}"`
      }
    })
  }
  if (component.classes && component.classes.length > 0) {
    attrs += ` :class="['${component.classes.join("', '")}']"`
  }
  if (component.styles) {
    const styleObj = Object.entries(component.styles)
      .map(([k, v]) => `'${k}': '${v}'`)
      .join(', ')
    attrs += ` :style="{${styleObj}}"`
  }
  
  const children = component.components || []
  const content = component.content || ''
  
  if (children.length === 0 && !content) {
    return `${spaces}<${tag}${attrs} />`
  }
  
  let inner = ''
  if (content) {
    inner = `${spaces}  ${content}\n`
  }
  if (children.length > 0) {
    inner = children
      .map(child => componentToVue(child, indent + 2))
      .join('\n') + '\n'
  }
  
  return `${spaces}<${tag}${attrs}>\n${inner}${spaces}</${tag}>`
}

export function exportToStaticHTML(components: ComponentJSON[]): string {
  const body = components
    .map(comp => componentToHTML(comp))
    .join('\n')
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Page</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
${body}
</body>
</html>`
}

export function exportToVue(components: ComponentJSON[], pageName = 'ExportedPage'): string {
  const template = components
    .map(comp => componentToVue(comp))
    .join('\n')
  
  return `<template>
  <div class="exported-page">
${template.split('\n').map(line => '    ' + line).join('\n')}
  </div>
</template>

<script setup>
import { ref } from 'vue'

const pageName = '${pageName}'
</script>

<style scoped>
.exported-page {
  width: 100%;
}
</style>`
}

export function exportToNextJS(
  components: ComponentJSON[],
  pageName = 'ExportedPage',
  ssr = true
): string {
  const imports = ssr
    ? "import type { GetServerSideProps } from 'next'"
    : "import Head from 'next/head'"
  
  const body = components
    .map(comp => {
      const tag = comp.tagName || 'div'
      let attrs = ''
      if (comp.classes) attrs += ` className="${comp.classes.join(' ')}"`
      if (comp.attributes) {
        Object.entries(comp.attributes).forEach(([key, val]) => {
          attrs += ` ${key}="${val}"`
        })
      }
      return `<${tag}${attrs}>${comp.content || ''}</${tag}>`
    })
    .join('\n      ')
  
  return `${imports}

export default function ${pageName}() {
  return (
    <>
      <main>
        ${body}
      </main>
    </>
  )
}

${ssr ? `export const getServerSideProps: GetServerSideProps = async () => {
  return { props: {} }
}` : ''}
`
}

export function exportComponents(
  components: ComponentJSON[],
  options: ExportOptions
): ExportResult {
  switch (options.framework) {
    case 'nextjs':
      return {
        code: exportToNextJS(components, options.pageName, options.ssr),
        filename: `${options.pageName || 'page'}.tsx`,
        mimeType: 'text/typescript',
        framework: 'nextjs'
      }
    
    case 'static-html':
      return {
        code: exportToStaticHTML(components),
        filename: 'index.html',
        mimeType: 'text/html',
        framework: 'static-html'
      }
    
    case 'vue':
      return {
        code: exportToVue(components, options.pageName),
        filename: `${options.pageName || 'App'}.vue`,
        mimeType: 'text/vue',
        framework: 'vue'
      }
    
    default:
      throw new Error(`Unsupported framework: ${options.framework}`)
  }
}

export function downloadFile(result: ExportResult): void {
  if (typeof window === 'undefined') return
  
  const blob = new Blob([result.code], { type: result.mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = result.filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
