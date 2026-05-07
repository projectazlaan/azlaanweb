interface BindingOptions {
  elementId: string
  field: string
  collectionSlug: string
  displayProperty?: string
}

interface BindingResult {
  success: boolean
  element?: HTMLElement
  error?: string
}

const bindings: Map<string, BindingOptions> = new Map()

export function bindData(elementId: string, field: string, collectionSlug: string, displayProperty?: string): BindingResult {
  const element = document.getElementById(elementId)
  if (!element) {
    return { success: false, error: `Element with id "${elementId}" not found` }
  }

  const binding: BindingOptions = { elementId, field, collectionSlug, displayProperty }
  bindings.set(elementId, binding)

  return { success: true, element }
}

export function unbindData(elementId: string): boolean {
  return bindings.delete(elementId)
}

export function getBindings(): BindingOptions[] {
  return Array.from(bindings.values())
}

export function updateBoundData(collectionSlug: string, items: Record<string, unknown>[]): void {
  bindings.forEach((binding, elementId) => {
    if (binding.collectionSlug !== collectionSlug) return

    const element = document.getElementById(elementId)
    if (!element) return

    const item = items[0] // For simplicity, bind to first item
    if (!item) return

    const value = binding.field.split('.').reduce<unknown>((obj, key) => (obj as Record<string, unknown>)?.[key], item as unknown)
    
    if (element.tagName === 'IMG' && binding.field.includes('image')) {
      (element as HTMLImageElement).src = value as string
    } else {
      element.textContent = String(value || '')
    }
  })
}

export interface DragBindingOptions {
  sourceField: string
  targetElementId: string
  collectionSlug: string
}

export function createDragBinding(options: DragBindingOptions): void {
  const targetElement = document.getElementById(options.targetElementId)
  if (!targetElement) return

  targetElement.addEventListener('dragover', (e) => {
    e.preventDefault()
    targetElement.classList.add('drag-over')
  })

  targetElement.addEventListener('dragleave', () => {
    targetElement.classList.remove('drag-over')
  })

  targetElement.addEventListener('drop', (e) => {
    e.preventDefault()
    targetElement.classList.remove('drag-over')
    
    const fieldData = e.dataTransfer?.getData('text/plain')
    if (fieldData) {
      bindData(options.targetElementId, options.sourceField, options.collectionSlug)
    }
  })
}

export type { BindingOptions, BindingResult }
