'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Eye, MousePointer, Loader2, Check, X, ChevronDown } from 'lucide-react'

interface StateStyle {
  transform: string
  opacity: number
  backgroundColor: string
  borderColor: string
  boxShadow: string
  scale: number
}

interface ComponentState {
  id: string
  name: string
  type: 'hover' | 'active' | 'focus' | 'disabled' | 'loading'
  style: StateStyle
}

interface ComponentStates {
  default: StateStyle
  states: ComponentState[]
}

const defaultStyle: StateStyle = {
  transform: '',
  opacity: 1,
  backgroundColor: '#3b82f6',
  borderColor: 'transparent',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  scale: 1
}

const initialStates: ComponentState[] = [
  {
    id: 'hover',
    name: 'Hover',
    type: 'hover',
    style: { ...defaultStyle, backgroundColor: '#2563eb', scale: 1.05 }
  },
  {
    id: 'active',
    name: 'Active',
    type: 'active',
    style: { ...defaultStyle, backgroundColor: '#1d4ed8', scale: 0.95 }
  },
  {
    id: 'focus',
    name: 'Focus',
    type: 'focus',
    style: { ...defaultStyle, borderColor: '#60a5fa', boxShadow: '0 0 0 3px rgba(96, 165, 250, 0.5)' }
  },
  {
    id: 'disabled',
    name: 'Disabled',
    type: 'disabled',
    style: { ...defaultStyle, opacity: 0.5, backgroundColor: '#9ca3af' }
  },
  {
    id: 'loading',
    name: 'Loading',
    type: 'loading',
    style: { ...defaultStyle, opacity: 0.8, backgroundColor: '#3b82f6' }
  }
]

export default function StatefulEditor() {
  const [componentName, setComponentName] = useState('Primary Button')
  const [defaultStyleState, setDefaultStyleState] = useState<StateStyle>(defaultStyle)
  const [states, setStates] = useState<ComponentState[]>(initialStates)
  const [activeState, setActiveState] = useState<string>('default')
  const [previewMode, setPreviewMode] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [focused, setFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const currentStyle = activeState === 'default' 
    ? defaultStyleState 
    : states.find(s => s.id === activeState)?.style || defaultStyleState

  const updateDefaultStyle = (updates: Partial<StateStyle>) => {
    setDefaultStyleState(prev => ({ ...prev, ...updates }))
  }

  const updateStateStyle = (stateId: string, updates: Partial<StateStyle>) => {
    setStates(states.map(s => s.id === stateId ? { 
      ...s, 
      style: { ...s.style, ...updates } 
    } : s))
  }

  const toggleState = (stateId: string, enabled: boolean) => {
    if (enabled) {
      setStates(states.filter(s => s.id !== stateId))
    } else {
      const original = initialStates.find(s => s.id === stateId)
      if (original) {
        setStates([...states, original])
      }
    }
  }

  const getPreviewState = () => {
    if (isLoading) return 'loading'
    if (clicked) return 'active'
    if (hovered) return 'hover'
    if (focused) return 'focus'
    return 'default'
  }

  const renderPreview = () => {
    if (!previewMode) return null

    const previewStyle = states.find(s => s.id === getPreviewState())?.style || defaultStyleState

    return (
      <div className="h-40 bg-gray-800 rounded-lg flex items-center justify-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <motion.button
            className="px-6 py-3 rounded-lg text-white font-medium text-sm relative overflow-hidden"
            style={{
              backgroundColor: previewStyle.backgroundColor,
              borderColor: previewStyle.borderColor,
              boxShadow: previewStyle.boxShadow,
              opacity: previewStyle.opacity,
            }}
            whileHover={{ scale: isLoading ? 1 : (states.find(s => s.id === 'hover')?.style.scale || 1) }}
            whileTap={{ scale: clicked ? (states.find(s => s.id === 'active')?.style.scale || 0.95) : 1 }}
            onMouseEnter={() => !isLoading && setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onMouseDown={() => !isLoading && setClicked(true)}
            onMouseUp={() => setClicked(false)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <Loader2 size={18} />
              </motion.div>
            ) : (
              'Preview Button'
            )}
          </motion.button>
          <div className="flex gap-1">
            {['hover', 'active', 'focus', 'loading'].map(s => (
              <button
                key={s}
                onClick={() => {
                  if (s === 'loading') setIsLoading(!isLoading)
                  else if (s === 'hover') setHovered(!hovered)
                  else if (s === 'active') setClicked(!clicked)
                  else if (s === 'focus') setFocused(!focused)
                }}
                className={`text-xs px-2 py-1 rounded ${
                  getPreviewState() === s ? 'bg-indigo-600' : 'bg-gray-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 rounded-xl p-4 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Stateful Component</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`p-2 rounded-lg transition-colors ${
              previewMode ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <Eye size={16} />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-xs text-gray-400 mb-1 block">Component Name</label>
        <input
          type="text"
          value={componentName}
          onChange={(e) => setComponentName(e.target.value)}
          className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm border border-gray-700"
        />
      </div>

      <div className="flex gap-2 mb-4">
        {['default', ...states.map(s => s.id)].map(state => (
          <button
            key={state}
            onClick={() => setActiveState(state)}
            className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
              activeState === state 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {state.charAt(0).toUpperCase() + state.slice(1)}
          </button>
        ))}
      </div>

      {previewMode && renderPreview()}

      {activeState !== 'default' && (
        <div className="flex items-center gap-2 mb-3 p-2 bg-gray-800 rounded-lg">
          <input
            type="checkbox"
            checked={states.some(s => s.id === activeState)}
            onChange={(e) => toggleState(activeState, !e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm">Enable {activeState} state</span>
        </div>
      )}

      <div className="space-y-3">
        <div className="text-xs text-gray-400 mb-2">
          {activeState === 'default' ? 'Default Style' : `${activeState.charAt(0).toUpperCase() + activeState.slice(1)} State Style`}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Background</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={currentStyle.backgroundColor}
                onChange={(e) => {
                  if (activeState === 'default') {
                    updateDefaultStyle({ backgroundColor: e.target.value })
                  } else {
                    updateStateStyle(activeState, { backgroundColor: e.target.value })
                  }
                }}
                className="w-8 h-8 rounded cursor-pointer"
              />
              <input
                type="text"
                value={currentStyle.backgroundColor}
                onChange={(e) => {
                  if (activeState === 'default') {
                    updateDefaultStyle({ backgroundColor: e.target.value })
                  } else {
                    updateStateStyle(activeState, { backgroundColor: e.target.value })
                  }
                }}
                className="flex-1 bg-gray-800 rounded px-2 py-1 text-xs border border-gray-700"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Border Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={currentStyle.borderColor}
                onChange={(e) => {
                  if (activeState === 'default') {
                    updateDefaultStyle({ borderColor: e.target.value })
                  } else {
                    updateStateStyle(activeState, { borderColor: e.target.value })
                  }
                }}
                className="w-8 h-8 rounded cursor-pointer"
              />
              <input
                type="text"
                value={currentStyle.borderColor}
                onChange={(e) => {
                  if (activeState === 'default') {
                    updateDefaultStyle({ borderColor: e.target.value })
                  } else {
                    updateStateStyle(activeState, { borderColor: e.target.value })
                  }
                }}
                className="flex-1 bg-gray-800 rounded px-2 py-1 text-xs border border-gray-700"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Scale</label>
            <input
              type="number"
              step="0.05"
              value={currentStyle.scale}
              onChange={(e) => {
                if (activeState === 'default') {
                  updateDefaultStyle({ scale: parseFloat(e.target.value) || 1 })
                } else {
                  updateStateStyle(activeState, { scale: parseFloat(e.target.value) || 1 })
                }
              }}
              className="w-full bg-gray-800 rounded px-2 py-1.5 text-xs border border-gray-700"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Opacity</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="1"
              value={currentStyle.opacity}
              onChange={(e) => {
                if (activeState === 'default') {
                  updateDefaultStyle({ opacity: parseFloat(e.target.value) || 1 })
                } else {
                  updateStateStyle(activeState, { opacity: parseFloat(e.target.value) || 1 })
                }
              }}
              className="w-full bg-gray-800 rounded px-2 py-1.5 text-xs border border-gray-700"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-1 block">Box Shadow</label>
          <input
            type="text"
            value={currentStyle.boxShadow}
            onChange={(e) => {
              if (activeState === 'default') {
                updateDefaultStyle({ boxShadow: e.target.value })
              } else {
                updateStateStyle(activeState, { boxShadow: e.target.value })
              }
            }}
            className="w-full bg-gray-800 rounded px-3 py-2 text-xs border border-gray-700"
            placeholder="0 4px 6px rgba(0,0,0,0.1)"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-1 block">Transform</label>
          <input
            type="text"
            value={currentStyle.transform}
            onChange={(e) => {
              if (activeState === 'default') {
                updateDefaultStyle({ transform: e.target.value })
              } else {
                updateStateStyle(activeState, { transform: e.target.value })
              }
            }}
            className="w-full bg-gray-800 rounded px-3 py-2 text-xs border border-gray-700"
            placeholder="rotate(5deg)"
          />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-700">
        <div className="text-xs text-gray-400 mb-2">All States Overview</div>
        <div className="flex gap-2 flex-wrap">
          <div className="px-2 py-1 bg-gray-800 rounded text-xs">
            <span className="text-gray-500">Default:</span> 
            <span className="ml-1" style={{ color: defaultStyleState.backgroundColor }}>●</span>
          </div>
          {states.map(s => (
            <div key={s.id} className="px-2 py-1 bg-gray-800 rounded text-xs">
              <span className="text-gray-500">{s.name}:</span> 
              <span className="ml-1" style={{ color: s.style.backgroundColor }}>●</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}