'use client'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import LayersPanel from './LayersPanel'
import { StudioBlocks } from '../blocks'
import { ChevronDown, ChevronRight, X } from 'lucide-react'
export default function LeftSidebar({ iframeRef }: { iframeRef: React.RefObject<HTMLIFrameElement | null> }) {
  const [mounted, setMounted] = useState(false)
  const [previewBlock, setPreviewBlock] = useState<{html: string, label: string} | null>(null)
  const [tab, setTab] = useState<'blocks' | 'layers'>('blocks')
  const [search, setSearch] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'heroes': true,
    'features': true,
  })
  useEffect(() => {
    setMounted(true)
  }, [])
  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }))
  }
  // Filter blocks
  const filteredBlocks = StudioBlocks.map(cat => {
    const filteredVariants = cat.variants.filter(v => 
      !search || v.label.toLowerCase().includes(search.toLowerCase())
    )
    return { ...cat, variants: filteredVariants }
  }).filter(cat => cat.variants.length > 0)
  return (
    <aside className="w-64 bg-[#111] border-r border-white/5 flex flex-col overflow-hidden flex-shrink-0">
      {/* Tabs */}
      <div className="flex border-b border-white/5 flex-shrink-0">
        {(['blocks', 'layers'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${
              tab === t ? 'text-white border-b-2 border-indigo-500 bg-white/5' : 'text-gray-600 hover:text-white hover:bg-white/[0.02]'
            }`}>
            {t === 'blocks' ? '⬡ Blocks' : '◫ Layers'}
          </button>
        ))}
      </div>
      {/* BLOCKS */}
      {tab === 'blocks' && (
        <>
          <div className="p-3 border-b border-white/5 flex-shrink-0">
            <input type="text" placeholder="Search variants…" value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-3 py-2 bg-[#1a1a1a] border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors" />
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {filteredBlocks.map(category => {
              const isExpanded = expandedCategories[category.id] || search !== ''
              return (
                <div key={category.id} className="border border-white/5 rounded-2xl overflow-hidden bg-[#161616]">
                  {/* Category Header */}
                  <button 
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center justify-between p-3 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{category.icon}</span>
                      <span className="text-xs font-bold text-gray-300">{category.title}</span>
                      <span className="text-[10px] text-gray-600 font-mono bg-black/40 px-1.5 py-0.5 rounded-md">
                        {category.variants.length}
                      </span>
                    </div>
                    {isExpanded ? <ChevronDown size={14} className="text-gray-500" /> : <ChevronRight size={14} className="text-gray-500" />}
                  </button>
                  {/* Variants List */}
                  {isExpanded && (
                    <div className="p-2 space-y-1 bg-black/20 border-t border-white/5">
                      {category.variants.map(variant => (
                        <div key={variant.id} draggable
                          onMouseEnter={() => setPreviewBlock({ html: variant.html, label: variant.label })}
                          onMouseLeave={() => setPreviewBlock(null)}
                          onDragStart={e => {
                            e.dataTransfer.setData('text/html-block', variant.html)
                            e.dataTransfer.setData('block-id', variant.id)
                            setPreviewBlock(null)
                          }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.02] hover:bg-indigo-500/10 cursor-grab active:cursor-grabbing transition-all group border border-transparent hover:border-indigo-500/20"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/50 group-hover:bg-indigo-400 group-hover:scale-150 transition-all"></div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-400 group-hover:text-indigo-100 transition-colors truncate">{variant.label}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
            {filteredBlocks.length === 0 && (
              <div className="p-4 text-center text-xs text-gray-600">
                No blocks found matching "{search}"
              </div>
            )}
          </div>
        </>
      )}
      {/* LAYERS */}
      {tab === 'layers' && (
        <div className="flex-1 overflow-hidden flex flex-col">
          <LayersPanel iframeRef={iframeRef} />
        </div>
      )}
      {/* PREMIUM FLOATING PREVIEW PORTAL */}
      {mounted && previewBlock && createPortal(
        <>
          {/* Backdrop to close on outside click */}
          <div 
            className="fixed inset-0 z-[1999999] bg-black/20 backdrop-blur-[2px]"
            onClick={() => setPreviewBlock(null)}
          />
          <div 
            style={{
              position: 'fixed',
              left: '280px',
              top: '60px',
              bottom: '40px',
              width: '850px',
              zIndex: 2000000,
              pointerEvents: 'auto',
              display: 'flex',
              flexDirection: 'column',
              animation: 'preview-pop-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div 
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#0f0f0f',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 50px rgba(79,70,229,0.15)',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div className="px-8 py-5 border-b border-white/5 bg-white/[0.02] flex justify-between items-center flex-shrink-0">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Live Preview</span>
                  </div>
                  <div className="w-px h-4 bg-white/10" />
                  <span className="font-bold text-white text-lg tracking-tight">{previewBlock.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 text-[10px] font-medium uppercase tracking-widest bg-white/10 px-4 py-1.5 rounded-full border border-white/10">Hold & Drag to Insert</span>
                  <button 
                    onClick={() => setPreviewBlock(null)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              {/* Content Area */}
              <div className="flex-1 bg-[#0a0a0a] relative overflow-hidden flex items-center justify-center p-6">
                {/* Dot Grid Background */}
                <div 
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #4f46e5 1px, transparent 0)', backgroundSize: '32px 32px' }}
                />
                <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
                  {/* Scaled Canvas */}
                  <div 
                    className="shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] rounded-2xl overflow-hidden bg-white border border-white/10"
                    style={{ 
                      width: '1440px', 
                      height: '900px', 
                      transform: 'scale(0.48)',
                      transformOrigin: 'center center',
                      flexShrink: 0
                    }}
                  >
                    <iframe 
                      srcDoc={`
                        <!DOCTYPE html>
                        <html>
                          <head>
                            <script src="https://cdn.tailwindcss.com"></script>
                            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
                            <style>
                              body { 
                                margin: 0; 
                                padding: 0; 
                                background-color: #fff; 
                                font-family: 'Inter', sans-serif; 
                                overflow: hidden;
                                width: 1440px;
                                height: 900px;
                                display: flex;
                                flex-direction: column;
                              }
                              #preview-root { width: 100%; height: 100%; overflow: hidden; }
                              * { transition: none !important; }
                            </style>
                          </head>
                          <body>
                            <div id="preview-root">
                              ${previewBlock.html}
                            </div>
                          </body>
                        </html>
                      `}
                      style={{ width: '100%', height: '100%', border: 'none' }}
                    />
                  </div>
                  {/* Drag Indicator Overlay */}
                  <div className="absolute inset-0 pointer-events-none flex items-end justify-center pb-12">
                    <div className="px-6 py-2 bg-indigo-600/90 backdrop-blur-md rounded-full border border-indigo-400/30 shadow-2xl animate-bounce">
                      <span className="text-white text-xs font-bold tracking-widest uppercase">Drag into Canvas to Add</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <style jsx global>{`
            @keyframes preview-pop-in {
              from { opacity: 0; transform: scale(0.95) translateX(-20px); }
              to { opacity: 1; transform: scale(1) translateX(0); }
            }
          `}</style>
        </>,
        document.body
      )}
    </aside>
  )
}
