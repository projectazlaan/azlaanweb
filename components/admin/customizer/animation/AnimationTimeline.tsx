'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Plus, Trash2, GripVertical, ChevronDown, ChevronRight, X } from 'lucide-react'

interface Keyframe {
  id: string
  time: number
  properties: {
    x?: number
    y?: number
    scale?: number
    rotate?: number
    opacity?: number
  }
}

interface AnimationSequence {
  id: string
  name: string
  duration: number
  easing: string
  keyframes: Keyframe[]
}

const easingPresets = [
  'ease', 'easeIn', 'easeOut', 'easeInOut', 
  'linear', 'circIn', 'circOut', 'circInOut',
  'backIn', 'backOut', 'backInOut', 'elasticIn', 'elasticOut'
]

export default function AnimationTimeline() {
  const [sequences, setSequences] = useState<AnimationSequence[]>([
    {
      id: '1',
      name: 'Fade In',
      duration: 1000,
      easing: 'easeOut',
      keyframes: [
        { id: 'k1', time: 0, properties: { opacity: 0, y: 20 } },
        { id: 'k2', time: 1000, properties: { opacity: 1, y: 0 } }
      ]
    }
  ])
  const [activeSequenceId, setActiveSequenceId] = useState<string>('1')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [selectedKeyframe, setSelectedKeyframe] = useState<string | null>(null)
  const [expandedSequence, setExpandedSequence] = useState<string | null>('1')

  const activeSequence = sequences.find(s => s.id === activeSequenceId)

  const addSequence = () => {
    const newSequence: AnimationSequence = {
      id: Date.now().toString(),
      name: `Animation ${sequences.length + 1}`,
      duration: 1000,
      easing: 'easeOut',
      keyframes: [{ id: Date.now().toString(), time: 0, properties: {} }]
    }
    setSequences([...sequences, newSequence])
    setActiveSequenceId(newSequence.id)
    setExpandedSequence(newSequence.id)
  }

  const deleteSequence = (id: string) => {
    setSequences(sequences.filter(s => s.id !== id))
    if (activeSequenceId === id && sequences.length > 1) {
      setActiveSequenceId(sequences.find(s => s.id !== id)?.id || '')
    }
  }

  const updateSequence = (id: string, updates: Partial<AnimationSequence>) => {
    setSequences(sequences.map(s => s.id === id ? { ...s, ...updates } : s))
  }

  const addKeyframe = () => {
    if (!activeSequence) return
    const newKeyframe: Keyframe = {
      id: Date.now().toString(),
      time: activeSequence.duration / 2,
      properties: {}
    }
    updateSequence(activeSequence.id, {
      keyframes: [...activeSequence.keyframes, newKeyframe].sort((a, b) => a.time - b.time)
    })
  }

  const updateKeyframe = (keyframeId: string, updates: Partial<Keyframe>) => {
    if (!activeSequence) return
    const updatedKeyframes = activeSequence.keyframes.map(k => 
      k.id === keyframeId ? { ...k, ...updates } : k
    ).sort((a, b) => a.time - b.time)
    updateSequence(activeSequence.id, { keyframes: updatedKeyframes })
  }

  const deleteKeyframe = (keyframeId: string) => {
    if (!activeSequence) return
    updateSequence(activeSequence.id, {
      keyframes: activeSequence.keyframes.filter(k => k.id !== keyframeId)
    })
    setSelectedKeyframe(null)
  }

  const renderPreview = () => {
    if (!activeSequence) return null
    
    const progress = currentTime / activeSequence.duration
    const keyframes = activeSequence.keyframes
    const prevKf = keyframes.find(k => k.time <= currentTime) || keyframes[0]
    const nextKf = keyframes.find(k => k.time > currentTime) || keyframes[keyframes.length - 1]
    const t = nextKf.time === prevKf.time ? 0 : (currentTime - prevKf.time) / (nextKf.time - prevKf.time)
    
    const interpolate = (start: number, end: number) => start + (end - start) * t
    
    const props = {
      x: interpolate(prevKf.properties.x || 0, nextKf.properties.x || 0),
      y: interpolate(prevKf.properties.y || 0, nextKf.properties.y || 0),
      scale: interpolate(prevKf.properties.scale || 1, nextKf.properties.scale || 1),
      rotate: interpolate(prevKf.properties.rotate || 0, nextKf.properties.rotate || 0),
      opacity: interpolate(prevKf.properties.opacity ?? 1, nextKf.properties.opacity ?? 1)
    }

    return (
      <motion.div
        className="w-24 h-24 bg-indigo-500 rounded-lg shadow-lg flex items-center justify-center"
        animate={props}
        transition={{ duration: 0 }}
      >
        <span className="text-white text-xs">Preview</span>
      </motion.div>
    )
  }

  return (
    <div className="bg-gray-900 rounded-xl p-4 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Animation Timeline</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            onClick={addSequence}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="text-xs text-gray-400 mb-1 block">Sequence</label>
          <select
            value={activeSequenceId}
            onChange={(e) => setActiveSequenceId(e.target.value)}
            className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm border border-gray-700"
          >
            {sequences.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div className="w-24">
          <label className="text-xs text-gray-400 mb-1 block">Duration (ms)</label>
          <input
            type="number"
            value={activeSequence?.duration || 1000}
            onChange={(e) => updateSequence(activeSequenceId, { duration: parseInt(e.target.value) || 1000 })}
            className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm border border-gray-700"
          />
        </div>
        <div className="w-32">
          <label className="text-xs text-gray-400 mb-1 block">Easing</label>
          <select
            value={activeSequence?.easing || 'easeOut'}
            onChange={(e) => updateSequence(activeSequenceId, { easing: e.target.value })}
            className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm border border-gray-700"
          >
            {easingPresets.map(e => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-4 mb-3">
          <label className="text-xs text-gray-400">Preview</label>
          <div className="flex-1 h-16 bg-gray-900 rounded-lg flex items-center justify-center relative">
            <AnimatePresence>
              {renderPreview()}
            </AnimatePresence>
            {isPlaying && (
              <motion.div 
                className="absolute inset-0 bg-indigo-500/10"
                animate={{ opacity: [0.3, 0.1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
            )}
          </div>
        </div>
        
        <div className="relative">
          <input
            type="range"
            min={0}
            max={activeSequence?.duration || 1000}
            value={currentTime}
            onChange={(e) => setCurrentTime(parseInt(e.target.value))}
            className="w-full accent-indigo-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0ms</span>
            <span>{activeSequence?.duration || 1000}ms</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">Keyframes</span>
          <button
            onClick={addKeyframe}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <Plus size={12} /> Add Keyframe
          </button>
        </div>
        
        {activeSequence?.keyframes.map((kf, idx) => (
          <div
            key={kf.id}
            className={`p-2 rounded-lg bg-gray-800 border transition-colors cursor-pointer ${
              selectedKeyframe === kf.id ? 'border-indigo-500' : 'border-gray-700 hover:border-gray-600'
            }`}
            onClick={() => setSelectedKeyframe(kf.id)}
          >
            <div className="flex items-center gap-2 mb-2">
              <GripVertical size={14} className="text-gray-500" />
              <span className="text-xs text-gray-400">Keyframe {idx + 1}</span>
              <span className="text-xs text-indigo-400 ml-auto">{kf.time}ms</span>
              <button
                onClick={(e) => { e.stopPropagation(); deleteKeyframe(kf.id) }}
                className="text-gray-500 hover:text-red-400"
              >
                <Trash2 size={14} />
              </button>
            </div>
            
            {selectedKeyframe === kf.id && (
              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-gray-700">
                <div>
                  <label className="text-xs text-gray-500">X (px)</label>
                  <input
                    type="number"
                    value={kf.properties.x || 0}
                    onChange={(e) => updateKeyframe(kf.id, {
                      properties: { ...kf.properties, x: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full bg-gray-900 rounded px-2 py-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Y (px)</label>
                  <input
                    type="number"
                    value={kf.properties.y || 0}
                    onChange={(e) => updateKeyframe(kf.id, {
                      properties: { ...kf.properties, y: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full bg-gray-900 rounded px-2 py-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Scale</label>
                  <input
                    type="number"
                    step="0.1"
                    value={kf.properties.scale || 1}
                    onChange={(e) => updateKeyframe(kf.id, {
                      properties: { ...kf.properties, scale: parseFloat(e.target.value) || 1 }
                    })}
                    className="w-full bg-gray-900 rounded px-2 py-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Rotate (deg)</label>
                  <input
                    type="number"
                    value={kf.properties.rotate || 0}
                    onChange={(e) => updateKeyframe(kf.id, {
                      properties: { ...kf.properties, rotate: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full bg-gray-900 rounded px-2 py-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Opacity</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={kf.properties.opacity ?? 1}
                    onChange={(e) => updateKeyframe(kf.id, {
                      properties: { ...kf.properties, opacity: parseFloat(e.target.value) || 1 }
                    })}
                    className="w-full bg-gray-900 rounded px-2 py-1 text-xs"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-700 flex justify-between">
        <button
          onClick={() => deleteSequence(activeSequenceId)}
          className="text-xs text-red-400 hover:text-red-300"
        >
          Delete Sequence
        </button>
      </div>
    </div>
  )
}