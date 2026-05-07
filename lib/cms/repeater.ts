interface RepeaterOptions {
  template: string
  data: Record<string, unknown>[]
  containerId: string
  itemKey?: string
}

interface RepeaterResult {
  success: boolean
  renderedItems: number
  error?: string
}

export function renderRepeater(options: RepeaterOptions): RepeaterResult {
  const container = document.getElementById(options.containerId)
  if (!container) {
    return { success: false, renderedItems: 0, error: `Container "${options.containerId}" not found` }
  }

  try {
    container.innerHTML = ''
    
    options.data.forEach((item, index) => {
      let itemHtml = options.template
      
      Object.entries(item).forEach(([key, value]) => {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
        itemHtml = itemHtml.replace(regex, String(value || ''))
      })

      itemHtml = itemHtml.replace(/{{\s*index\s*}}/g, String(index))
      itemHtml = itemHtml.replace(/{{\s*@index\s*}}/g, String(index + 1))

      const wrapper = document.createElement('div')
      wrapper.innerHTML = itemHtml
      wrapper.firstElementChild?.setAttribute('data-repeater-item', String(index))
      container.appendChild(wrapper.firstElementChild!)
    })

    return { success: true, renderedItems: options.data.length }
  } catch (error) {
    return {
      success: false,
      renderedItems: 0,
      error: error instanceof Error ? error.message : 'Render error'
    }
  }
}

export function createLoop(items: Record<string, unknown>[], callback: (item: Record<string, unknown>, index: number) => void): void {
  items.forEach((item, index) => callback(item, index))
}

export function filterRepeaterData(data: Record<string, unknown>[], conditions: Record<string, unknown>): Record<string, unknown>[] {
  return data.filter(item => {
    return Object.entries(conditions).every(([key, value]) => item[key] === value)
  })
}

export function sortRepeaterData(data: Record<string, unknown>[], field: string, order: 'asc' | 'desc' = 'asc'): Record<string, unknown>[] {
  return [...data].sort((a, b) => {
    const aVal = a[field]
    const bVal = b[field]
    const modifier = order === 'asc' ? 1 : -1
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return (aVal - bVal) * modifier
    }
    
    return String(aVal).localeCompare(String(bVal)) * modifier
  })
}

export function paginateRepeaterData(data: Record<string, unknown>[], page: number, pageSize: number): Record<string, unknown>[] {
  const start = (page - 1) * pageSize
  return data.slice(start, start + pageSize)
}

export type { RepeaterOptions, RepeaterResult }
