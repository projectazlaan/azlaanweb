'use client'

import { useState, useCallback, useRef } from 'react'
import Cropper from 'react-easy-crop'
import { 
  Crop, RotateCcw, RotateCw, FlipHorizontal, FlipVertical, 
  Sun, Contrast, Droplets, Palette, Download, Check, X, Undo
} from 'lucide-react'

interface ImageEditorProps {
  imageSrc: string
  onSave: (editedImage: string) => void
  onCancel: () => void
}

type FilterType = 'brightness' | 'contrast' | 'saturation' | 'grayscale' | 'sepia' | 'blur'

interface FilterSettings {
  brightness: number
  contrast: number
  saturation: number
  grayscale: number
  sepia: number
  blur: number
}

const defaultFilters: FilterSettings = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  grayscale: 0,
  sepia: 0,
  blur: 0
}

export function ImageEditor({ imageSrc, onSave, onCancel }: ImageEditorProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [aspect, setAspect] = useState(4 / 3)
  const [mode, setMode] = useState<'crop' | 'filters'>('crop')
  const [filters, setFilters] = useState<FilterSettings>(defaultFilters)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number; y: number; width: number; height: number } | null>(null)
  const [history, setHistory] = useState<FilterSettings[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const onCropComplete = useCallback((croppedArea: { x: number; y: number }, croppedAreaPixelsParam: { x: number; y: number; width: number; height: number }) => {
    setCroppedAreaPixels(croppedAreaPixelsParam)
  }, [])

  const updateFilter = (filter: FilterType, value: number) => {
    setHistory(prev => [...prev, filters])
    setFilters(prev => ({ ...prev, [filter]: value }))
  }

  const resetFilters = () => {
    setHistory(prev => [...prev, filters])
    setFilters(defaultFilters)
  }

  const undo = () => {
    if (history.length > 0) {
      const previous = history[history.length - 1]
      setFilters(previous)
      setHistory(prev => prev.slice(0, -1))
    }
  }

  const getFilterStyle = () => ({
    filter: `
      brightness(${filters.brightness}%) 
      contrast(${filters.contrast}%) 
      saturate(${filters.saturation}%) 
      grayscale(${filters.grayscale}%) 
      sepia(${filters.sepia}%) 
      blur(${filters.blur}px)
    `
  })

  const createCroppedImage = async () => {
    if (!croppedAreaPixels) return

    const image = new Image()
    image.src = imageSrc
    await new Promise(resolve => { image.onload = resolve })

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rotRad = (rotation * Math.PI) / 180
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
      image.width,
      image.height,
      rotation
    )

    canvas.width = bBoxWidth
    canvas.height = bBoxHeight

    ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
    ctx.rotate(rotRad)
    ctx.translate(-image.width / 2, -image.height / 2)

    ctx.filter = `
      brightness(${filters.brightness}%) 
      contrast(${filters.contrast}%) 
      saturate(${filters.saturation}%) 
      grayscale(${filters.grayscale}%) 
      sepia(${filters.sepia}%) 
      blur(${filters.blur}px)
    `

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    )

    const base64 = canvas.toDataURL('image/jpeg', 0.9)
    onSave(base64)
  }

  const rotateSize = (width: number, height: number, rotation: number) => {
    const rotRad = (rotation * Math.PI) / 180
    return {
      width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
      height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height)
    }
  }

  const rotateLeft = () => setRotation(prev => prev - 90)
  const rotateRight = () => setRotation(prev => prev + 90)
  const flipH = () => setRotation(prev => prev + 180)
  const flipV = () => setRotation(prev => prev + 180)

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden border border-gray-700 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div>
            <h2 className="text-lg font-semibold text-white">Image Editor</h2>
            <p className="text-xs text-gray-400">Crop and apply filters</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setMode('crop')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                mode === 'crop' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Crop size={16} className="inline mr-1" />
              Crop
            </button>
            <button
              onClick={() => setMode('filters')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                mode === 'filters' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Palette size={16} className="inline mr-1" />
              Filters
            </button>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 relative bg-gray-950">
          <div className="absolute inset-4">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              rotation={rotation}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              style={{
                containerStyle: { background: '#0f0f0f' },
                mediaStyle: getFilterStyle()
              }}
            />
          </div>
        </div>

        <div className="p-4 border-t border-gray-800">
          {mode === 'crop' && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <button onClick={rotateLeft} className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors" title="Rotate Left">
                  <RotateCcw size={18} className="text-white" />
                </button>
                <button onClick={rotateRight} className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors" title="Rotate Right">
                  <RotateCw size={18} className="text-white" />
                </button>
                <div className="w-px bg-gray-700 mx-2" />
                {[1, 4/3, 16/9, 3/2].map((a, i) => (
                  <button
                    key={i}
                    onClick={() => setAspect(a)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      aspect === a ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    {a === 1 ? '1:1' : a === 4/3 ? '4:3' : a === 16/9 ? '16:9' : '3:2'}
                  </button>
                ))}
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-2 block">Zoom: {Math.round(zoom * 100)}%</label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={e => setZoom(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>
          )}

          {mode === 'filters' && (
            <div className="space-y-4">
              <div className="flex gap-2 mb-3">
                <button
                  onClick={undo}
                  disabled={history.length === 0}
                  className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                  title="Undo"
                >
                  <Undo size={18} className="text-white" />
                </button>
                <button
                  onClick={resetFilters}
                  className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  title="Reset"
                >
                  <X size={18} className="text-white" />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <FilterSlider
                  icon={<Sun size={16} />}
                  label="Brightness"
                  value={filters.brightness}
                  min={0}
                  max={200}
                  onChange={v => updateFilter('brightness', v)}
                />
                <FilterSlider
                  icon={<Contrast size={16} />}
                  label="Contrast"
                  value={filters.contrast}
                  min={0}
                  max={200}
                  onChange={v => updateFilter('contrast', v)}
                />
                <FilterSlider
                  icon={<Droplets size={16} />}
                  label="Saturation"
                  value={filters.saturation}
                  min={0}
                  max={200}
                  onChange={v => updateFilter('saturation', v)}
                />
                <FilterSlider
                  icon={<Palette size={16} />}
                  label="Grayscale"
                  value={filters.grayscale}
                  min={0}
                  max={100}
                  onChange={v => updateFilter('grayscale', v)}
                />
                <FilterSlider
                  icon={<Sun size={16} />}
                  label="Sepia"
                  value={filters.sepia}
                  min={0}
                  max={100}
                  onChange={v => updateFilter('sepia', v)}
                />
                <FilterSlider
                  icon={<Contrast size={16} />}
                  label="Blur"
                  value={filters.blur}
                  min={0}
                  max={10}
                  onChange={v => updateFilter('blur', v)}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-4 border-t border-gray-800">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={createCroppedImage}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Download size={16} />
            Save Image
          </button>
        </div>
      </div>
    </div>
  )
}

function FilterSlider({ 
  icon, 
  label, 
  value, 
  min, 
  max, 
  onChange 
}: { 
  icon: React.ReactNode
  label: string
  value: number
  min: number
  max: number
  onChange: (v: number) => void
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-gray-400">{icon}</span>
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-xs text-white ml-auto">{Math.round(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-indigo-500"
      />
    </div>
  )
}