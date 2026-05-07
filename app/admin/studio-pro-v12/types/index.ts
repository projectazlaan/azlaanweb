// ============================================================
// Studio Pro V12 — Master TypeScript Type Definitions
// ============================================================

export type DeviceMode = 'desktop' | 'tablet' | 'mobile'

export type ElementType =
  | 'text'
  | 'heading'
  | 'image'
  | 'button'
  | 'section'
  | 'div'
  | 'link'
  | 'video'
  | 'unknown'

// ─── PostMessage Bridge ────────────────────────────────────────

export type PostMessageType =
  | 'SELECT_COMPONENT'
  | 'UPDATE_STYLE'
  | 'UPDATE_CONTENT'
  | 'UPDATE_ATTRIBUTE'
  | 'DELETE_ELEMENT'
  | 'DUPLICATE_ELEMENT'
  | 'REORDER_COMPONENT'
  | 'TOGGLE_VISIBILITY'
  | 'HIGHLIGHT_ELEMENT'
  | 'CLEAR_SELECTION'
  | 'SCAN_ELEMENTS'
  | 'ELEMENTS_SCANNED'
  | 'INJECT_BLOCK'
  | 'SCROLL_TO_ELEMENT'
  | 'UPDATE_THEME'
  | 'PING'
  | 'PONG'

export interface PostMessagePayload {
  type: PostMessageType
  elementKey?: string
  data?: Record<string, unknown>
}

// ─── Selected Element ──────────────────────────────────────────

export interface SelectedElement {
  key: string
  type: ElementType
  tagName: string
  textContent?: string
  src?: string
  alt?: string
  href?: string
  computedStyles: Record<string, string>
  rect?: { top: number; left: number; width: number; height: number }
  dataAttributes: Record<string, string>
}

// ─── Canvas / Settings ────────────────────────────────────────

export interface SectionSettings {
  order: string[]
  visibility: Record<string, boolean>
  locked: Record<string, boolean>
}

export interface AISettings {
  provider: 'gemini' | 'openai' | 'anthropic' | 'openrouter' | 'custom'
  model: string
  apiKeys: Record<string, string>
  customEndpoint?: string
}

export interface CanvasSettings {
  colors: {
    primary: string
    secondary: string
    background: string
    text: string
  }
  typography: {
    fontFamily: string
    headingFont: string
    baseFontSize: string
  }
  sections: SectionSettings
  customStyles: Record<string, Record<string, string>>
  ai: AISettings
}

// ─── History (Undo/Redo) ──────────────────────────────────────

export interface HistoryEntry {
  id: string
  timestamp: number
  label: string
  settings: CanvasSettings
}

// ─── Gallery ──────────────────────────────────────────────────

export interface GalleryImage {
  id: string
  url: string
  filename: string
  size: number
  mimeType: string
  width?: number
  height?: number
  altText?: string
  tags: string[]
  favorite: boolean
  createdAt: string
}

export type GalleryViewMode = 'grid' | 'list'

export interface GalleryFilters {
  tags: string[]
  favorites: boolean
  searchQuery: string
}

// ─── Blocks ───────────────────────────────────────────────────

export type BlockCategory =
  | 'layout'
  | 'text'
  | 'media'
  | 'interactive'
  | 'ecommerce'

export interface BlockDefinition {
  id: string
  name: string
  category: BlockCategory
  icon: string           // emoji or icon name
  description: string
  defaultHtml: string    // HTML snippet to inject
  preview?: string       // thumbnail URL
}

// ─── Store Slices ─────────────────────────────────────────────

export interface CanvasSlice {
  deviceMode: DeviceMode
  setDeviceMode: (mode: DeviceMode) => void

  canvasUrl: string
  urlHistory: string[]
  setCanvasUrl: (url: string) => void

  selectedElement: SelectedElement | null
  setSelectedElement: (el: SelectedElement | null) => void

  settings: CanvasSettings
  updateSettings: (partial: Partial<CanvasSettings>) => void
  updateElementStyle: (key: string, styles: Record<string, string>) => void

  isSaving: boolean
  lastSaved: Date | null
  setIsSaving: (v: boolean) => void
  setLastSaved: (d: Date) => void
  saveToServer: (pageKey?: string) => Promise<void>
}

export interface GallerySlice {
  images: GalleryImage[]
  isOpen: boolean
  isLoading: boolean
  filters: GalleryFilters
  viewMode: GalleryViewMode
  onSelectCallback: ((url: string) => void) | null

  openGallery: (onSelect?: (url: string) => void) => void
  closeGallery: () => void
  loadImages: () => Promise<void>
  uploadImages: (files: File[]) => Promise<void>
  deleteImage: (id: string) => Promise<void>
  toggleFavorite: (id: string) => void
  setFilters: (filters: Partial<GalleryFilters>) => void
  setViewMode: (mode: GalleryViewMode) => void
}

export interface HistorySlice {
  past: HistoryEntry[]
  future: HistoryEntry[]
  canUndo: boolean
  canRedo: boolean

  pushHistory: (label: string, settings: CanvasSettings) => void
  undo: () => CanvasSettings | null
  redo: () => CanvasSettings | null
}
