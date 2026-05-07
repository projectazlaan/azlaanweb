'use client'

import { useState, useEffect } from 'react'
import {
  Eye, EyeOff, Trash2, Copy, GripVertical,
  ChevronRight, Layers as LayersIcon
} from 'lucide-react'
import { useStudioStore } from '../store'
import { usePostMessage } from '../hooks/usePostMessage'

interface LayerItem {
  key: string
  label: string
  type: string
  tagName: string
  visible: boolean
  children?: LayerItem[]
}

interface LayersPanelProps {
  iframeRef: React.RefObject<HTMLIFrameElement | null>
}

function LayerRow({
  item,
  depth = 0,
  selectedKey,
  onSelect,
  onHighlight,
  onToggleVisibility,
  onDelete,
  onDuplicate,
}: {
  item: LayerItem
  depth?: number
  selectedKey: string | null
  onSelect: (key: string, type: string, tagName: string) => void
  onHighlight: (key: string | null) => void
  onToggleVisibility: (key: string, visible: boolean) => void
  onDelete: (key: string) => void
  onDuplicate: (key: string) => void
}) {
  const isSelected = selectedKey === item.key
  const [showActions, setShowActions] = useState(false)
  const [visible, setVisible] = useState(item.visible)

  const TYPE_ICONS: Record<string, string> = {
    section: '⬜', div: '▭', heading: 'H', text: 'T',
    image: '🖼', button: '⬡', unknown: '◻',
  }

  return (
    <div>
      <div
        className={`group flex items-center gap-1.5 px-2 py-1.5 rounded-xl cursor-pointer transition-all mx-1 ${
          isSelected
            ? 'bg-indigo-600/20 border border-indigo-500/30'
            : 'hover:bg-white/5 border border-transparent'
        }`}
        style={{ paddingLeft: `${8 + depth * 14}px` }}
        onClick={() => onSelect(item.key, item.type, item.tagName)}
        onMouseEnter={() => onHighlight(item.key)}
        onMouseLeave={() => onHighlight(null)}
        onMouseOver={() => setShowActions(true)}
        onMouseOut={() => setShowActions(false)}
      >
        <span className="text-[10px] w-5 text-center text-gray-500 flex-shrink-0 font-mono">
          {TYPE_ICONS[item.type] ?? '◻'}
        </span>
        <span className="text-[11px] text-gray-300 flex-1 truncate capitalize leading-none">
          {item.label}
        </span>

        {/* Actions — shown on hover */}
        <div className={`flex items-center gap-0.5 transition-opacity ${showActions || isSelected ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={e => { e.stopPropagation(); setVisible(v => !v); onToggleVisibility(item.key, !visible) }}
            className="p-1 text-gray-600 hover:text-white transition-colors rounded"
            title={visible ? 'Hide' : 'Show'}
          >
            {visible ? <Eye size={11} /> : <EyeOff size={11} />}
          </button>
          <button
            onClick={e => { e.stopPropagation(); onDuplicate(item.key) }}
            className="p-1 text-gray-600 hover:text-white transition-colors rounded"
            title="Duplicate"
          >
            <Copy size={11} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); onDelete(item.key) }}
            className="p-1 text-gray-600 hover:text-red-400 transition-colors rounded"
            title="Delete"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      {/* Children */}
      {item.children?.map(child => (
        <LayerRow
          key={child.key}
          item={child}
          depth={depth + 1}
          selectedKey={selectedKey}
          onSelect={onSelect}
          onHighlight={onHighlight}
          onToggleVisibility={onToggleVisibility}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
        />
      ))}
    </div>
  )
}

export default function LayersPanel({ iframeRef }: LayersPanelProps) {
  const [layers, setLayers] = useState<LayerItem[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const selectedElement = useStudioStore(s => s.selectedElement)
  const setSelectedElement = useStudioStore(s => s.setSelectedElement)
  const { sendMessage, highlightElement, deleteElement, duplicateElement } = usePostMessage(iframeRef)

  // Scan iframe for customizable elements
  const scanLayers = () => {
    setIsScanning(true)
    sendMessage({ type: 'SCAN_ELEMENTS' })
    // Response arrives via postMessage as ELEMENTS_SCANNED
  }

  // Listen for scan results via CustomEvent (dispatched by root useMessageListener)
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      setLayers(detail?.elements ?? [])
      setIsScanning(false)
    }
    window.addEventListener('studio:elements-scanned', handler)
    return () => window.removeEventListener('studio:elements-scanned', handler)
  }, [])

  const handleSelect = (key: string, type: string, tagName: string) => {
    // Scroll element into view in iframe, which will trigger SELECT_COMPONENT back to us
    sendMessage({ type: 'SCROLL_TO_ELEMENT', elementKey: key })
  }

  const handleToggleVisibility = (key: string, visible: boolean) => {
    sendMessage({ type: 'TOGGLE_VISIBILITY', elementKey: key, data: { visible } })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 flex-shrink-0">
        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Layers</span>
        <button
          onClick={scanLayers}
          disabled={isScanning}
          className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold transition-colors disabled:opacity-50"
        >
          {isScanning ? 'Scanning…' : '↻ Refresh'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        {layers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2 text-center px-4">
            <LayersIcon size={20} className="text-gray-700" />
            <p className="text-[11px] text-gray-600">
              Click <span className="text-indigo-400 font-bold">↻ Refresh</span> to scan page elements
            </p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {layers.map(layer => (
              <LayerRow
                key={layer.key}
                item={layer}
                selectedKey={selectedElement?.key ?? null}
                onSelect={handleSelect}
                onHighlight={highlightElement}
                onToggleVisibility={handleToggleVisibility}
                onDelete={key => { deleteElement(key); if (selectedElement?.key === key) setSelectedElement(null) }}
                onDuplicate={key => duplicateElement(key)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
