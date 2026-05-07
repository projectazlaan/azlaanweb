import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { useShallow } from 'zustand/react/shallow'
import toast from 'react-hot-toast'
import type {
  CanvasSlice,
  GallerySlice,
  HistorySlice,
  CanvasSettings,
  SelectedElement,
  DeviceMode,
  GalleryImage,
  GalleryFilters,
  GalleryViewMode,
  HistoryEntry,
  AISettings,
} from '../types'

interface SaveSlice {
  showSaveSuccess: boolean
  setShowSaveSuccess: (v: boolean) => void
  aiOpen: boolean
  setAiOpen: (v: boolean) => void
}

// ─── Default Settings ──────────────────────────────────────────

const defaultSettings: CanvasSettings = {
  colors: {
    primary: '#1a1a2e',
    secondary: '#e94560',
    background: '#0a0a0a',
    text: '#1a1a1a',
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    headingFont: 'Inter, sans-serif',
    baseFontSize: '16px',
  },
  sections: {
    order: [],
    visibility: {},
    locked: {},
  },
  customStyles: {},
  ai: {
    provider: 'gemini',
    model: 'gemini-2.0-flash',
    apiKeys: {},
  }
}

const MAX_HISTORY = 50

// ─── Full Combined Store ───────────────────────────────────────

type StudioStore = CanvasSlice & GallerySlice & HistorySlice & SaveSlice

export const useStudioStore = create<StudioStore>()(
  immer((set, get) => ({
    // ── Canvas ──────────────────────────────────────────────────
    deviceMode: 'desktop' as DeviceMode,
    setDeviceMode: (mode: DeviceMode) => 
      set((state) => { state.deviceMode = mode }),

    canvasUrl: typeof window !== 'undefined' ? `${window.location.origin}` : 'http://localhost:3000',
    urlHistory: [] as string[],
    setCanvasUrl: (url: string) =>
      set((state) => { 
        state.canvasUrl = url 
        if (url && !state.urlHistory.includes(url)) {
          state.urlHistory.unshift(url)
          state.urlHistory = state.urlHistory.slice(0, 10) // keep last 10
        }
      }),

    selectedElement: null,
    setSelectedElement: (el: SelectedElement | null) => 
      set((state) => { state.selectedElement = el as any }),

    settings: defaultSettings,
    updateSettings: (partial: Partial<CanvasSettings>) =>
      set((state) => {
        if (partial.colors) state.settings.colors = { ...state.settings.colors, ...partial.colors }
        if (partial.typography) state.settings.typography = { ...state.settings.typography, ...partial.typography }
        if (partial.sections) state.settings.sections = { ...state.settings.sections, ...partial.sections }
        if (partial.customStyles) state.settings.customStyles = { ...state.settings.customStyles, ...partial.customStyles }
        if (partial.ai) state.settings.ai = { ...state.settings.ai, ...partial.ai }
      }),

    updateElementStyle: (key: string, styles: Record<string, string>) =>
      set((state) => {
        if (!state.settings.customStyles[key]) {
          state.settings.customStyles[key] = {}
        }
        state.settings.customStyles[key] = {
          ...state.settings.customStyles[key],
          ...styles,
        }
      }),

    isSaving: false,
    lastSaved: null,
    setIsSaving: (v: boolean) => set((state) => { state.isSaving = v }),
    setLastSaved: (d: Date) => set((state) => { state.lastSaved = d }),

    showSaveSuccess: false,
    setShowSaveSuccess: (v: boolean) => set((state) => { state.showSaveSuccess = v }),
    aiOpen: false,
    setAiOpen: (v: boolean) => set((state) => { state.aiOpen = v }),

    saveToServer: async (pageKey = 'homepage') => {
      const { settings, setIsSaving, setLastSaved, setShowSaveSuccess } = get()
      setIsSaving(true)
      
      const savePromise = fetch('/api/studio-pro/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageKey,
          settings: {
            customStyles: settings.customStyles,
            colors: settings.colors,
            typography: settings.typography,
            sections: settings.sections,
            ai: settings.ai
          }
        }),
      })

      toast.promise(savePromise, {
        loading: 'Saving design...',
        success: () => {
          setLastSaved(new Date())
          setIsSaving(false)
          setShowSaveSuccess(true)
          return 'Design saved successfully!'
        },
        error: (err) => {
          setIsSaving(false)
          return `Save failed: ${err.message || 'Unknown error'}`
        },
      })
      
      await savePromise
    },

    // ── Gallery ─────────────────────────────────────────────────
    images: [],
    isOpen: false,
    isLoading: false,
    filters: { tags: [], favorites: false, searchQuery: '' },
    viewMode: 'grid' as GalleryViewMode,
    onSelectCallback: null,

    openGallery: (onSelect?: (url: string) => void) => {
      set((state) => {
        state.isOpen = true
        state.onSelectCallback = onSelect ?? null
      })
      get().loadImages()
    },
    closeGallery: () => 
      set((state) => {
        state.isOpen = false
        state.onSelectCallback = null
      }),

    loadImages: async () => {
      set((state) => { state.isLoading = true })
      try {
        const res = await fetch('/api/studio-pro/gallery')
        const data = await res.json()
        set((state) => { state.images = data.images ?? [] })
      } catch { /* silent */ }
      finally { 
        set((state) => { state.isLoading = false })
      }
    },

    uploadImages: async (files: File[]) => {
      const formData = new FormData()
      files.forEach(f => formData.append('files', f))
      set((state) => { state.isLoading = true })
      try {
        await fetch('/api/studio-pro/gallery/upload', { method: 'POST', body: formData })
        await get().loadImages()
      } finally { 
        set((state) => { state.isLoading = false })
      }
    },

    deleteImage: async (id: string) => {
      await fetch('/api/studio-pro/gallery/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      set((state) => {
        state.images = state.images.filter((img) => img.id !== id)
      })
    },

    toggleFavorite: async (id: string) => {
      let updatedFavorite = false
      set((state) => {
        const img = state.images.find(i => i.id === id)
        if (img) {
          img.favorite = !img.favorite
          updatedFavorite = img.favorite
        }
      })
      try {
        const img = get().images.find(i => i.id === id)
        if (img) {
          await fetch('/api/studio-pro/gallery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: img.id, tags: img.tags, favorite: updatedFavorite })
          })
        }
      } catch { /* silent */ }
    },

    setFilters: (filters: Partial<GalleryFilters>) =>
      set((state) => {
        state.filters = { ...state.filters, ...filters }
      }),

    setViewMode: (mode: GalleryViewMode) => 
      set((state) => { state.viewMode = mode }),

    // ── History ─────────────────────────────────────────────────
    past: [],
    future: [],
    canUndo: false,
    canRedo: false,

    pushHistory: (label: string, settings: CanvasSettings) => {
      const entry: HistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        timestamp: Date.now(),
        label,
        settings: JSON.parse(JSON.stringify(settings)),
      }
      set((state) => {
        state.past.push(entry)
        if (state.past.length > MAX_HISTORY) state.past.shift()
        state.future = []
        state.canUndo = state.past.length > 0
        state.canRedo = false
      })
    },

    undo: () => {
      let restoredSettings: CanvasSettings | null = null
      
      set((state) => {
        if (state.past.length === 0) return
        
        // Save current state to future
        const currentEntry: HistoryEntry = {
          id: `f-${Date.now()}`,
          timestamp: Date.now(),
          label: 'Undo',
          settings: JSON.parse(JSON.stringify(state.settings)),
        }
        state.future.unshift(currentEntry)
        
        // Pop from past and restore
        const prev = state.past.pop()!
        state.settings = JSON.parse(JSON.stringify(prev.settings))
        
        state.canUndo = state.past.length > 0
        state.canRedo = state.future.length > 0
        restoredSettings = state.settings
      })
      
      return restoredSettings
    },

    redo: () => {
      let restoredSettings: CanvasSettings | null = null
      
      set((state) => {
        if (state.future.length === 0) return
        
        // Save current state to past
        const currentEntry: HistoryEntry = {
          id: `p-${Date.now()}`,
          timestamp: Date.now(),
          label: 'Redo',
          settings: JSON.parse(JSON.stringify(state.settings)),
        }
        state.past.push(currentEntry)
        
        // Shift from future and restore
        const next = state.future.shift()!
        state.settings = JSON.parse(JSON.stringify(next.settings))
        
        state.canUndo = state.past.length > 0
        state.canRedo = state.future.length > 0
        restoredSettings = state.settings
      })
      
      return restoredSettings
    },
  }))
)

// ─── Convenience Selectors ─────────────────────────────────────

export const useSelectedElement = () => useStudioStore(s => s.selectedElement)
export const useDeviceMode = () => useStudioStore(s => s.deviceMode)
export const useCanvasSettings = () => useStudioStore(s => s.settings)

export const useGallery = () =>
  useStudioStore(useShallow(s => ({
    images: s.images,
    isOpen: s.isOpen,
    isLoading: s.isLoading,
    filters: s.filters,
    viewMode: s.viewMode,
    onSelectCallback: s.onSelectCallback,
    openGallery: s.openGallery,
    closeGallery: s.closeGallery,
    loadImages: s.loadImages,
    uploadImages: s.uploadImages,
    deleteImage: s.deleteImage,
    toggleFavorite: s.toggleFavorite,
    setFilters: s.setFilters,
    setViewMode: s.setViewMode,
  })))

export const useHistory = () =>
  useStudioStore(useShallow(s => ({
    canUndo: s.canUndo,
    canRedo: s.canRedo,
    pushHistory: s.pushHistory,
    undo: s.undo,
    redo: s.redo,
  })))
