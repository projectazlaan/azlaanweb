'use client'

import React, { useState, useEffect, useRef } from 'react'
import { 
  Layers, 
  Settings2, 
  Monitor, 
  Smartphone, 
  Tablet,
  MousePointer2,
  Undo2,
  Redo2,
  Save,
  Eye,
  X,
  Plus,
  Palette,
  Maximize,
  Code,
  ChevronDown,
  Layout,
  Type,
  Image as ImageIcon,
  FileImage,
  Search
} from 'lucide-react'

export default function ModernVisualBuilder() {
  const [selectedComponent, setSelectedComponent] = useState<any>(null)
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [activeTab, setActiveTab] = useState<'blocks' | 'styles' | 'layers'>('blocks')
  const [showMediaHub, setShowMediaHub] = useState(false)
  const [openCategories, setOpenCategories] = useState<string[]>(['site-components', 'basic'])
  const [searchQuery, setSearchQuery] = useState('')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const mediaAssets = [
    { id: 1, url: '/media-pro/men/Design 1/649824908_122120770023151981_1372810042799937270_n.webp', name: 'Summer Collection' },
    { id: 2, url: '/media-pro/men/Design 1/651882421_122120769999151981_8209666213684742551_n.webp', name: 'Premium Denim' },
    { id: 3, url: '/media-pro/men/Design 1/650656536_122120770035151981_5282848327082156297_n.webp', name: 'Luxury Suits' },
    { id: 4, url: '/media-pro/women/Design 1/673191812_122125962327151981_8385571386878315506_n.webp', name: 'Female Fashion' },
    { id: 5, url: '/media-pro/women/Design 1/674438935_122125962423151981_7895183005361462477_n.webp', name: 'Winter Wear' },
    { id: 6, url: '/media-pro/Cover/667707081_122124567927151981_5917933416815199932_n.webp', name: 'Store Front' },
  ]

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, key, metadata } = event.data
      if (type === 'SELECT_COMPONENT') {
        setSelectedComponent({ key, metadata })
        setActiveTab('styles')
      }
      if (type === 'DESELECT_COMPONENT') {
        setSelectedComponent(null)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const toggleCategory = (cat: string) => {
    setOpenCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  const updateIframeContent = (key: string, value: string) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_CONTENT', key, value }, '*')
    }
  }

  const runCommand = (cmd: string) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'RUN_COMMAND', command: cmd }, '*')
    }
  }

  const selectImage = (url: string) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_IMAGE', url }, '*')
    }
    setShowMediaHub(false)
  }

  return (
    <div className="flex h-screen bg-[#f0f2f5] text-[#444] font-sans overflow-hidden fixed inset-0 z-[9999] select-none">
      
      {/* LEFT SIDEBAR */}
      <div className="w-[280px] bg-white/80 backdrop-blur-xl border-r border-black/5 flex flex-col shrink-0 shadow-xl">
        <div className="h-16 border-b border-black/5 flex items-center px-6 bg-gradient-to-r from-[#e0f2ff] to-[#f0eaff]">
          <div className="w-8 h-8 bg-[#0071E3] rounded-xl flex items-center justify-center mr-3 shadow-lg font-black text-xs text-white">A</div>
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0071E3]">Studio Space</h2>
        </div>

        <div className="flex h-12 border-b border-black/5 bg-white/30">
          <button onClick={() => { setActiveTab('blocks'); setShowMediaHub(false); }} className={`flex-1 flex items-center justify-center transition-all ${activeTab === 'blocks' && !showMediaHub ? 'text-[#0071E3] bg-white border-b-2 border-[#0071E3]' : 'text-black/20 hover:text-black/40'}`}><Plus size={18} /></button>
          <button onClick={() => { setActiveTab('layers'); setShowMediaHub(false); }} className={`flex-1 flex items-center justify-center transition-all ${activeTab === 'layers' ? 'text-[#0071E3] bg-white border-b-2 border-[#0071E3]' : 'text-black/20 hover:text-black/40'}`}><Layers size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {activeTab === 'blocks' && (
            <div className="flex flex-col space-y-1">
              <div className="bg-[#f8faff] rounded-2xl border border-blue-50/50 mb-2 overflow-hidden">
                <button onClick={() => toggleCategory('site-components')} className="w-full flex items-center justify-between px-5 py-4 hover:bg-blue-100/30 transition-all">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#0071E3]">Site Components</span>
                  <ChevronDown size={14} className={`transition-transform text-blue-300 ${openCategories.includes('site-components') ? '' : '-rotate-90'}`} />
                </button>
                {openCategories.includes('site-components') && (
                  <div className="p-3 grid grid-cols-2 gap-3">
                    {[{n:'Navbar', c:'bg-blue-50'}, {n:'Hero', c:'bg-purple-50'}, {n:'Products', c:'bg-green-50'}, {n:'Story', c:'bg-pink-50'}].map(item => (
                      <button key={item.n} onClick={() => runCommand(`add-block-${item.n.toLowerCase()}`)} className={`h-24 ${item.c} rounded-2xl border border-white flex flex-col items-center justify-center gap-2 hover:scale-[1.05] cursor-pointer transition-all shadow-sm active:scale-90 group outline-none`}>
                        <Layout size={22} className="text-black/10 group-hover:text-[#0071E3] transition-all" />
                        <span className="text-[9px] font-black text-black/30 uppercase tracking-tighter group-hover:text-black/60">{item.n}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-[#fffcf8] rounded-2xl border border-orange-50/50 overflow-hidden">
                <button onClick={() => toggleCategory('basic')} className="w-full flex items-center justify-between px-5 py-4 hover:bg-orange-100/30 transition-all">
                  <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">Basic Blocks</span>
                  <ChevronDown size={14} className={`transition-transform text-orange-200 ${openCategories.includes('basic') ? '' : '-rotate-90'}`} />
                </button>
                {openCategories.includes('basic') && (
                  <div className="p-3 grid grid-cols-2 gap-3">
                    <button onClick={() => runCommand('add-block-text')} className="h-24 bg-orange-50 rounded-2xl border border-white flex flex-col items-center justify-center gap-2 hover:scale-[1.05] cursor-pointer transition-all shadow-sm active:scale-90 group outline-none">
                      <Type size={22} className="text-black/10 group-hover:text-orange-400" />
                      <span className="text-[9px] font-black text-black/30 uppercase tracking-tighter group-hover:text-black/60">Text</span>
                    </button>
                    <button onClick={() => runCommand('add-block-image')} className="h-24 bg-teal-50 rounded-2xl border border-white flex flex-col items-center justify-center gap-2 hover:scale-[1.05] cursor-pointer transition-all shadow-sm active:scale-90 group outline-none">
                      <ImageIcon size={22} className="text-black/10 group-hover:text-teal-400" />
                      <span className="text-[9px] font-black text-black/30 uppercase tracking-tighter group-hover:text-black/60">Image</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CENTER WORKSPACE */}
      <div className="flex-1 flex flex-col bg-white/40 relative">
        {/* TOP TOOLBAR */}
        <header className="h-16 bg-white/70 backdrop-blur-xl border-b border-black/5 flex items-center justify-between px-8 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-6">
             <div className="flex bg-[#f0f2f5] rounded-2xl p-1.5 border border-black/5 shadow-inner">
                <button onClick={() => setDevice('desktop')} className={`p-2.5 rounded-xl transition-all ${device === 'desktop' ? 'bg-white text-[#0071E3] shadow-md' : 'text-black/20 hover:text-black/40'}`}><Monitor size={16} /></button>
                <button onClick={() => setDevice('tablet')} className={`p-2.5 rounded-xl transition-all ${device === 'tablet' ? 'bg-white text-[#0071E3] shadow-md' : 'text-black/20 hover:text-black/40'}`}><Tablet size={16} /></button>
                <button onClick={() => setDevice('mobile')} className={`p-2.5 rounded-xl transition-all ${device === 'mobile' ? 'bg-white text-[#0071E3] shadow-md' : 'text-black/20 hover:text-black/40'}`}><Smartphone size={16} /></button>
             </div>
          </div>

          <div className="flex items-center gap-2 text-black/20">
             <button onClick={() => runCommand('preview')} className="p-3 hover:text-[#0071E3] hover:bg-blue-50 rounded-2xl transition-all"><Eye size={20} /></button>
             <button onClick={() => runCommand('fullscreen')} className="p-3 hover:text-[#0071E3] hover:bg-blue-50 rounded-2xl transition-all"><Maximize size={20} /></button>
             <button onClick={() => runCommand('export-template')} className="p-3 hover:text-[#0071E3] hover:bg-blue-50 rounded-2xl transition-all"><Code size={20} /></button>
             <div className="w-px h-6 bg-black/5 mx-3"></div>
             <button onClick={() => runCommand('undo')} className="p-3 hover:text-[#0071E3] hover:bg-blue-50 rounded-2xl transition-all"><Undo2 size={20} /></button>
             <button onClick={() => runCommand('redo')} className="p-3 hover:text-[#0071E3] hover:bg-blue-50 rounded-2xl transition-all"><Redo2 size={20} /></button>
             <div className="w-px h-6 bg-black/5 mx-3"></div>
             <button onClick={() => alert('Changes saved!')} className="flex items-center gap-3 px-10 py-3.5 bg-gradient-to-r from-[#0071E3] to-[#00a6ff] hover:shadow-xl hover:scale-[1.02] rounded-2xl text-[10px] font-black text-white transition-all uppercase tracking-[0.2em] ml-4 shadow-blue-600/20 active:scale-95">
               <Save size={16} /> Save Changes
             </button>
          </div>
        </header>

        {/* CANVAS */}
        <div className="flex-1 flex justify-center items-start overflow-auto custom-scrollbar p-10 bg-[#f8f9fb]">
          <div style={{ width: device === 'desktop' ? '100%' : device === 'tablet' ? '768px' : '375px', height: '100%', minHeight: '100%' }} className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-3xl overflow-hidden relative transition-all duration-500 ease-in-out border-[8px] border-white">
            <iframe ref={iframeRef} src="/?customizer=true" className="w-full h-full border-none pointer-events-auto" style={{ minHeight: '100vh' }} />
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="w-[320px] bg-white/80 backdrop-blur-xl border-l border-white/50 flex flex-col shrink-0 shadow-xl">
        <div className="h-16 border-b border-black/5 flex px-2 bg-gradient-to-r from-[#fff5f5] to-[#fff0f8]">
           <button onClick={() => { setActiveTab('styles'); setShowMediaHub(false); }} className={`flex-1 flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'styles' && !showMediaHub ? 'text-pink-500 bg-white shadow-sm border-b-2 border-pink-500' : 'text-black/10 hover:text-black/30'}`}><Settings2 size={18} /> Style Studio</button>
           <button onClick={() => setShowMediaHub(true)} className={`flex-1 flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] transition-all ${showMediaHub ? 'text-[#0071E3] bg-white shadow-sm border-b-2 border-[#0071E3]' : 'text-black/10 hover:text-black/30'}`}><FileImage size={18} /> Media Hub</button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {selectedComponent && !showMediaHub ? (
            <div className="flex flex-col animate-in fade-in zoom-in-95 duration-500">
              <div className="p-8 border-b border-black/5 bg-pink-50/30">
                 <div className="text-[9px] font-black uppercase tracking-[0.2em] text-pink-400 mb-2">Designer Focus</div>
                 <h3 className="text-base font-black text-black/80 truncate uppercase tracking-tighter leading-none">{selectedComponent.key}</h3>
              </div>
              <div className="p-8 space-y-10">
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-black/20">Content Editor</h4>
                   <textarea className="w-full bg-[#fcfdfe] border border-black/5 rounded-3xl p-5 text-sm text-black/70 outline-none focus:border-pink-300 min-h-[160px] transition-all shadow-sm" value={selectedComponent.metadata.currentText || ''} onChange={(e) => updateIframeContent(selectedComponent.key, e.target.value)} />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-20 text-center flex flex-col items-center justify-center h-full opacity-10">
               <Palette size={40} className="text-black mb-8" />
               <p className="text-[12px] font-black uppercase tracking-[0.4em] text-black">Select an element</p>
            </div>
          )}
        </div>
      </div>

      {/* MEDIA HUB OVERLAY */}
      {showMediaHub && (
        <div className="fixed inset-0 z-[10001] bg-white flex flex-col animate-in fade-in zoom-in-95 duration-300">
          <header className="h-20 border-b border-black/5 px-10 flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-widest text-[#0071E3]">Media Library</h2>
            <button onClick={() => setShowMediaHub(false)} className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-xl"><X size={20} /></button>
          </header>
          <div className="flex-1 overflow-y-auto p-12 bg-[#f8f9fb] grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {mediaAssets.map(asset => (
              <div key={asset.id} onClick={() => selectImage(asset.url)} className="h-64 bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer border-4 border-white group">
                <img src={asset.url} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt={asset.name} />
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
      `}</style>
    </div>
  )
}
