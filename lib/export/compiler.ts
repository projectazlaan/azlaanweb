import { nanoid } from 'nanoid'

export interface ComponentJSON {
  type: string
  tagName?: string
  attributes?: Record<string, any>
  components?: ComponentJSON[]
  styles?: Record<string, string>
  classes?: string[]
  content?: string
  id?: string
}

export interface CompiledComponent {
  jsx: string
  css: string
  imports: string[]
  componentName: string
}

export interface CleanCodeResult {
  components: CompiledComponent[]
  globalCSS: string
  unusedStyles: string[]
  optimizedJSX: string
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function toPascalCase(str: string): string {
  return str
    .split(/[-_ ]/)
    .map(capitalize)
    .join('')
}

function getTagName(component: ComponentJSON): string {
  return component.tagName || 'div'
}

function buildStyleString(styles?: Record<string, string>): string {
  if (!styles) return ''
  return Object.entries(styles)
    .map(([k, v]) => `${k}: ${v}`)
    .join('; ')
}

function compileComponent(
  component: ComponentJSON,
  indent = 2
): CompiledComponent {
  const id = component.id || nanoid(8)
  const tag = getTagName(component)
  const pascalName = toPascalCase(component.type || tag)
  const componentName = `${pascalName}${id}`
  
  const attrs: string[] = []
  const imports: string[] = []
  
  if (component.classes && component.classes.length > 0) {
    attrs.push(`className="${component.classes.join(' ')}"`)
  }
  
  if (component.attributes) {
    Object.entries(component.attributes).forEach(([key, value]) => {
      if (key === 'src' || key === 'href' || key === 'alt') {
        attrs.push(`${key}="${value}"`)
      } else if (key === 'id') {
        attrs.push(`id="${value}"`)
      }
    })
  }
  
  const styleStr = buildStyleString(component.styles)
  if (styleStr) {
    attrs.push(`style={{ ${Object.entries(component.styles || {})
      .map(([k, v]) => `"${k}": "${v}"`)
      .join(', ')} }}`)
  }
  
  let childrenJSX = ''
  if (component.components && component.components.length > 0) {
    childrenJSX = component.components
      .map(child => compileComponent(child, indent + 2))
      .map(c => `\n${' '.repeat(indent + 2)}${c.jsx.split('\n').join(`\n${' '.repeat(indent + 2)}`)}`)
      .join('')
    childrenJSX += `\n${' '.repeat(indent)}`
  } else if (component.content) {
    childrenJSX = component.content
  }
  
  const attrStr = attrs.length > 0 ? ' ' + attrs.join(' ') : ''
  const jsx = `<${tag}${attrStr}>${childrenJSX}</${tag}>`
  
return {
     jsx,
     css: styleStr,
     imports,
     componentName,
   }
}

export function compileToReact(component: ComponentJSON): CompiledComponent {
  return compileComponent(component)
}

export function compileToNextJS(component: ComponentJSON): CompiledComponent {
  const result = compileComponent(component)
  result.imports.push("import Image from 'next/image'")
  return result
}

export function purgeUnusedStyles(
  components: ComponentJSON[],
  globalCSS: string
): { purgedCSS: string; unusedStyles: string[] } {
  const usedClasses = new Set<string>()
  
  function collectClasses(comp: ComponentJSON) {
    if (comp.classes) {
      comp.classes.forEach(c => usedClasses.add(c))
    }
    if (comp.components) {
      comp.components.forEach(collectClasses)
    }
  }
  
  components.forEach(collectClasses)
  
  const cssRules = globalCSS.split('}')
  const unusedStyles: string[] = []
  const purgedRules: string[] = []
  
  cssRules.forEach(rule => {
    if (!rule.trim()) return
    const selector = rule.split('{')[0]?.trim()
    if (!selector) return
    
    const classesInRule = selector.match(/\.([a-zA-Z0-9_-]+)/g) || []
    const isUsed = classesInRule.some(cls => usedClasses.has(cls.replace('.', '')))
    
    if (isUsed || selector.startsWith('@') || selector.includes('body') || selector.includes('html')) {
      purgedRules.push(rule + '}')
    } else {
      unusedStyles.push(rule + '}')
    }
  })
  
  return {
    purgedCSS: purgedRules.join('\n'),
    unusedStyles
  }
}

export function compileJSONToCleanCode(json: ComponentJSON[]): CleanCodeResult {
  const compiled: CompiledComponent[] = []
  const allImports: string[] = []
  const allCSS: string[] = []
  
  json.forEach((component, idx) => {
    const result = compileToNextJS(component)
    compiled.push(result)
    allImports.push(...result.imports)
    if (result.css) allCSS.push(result.css)
  })
  
  const optimizedJSX = compiled
    .map((c, i) => `// Component ${i + 1}: ${c.componentName}\n${c.jsx}`)
    .join('\n\n')
  
  return {
    components: compiled,
    globalCSS: allCSS.join('\n'),
    unusedStyles: [],
    optimizedJSX
  }
}

export function generatePageComponent(
  components: ComponentJSON[],
  pageName = 'ExportedPage'
): string {
  const result = compileJSONToCleanCode(components)
  
  const imports = [...new Set(result.components.flatMap(c => c.imports))]
  const importStr = imports.length > 0 ? imports.join('\n') + '\n' : ''
  
  const componentStr = `export default function ${pageName}() {
  return (
    <main>
      ${result.optimizedJSX.split('\n').join('\n      ')}
    </main>
  )
}`
  
  return `${importStr}${componentStr}`
}
