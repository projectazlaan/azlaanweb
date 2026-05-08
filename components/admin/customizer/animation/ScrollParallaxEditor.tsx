'use client'
import { useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Plus, Trash2, Eye, EyeOff, Settings, ChevronDown, ArrowUp, ArrowDown, Move } from 'lucide-react'
interface ScrollTrigger {
  id: string
  name: string
  triggerType: 'scroll' | 'viewport' | 'element'
  startPosition: number
  endPosition: number
  animation: {
    type: 'parallax' | 'fade' | 'slide' | 'scale' | 'rotate'
    direction?: 'up' | 'down' | 'left' | 'right'
    intensity: number
    startOpacity: number
    endOpacity: number
    startScale: number
    endScale: number
  }
  enabled: boolean
}
const animationTypes = [
  { value: 'parallax', label: 'Parallax' },
  { value: 'fade', label: 'Fade' },
  { value: 'slide', label: 'Slide' },
  { value: 'scale', label: 'Scale' },
  { value: 'rotate', label: 'Rotate' }
]
const directions = [
  { value: 'up', label: '↑ Up' },
  { value: 'down', label: '↓ Down' },
  { value: 'left', label: '← Left' },
  { value: 'right', label: '→ Right' }
]
export default function ScrollParallaxEditor() {
  const [triggers, setTriggers] = useState<ScrollTrigger[]>([
    {
      id: '1',
      name: 'Hero Parallax',
      triggerType: 'viewport',
      startPosition: 0,
      endPosition: 100,
      animation: {
        type: 'parallax',
        direction: 'down',
        intensity: 50,
        startOpacity: 1,
        endOpacity: 1,
        startScale: 1,
        endScale: 1
      },
      enabled: true
    }
  ])
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>('1')
  const [previewMode, setPreviewMode] = useState(false)
  const activeTrigger = triggers.find(t => t.id === selectedTrigger)
  const addTrigger = () => {
    const newTrigger: ScrollTrigger = {
      id: Date.now().toString(),
      name: `Trigger ${triggers.length + 1}`,
      triggerType: 'scroll',
      startPosition: 0,
      endPosition: 100,
      animation: {
        type: 'fade',
        direction: 'up',
        intensity: 30,
        startOpacity: 0,
        endOpacity: 1,
        startScale: 0.8,
        endScale: 1
      },
      enabled: true
    }
    setTriggers([...triggers, newTrigger])
    setSelectedTrigger(newTrigger.id)
  }
  const updateTrigger = (id: string, updates: Partial<ScrollTrigger>) => {
    setTriggers(triggers.map(t => t.id === id ? { ...t, ...updates } : t))
  }
  const updateAnimation = (id: string, animationUpdates: Partial<ScrollTrigger['animation']>) => {
    setTriggers(triggers.map(t => 
      t.id === id ? { ...t, animation: { ...t.animation, ...animationUpdates } } : t
    ))
  }
  const deleteTrigger = (id: string) => {
    setTriggers(triggers.filter(t => t.id !== id))
    if (selectedTrigger === id) setSelectedTrigger(null)
  }
  const renderPreview = () => {
    if (!activeTrigger || !previewMode) return null
    const { animation } = activeTrigger
    return (
      <div className="h-64 bg-gray-800 rounded-lg overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-700 to-gray-600" />
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            y: animation.type === 'parallax' ? animation.direction === 'down' ? 50 : -50 : 0,
          }}
          initial={{ opacity: animation.startOpacity, scale: animation.startScale }}
          whileInView={{ 
            opacity: animation.endOpacity,
            scale: animation.endScale,
            y: animation.type === 'slide' 
              ? animation.direction === 'up' ? -30 
              : animation.direction === 'down' ? 30 
              : animation.direction === 'left' ? -30 
              : 30
              : 0,
            rotate: animation.type === 'rotate' ? 15 : 0
          }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-24 h-24 bg-indigo-500 rounded-xl flex items-center justify-center shadow-xl">
            <span className="text-white text-xs">Target</span>
          </div>
        </motion.div>
        <div className="absolute bottom-2 left-2 text-xs text-gray-500">
          Preview: {animation.type} ({animation.direction})
        </div>
      </div>
    )
  }
  return (
    <div className="bg-gray-900 rounded-xl p-4 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Scroll & Parallax</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`p-2 rounded-lg transition-colors ${
              previewMode ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <Eye size={16} />
          </button>
          <button
            onClick={addTrigger}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
      <div className="flex gap-4 mb-4">
        <div className="w-48">
          <label className="text-xs text-gray-400 mb-1 block">Trigger</label>
          <select
            value={selectedTrigger || ''}
            onChange={(e) => setSelectedTrigger(e.target.value)}
            className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm border border-gray-700"
          >
            <option value="">Select trigger</option>
            {triggers.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        <div className="w-32">
          <label className="text-xs text-gray-400 mb-1 block">Type</label>
          <select
            value={activeTrigger?.triggerType || 'scroll'}
            onChange={(e) => updateTrigger(selectedTrigger!, { 
              triggerType: e.target.value as 'scroll' | 'viewport' | 'element' 
            })}
            className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm border border-gray-700"
          >
            <option value="scroll">Scroll</option>
            <option value="viewport">Viewport</option>
            <option value="element">Element</option>
          </select>
        </div>
        <div className="flex items-center pt-5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={activeTrigger?.enabled ?? true}
              onChange={(e) => updateTrigger(selectedTrigger!, { enabled: e.target.checked })}
              className="w-4 h-4 rounded bg-gray-800 border-gray-600"
            />
            <span className="text-sm">Enabled</span>
          </label>
        </div>
      </div>
      {previewMode && renderPreview()}
      {activeTrigger && (
        <>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Start Position (%)</label>
              <input
                type="number"
                value={activeTrigger.startPosition}
                onChange={(e) => updateTrigger(selectedTrigger!, { 
                  startPosition: parseInt(e.target.value) || 0 
                })}
                className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm border border-gray-700"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">End Position (%)</label>
              <input
                type="number"
                value={activeTrigger.endPosition}
                onChange={(e) => updateTrigger(selectedTrigger!, { 
                  endPosition: parseInt(e.target.value) || 100 
                })}
                className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm border border-gray-700"
              />
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3 mb-3">
            <h4 className="text-xs font-medium text-gray-300 mb-3">Animation Settings</h4>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Type</label>
                <select
                  value={activeTrigger.animation.type}
                  onChange={(e) => updateAnimation(selectedTrigger!, { 
                    type: e.target.value as any 
                  })}
                  className="w-full bg-gray-900 rounded-lg px-3 py-2 text-sm border border-gray-700"
                >
                  {animationTypes.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Direction</label>
                <select
                  value={activeTrigger.animation.direction || 'up'}
                  onChange={(e) => updateAnimation(selectedTrigger!, { 
                    direction: e.target.value as any 
                  })}
                  className="w-full bg-gray-900 rounded-lg px-3 py-2 text-sm border border-gray-700"
                >
                  {directions.map(d => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label className="text-xs text-gray-500 mb-1 block">
                Intensity: {activeTrigger.animation.intensity}px
              </label>
              <input
                type="range"
                min="0"
                max="200"
                value={activeTrigger.animation.intensity}
                onChange={(e) => updateAnimation(selectedTrigger!, { 
                  intensity: parseInt(e.target.value) 
                })}
                className="w-full accent-indigo-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Start Opacity</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={activeTrigger.animation.startOpacity}
                  onChange={(e) => updateAnimation(selectedTrigger!, { 
                    startOpacity: parseFloat(e.target.value) 
                  })}
                  className="w-full bg-gray-900 rounded-lg px-3 py-2 text-sm border border-gray-700"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">End Opacity</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={activeTrigger.animation.endOpacity}
                  onChange={(e) => updateAnimation(selectedTrigger!, { 
                    endOpacity: parseFloat(e.target.value) 
                  })}
                  className="w-full bg-gray-900 rounded-lg px-3 py-2 text-sm border border-gray-700"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Start Scale</label>
                <input
                  type="number"
                  step="0.1"
                  value={activeTrigger.animation.startScale}
                  onChange={(e) => updateAnimation(selectedTrigger!, { 
                    startScale: parseFloat(e.target.value) 
                  })}
                  className="w-full bg-gray-900 rounded-lg px-3 py-2 text-sm border border-gray-700"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">End Scale</label>
                <input
                  type="number"
                  step="0.1"
                  value={activeTrigger.animation.endScale}
                  onChange={(e) => updateAnimation(selectedTrigger!, { 
                    endScale: parseFloat(e.target.value) 
                  })}
                  className="w-full bg-gray-900 rounded-lg px-3 py-2 text-sm border border-gray-700"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-700">
            <button
              onClick={() => deleteTrigger(selectedTrigger!)}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
            >
              <Trash2 size={12} /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  )
}