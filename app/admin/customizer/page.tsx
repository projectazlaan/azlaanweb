'use client'

import { useState } from 'react'
import {
  Clock,
  Scroll,
  GitBranch,
  Component,
  Layers,
  Download,
  Database,
  Link2,
  Repeat,
  ShoppingCart,
  ChevronRight,
} from 'lucide-react'
import { AnimationTimeline, ScrollParallaxEditor, LogicFlowEditor, StatefulEditor } from '@/components/admin/customizer/animation'
import { CodeCompiler, FrameworkExport, PerformanceAuditor, StagingVersioning } from '@/components/admin/customizer/export'
import { CollectionManager, DataBinding, RepeaterEditor, EcommerceBridge } from '@/components/admin/customizer/cms'

type TabType = 'timeline' | 'scroll' | 'logic' | 'state' | 'collections' | 'binding' | 'repeater' | 'ecommerce' | 'export'

interface Tab {
  id: TabType
  label: string
  icon: React.ReactNode
  category?: string
}

const tabs: Tab[] = [
  { id: 'timeline', label: 'Animation Timeline', icon: <Clock size={16} />, category: 'animation' },
  { id: 'scroll', label: 'Scroll & Parallax', icon: <Scroll size={16} />, category: 'animation' },
  { id: 'logic', label: 'Logic Flow', icon: <GitBranch size={16} />, category: 'animation' },
  { id: 'state', label: 'Component States', icon: <Component size={16} />, category: 'animation' },
  { id: 'collections', label: 'Collections', icon: <Database size={16} />, category: 'cms' },
  { id: 'binding', label: 'Data Binding', icon: <Link2 size={16} />, category: 'cms' },
  { id: 'repeater', label: 'Repeater', icon: <Repeat size={16} />, category: 'cms' },
  { id: 'ecommerce', label: 'E-commerce', icon: <ShoppingCart size={16} />, category: 'cms' },
  { id: 'export', label: 'Export & Audit', icon: <Download size={16} />, category: 'export' },
]

export default function CustomizerPage() {
  const [activeTab, setActiveTab] = useState<TabType>('timeline')

  const animationTabs = tabs.filter(t => t.category === 'animation')
  const cmsTabs = tabs.filter(t => t.category === 'cms')
  const exportTabs = tabs.filter(t => t.category === 'export')

  return (
    <div className="flex h-screen bg-gray-950">
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-lg font-semibold text-white flex items-center gap-2">
            <Layers size={20} className="text-indigo-400" />
            Visual Customizer
          </h1>
          <p className="text-xs text-gray-500 mt-1">Build & Design</p>
        </div>

        <div className="flex-1 overflow-auto p-3">
          <div className="mb-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 px-2">Animation & Logic</div>
            <nav className="space-y-1">
              {animationTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <ChevronRight size={14} className="ml-auto" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="mb-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 px-2">Data & CMS</div>
            <nav className="space-y-1">
              {cmsTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <ChevronRight size={14} className="ml-auto" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="mb-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 px-2">Export & Audit</div>
            <nav className="space-y-1">
              {exportTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <ChevronRight size={14} className="ml-auto" />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

          <div className="p-4 border-t border-gray-800">
            <div className="text-xs text-gray-500">
              {activeTab === 'export' ? 'Phase 6: Export & Production Audit' : 
               activeTab === 'collections' || activeTab === 'binding' || activeTab === 'repeater' || activeTab === 'ecommerce' 
                 ? 'Phase 4: Data Binding & Visual CMS' 
                 : 'Phase 5 Complete'}
            </div>
          </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {activeTab === 'timeline' && 'Create keyframe animations with visual timeline control'}
              {activeTab === 'scroll' && 'Add scroll-triggered and parallax effects'}
              {activeTab === 'logic' && 'Build node-based conditional logic flows'}
              {activeTab === 'state' && 'Configure hover, active, focus, and loading states'}
              {activeTab === 'export' && 'Compile code, export frameworks, audit performance, and manage versions'}
            </p>
          </div>

            <div className="space-y-6">
              {activeTab === 'timeline' && <AnimationTimeline />}
              {activeTab === 'scroll' && <ScrollParallaxEditor />}
              {activeTab === 'logic' && <LogicFlowEditor />}
              {activeTab === 'state' && <StatefulEditor />}

              {activeTab === 'collections' && <CollectionManager />}
              {activeTab === 'binding' && <DataBinding />}
              {activeTab === 'repeater' && <RepeaterEditor />}
              {activeTab === 'ecommerce' && <EcommerceBridge />}

              {activeTab === 'export' && (
                <div className="space-y-6">
                  <CodeCompiler />
                  <FrameworkExport />
                  <PerformanceAuditor />
                  <StagingVersioning />
                </div>
              )}
            </div>

          {activeTab !== 'export' && (
            <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <h3 className="text-sm font-medium text-white mb-2">Integration Notes</h3>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Animation configs can be exported as JSON for component integration</li>
                <li>• Scroll triggers use Framer Motion's useScroll and useTransform hooks</li>
                <li>• Logic flows can be connected to component events</li>
                <li>• State styles support CSS-in-JS and Tailwind class generation</li>
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
