'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Play, Zap, GitBranch, ArrowRight, X, ChevronDown } from 'lucide-react'

interface LogicNode {
  id: string
  type: 'condition' | 'action' | 'trigger'
  label: string
  config: {
    operator?: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' | 'contains' | 'isEmpty'
    field?: string
    value?: string
    action?: string
    animation?: string
  }
  children?: LogicNode[]
}

interface LogicFlow {
  id: string
  name: string
  trigger: string
  nodes: LogicNode[]
  enabled: boolean
}

const operators = [
  { value: 'equals', label: 'equals' },
  { value: 'notEquals', label: 'not equals' },
  { value: 'greaterThan', label: 'greater than' },
  { value: 'lessThan', label: 'less than' },
  { value: 'contains', label: 'contains' },
  { value: 'isEmpty', label: 'is empty' }
]

const triggerTypes = [
  { value: 'click', label: 'On Click' },
  { value: 'hover', label: 'On Hover' },
  { value: 'submit', label: 'On Submit' },
  { value: 'scroll', label: 'On Scroll' },
  { value: 'load', label: 'On Load' }
]

const actionTypes = [
  { value: 'show', label: 'Show Element' },
  { value: 'hide', label: 'Hide Element' },
  { value: 'animate', label: 'Play Animation' },
  { value: 'navigate', label: 'Navigate To' },
  { value: 'setState', label: 'Set State' },
  { value: 'callApi', label: 'Call API' }
]

export default function LogicFlowEditor() {
  const [flows, setFlows] = useState<LogicFlow[]>([
    {
      id: '1',
      name: 'Show Modal on Click',
      trigger: 'click',
      enabled: true,
      nodes: [
        {
          id: 'n1',
          type: 'condition',
          label: 'User Logged In',
          config: { operator: 'equals', field: 'user.status', value: 'logged_in' }
        },
        {
          id: 'n2',
          type: 'action',
          label: 'Show Modal',
          config: { action: 'show', animation: 'fadeIn' }
        }
      ]
    }
  ])
  const [activeFlowId, setActiveFlowId] = useState<string>('1')
  const [draggedNode, setDraggedNode] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)

  const activeFlow = flows.find(f => f.id === activeFlowId)

  const addFlow = () => {
    const newFlow: LogicFlow = {
      id: Date.now().toString(),
      name: `Logic ${flows.length + 1}`,
      trigger: 'click',
      enabled: true,
      nodes: [
        { id: Date.now().toString(), type: 'trigger', label: 'Trigger', config: {} }
      ]
    }
    setFlows([...flows, newFlow])
    setActiveFlowId(newFlow.id)
  }

  const updateFlow = (id: string, updates: Partial<LogicFlow>) => {
    setFlows(flows.map(f => f.id === id ? { ...f, ...updates } : f))
  }

  const addNode = (type: LogicNode['type']) => {
    if (!activeFlow) return
    const newNode: LogicNode = {
      id: Date.now().toString(),
      type,
      label: type === 'condition' ? 'New Condition' : type === 'action' ? 'New Action' : 'Trigger',
      config: {}
    }
    updateFlow(activeFlowId, { nodes: [...activeFlow.nodes, newNode] })
  }

  const updateNode = (nodeId: string, updates: Partial<LogicNode>) => {
    if (!activeFlow) return
    updateFlow(activeFlowId, {
      nodes: activeFlow.nodes.map(n => n.id === nodeId ? { ...n, ...updates } : n)
    })
  }

  const deleteNode = (nodeId: string) => {
    if (!activeFlow) return
    updateFlow(activeFlowId, {
      nodes: activeFlow.nodes.filter(n => n.id !== nodeId)
    })
  }

  const getNodeColor = (type: LogicNode['type']) => {
    switch (type) {
      case 'trigger': return 'bg-amber-500'
      case 'condition': return 'bg-indigo-500'
      case 'action': return 'bg-emerald-500'
    }
  }

  const renderPreview = () => {
    if (!previewMode || !activeFlow) return null

    return (
      <div className="h-48 bg-gray-800 rounded-lg p-4 flex flex-col items-center justify-center gap-4">
        <div className="text-xs text-gray-500 mb-2">Interactive Preview</div>
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {activeFlow.nodes.map((node, idx) => (
            <div key={node.id} className="flex items-center">
              <motion.div
                className={`px-4 py-2 rounded-lg text-white text-xs font-medium ${getNodeColor(node.type)}`}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
              >
                {node.label}
              </motion.div>
              {idx < activeFlow.nodes.length - 1 && (
                <ArrowRight size={16} className="text-gray-500 mx-1" />
              )}
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-500">
          Trigger: {triggerTypes.find(t => t.value === activeFlow.trigger)?.label}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 rounded-xl p-4 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Logic Flow</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`p-2 rounded-lg transition-colors ${
              previewMode ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <Play size={16} />
          </button>
          <button
            onClick={addFlow}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="text-xs text-gray-400 mb-1 block">Flow</label>
          <select
            value={activeFlowId}
            onChange={(e) => setActiveFlowId(e.target.value)}
            className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm border border-gray-700"
          >
            {flows.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>
        <div className="w-32">
          <label className="text-xs text-gray-400 mb-1 block">Trigger</label>
          <select
            value={activeFlow?.trigger || 'click'}
            onChange={(e) => updateFlow(activeFlowId, { trigger: e.target.value })}
            className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm border border-gray-700"
          >
            {triggerTypes.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center pt-5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={activeFlow?.enabled ?? true}
              onChange={(e) => updateFlow(activeFlowId, { enabled: e.target.checked })}
              className="w-4 h-4 rounded bg-gray-800 border-gray-600"
            />
            <span className="text-sm">Active</span>
          </label>
        </div>
      </div>

      {previewMode && renderPreview()}

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => addNode('trigger')}
          className="px-3 py-1.5 bg-amber-500/20 text-amber-400 rounded-lg text-xs hover:bg-amber-500/30"
        >
          <Zap size={12} className="inline mr-1" /> Trigger
        </button>
        <button
          onClick={() => addNode('condition')}
          className="px-3 py-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg text-xs hover:bg-indigo-500/30"
        >
          <GitBranch size={12} className="inline mr-1" /> Condition
        </button>
        <button
          onClick={() => addNode('action')}
          className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs hover:bg-emerald-500/30"
        >
          <ArrowRight size={12} className="inline mr-1" /> Action
        </button>
      </div>

      <div className="space-y-3">
        {activeFlow?.nodes.map((node, idx) => (
          <motion.div
            key={node.id}
            layout
            className={`rounded-lg border-2 p-3 ${
              node.type === 'trigger' ? 'border-amber-500/50 bg-amber-500/10' :
              node.type === 'condition' ? 'border-indigo-500/50 bg-indigo-500/10' :
              'border-emerald-500/50 bg-emerald-500/10'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getNodeColor(node.type)}`}>
                {node.type === 'trigger' && <Zap size={14} />}
                {node.type === 'condition' && <GitBranch size={14} />}
                {node.type === 'action' && <ArrowRight size={14} />}
              </div>
              <input
                type="text"
                value={node.label}
                onChange={(e) => updateNode(node.id, { label: e.target.value })}
                className="flex-1 bg-transparent border-b border-gray-700 text-sm focus:border-indigo-500 outline-none"
              />
              <button
                onClick={() => deleteNode(node.id)}
                className="text-gray-500 hover:text-red-400"
              >
                <X size={14} />
              </button>
            </div>

            {node.type === 'condition' && (
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Field"
                  value={node.config.field || ''}
                  onChange={(e) => updateNode(node.id, { 
                    config: { ...node.config, field: e.target.value } 
                  })}
                  className="bg-gray-800 rounded px-2 py-1.5 text-xs border border-gray-700"
                />
                <select
                  value={node.config.operator || 'equals'}
                  onChange={(e) => updateNode(node.id, { 
                    config: { ...node.config, operator: e.target.value as any } 
                  })}
                  className="bg-gray-800 rounded px-2 py-1.5 text-xs border border-gray-700"
                >
                  {operators.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Value"
                  value={node.config.value || ''}
                  onChange={(e) => updateNode(node.id, { 
                    config: { ...node.config, value: e.target.value } 
                  })}
                  className="bg-gray-800 rounded px-2 py-1.5 text-xs border border-gray-700"
                />
              </div>
            )}

            {node.type === 'action' && (
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={node.config.action || 'show'}
                  onChange={(e) => updateNode(node.id, { 
                    config: { ...node.config, action: e.target.value } 
                  })}
                  className="bg-gray-800 rounded px-2 py-1.5 text-xs border border-gray-700"
                >
                  {actionTypes.map(a => (
                    <option key={a.value} value={a.value}>{a.label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Animation/Target"
                  value={node.config.animation || ''}
                  onChange={(e) => updateNode(node.id, { 
                    config: { ...node.config, animation: e.target.value } 
                  })}
                  className="bg-gray-800 rounded px-2 py-1.5 text-xs border border-gray-700"
                />
              </div>
            )}

            {node.type === 'trigger' && (
              <div className="text-xs text-gray-500">
                Waits for: {triggerTypes.find(t => t.value === activeFlow.trigger)?.label}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {activeFlow?.nodes.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          Add nodes to build your logic flow
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-gray-700 flex justify-between">
        <button
          onClick={() => setFlows(flows.filter(f => f.id !== activeFlowId))}
          className="text-xs text-red-400 hover:text-red-300"
        >
          Delete Flow
        </button>
      </div>
    </div>
  )
}