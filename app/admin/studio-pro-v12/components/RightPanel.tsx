'use client'

import { useState, useEffect } from 'react'
import {
  MousePointer, Type, Image as ImageIcon, Square, Trash2, Copy,
  ChevronDown, Palette, AlignLeft, AlignCenter, AlignRight,
  AlignJustify, Bold, Italic, Underline, Sparkles
} from 'lucide-react'
import { useStudioStore } from '../store'
import { usePostMessage } from '../hooks/usePostMessage'
import AIGenerator from './AIGenerator'

interface RightPanelProps {
  iframeRef: React.RefObject<HTMLIFrameElement | null>
}

// ─── Reusable UI atoms ──────────────────────────────────────────

function Section({ title, children, defaultOpen = true }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-white/5">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors">
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{title}</span>
        <ChevronDown size={13} className={`text-gray-600 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </div>
  )
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [local, setLocal] = useState(value)
  useEffect(() => setLocal(value), [value])
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-gray-500 flex-shrink-0">{label}</span>
      <div className="flex items-center gap-2">
        <input type="color" value={local.startsWith('#') ? local : '#000000'}
          onChange={e => { setLocal(e.target.value); onChange(e.target.value) }}
          className="w-7 h-7 rounded-lg border border-white/10 cursor-pointer bg-transparent flex-shrink-0" />
        <input type="text" value={local}
          onChange={e => { setLocal(e.target.value); onChange(e.target.value) }}
          className="w-20 px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[11px] text-white font-mono focus:outline-none focus:border-indigo-500" />
      </div>
    </div>
  )
}

function SliderInput({ label, value, min, max, unit, onChange }: {
  label: string; value: number; min: number; max: number; unit?: string; onChange: (v: number) => void
}) {
  const [local, setLocal] = useState(value)
  useEffect(() => setLocal(value), [value])
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between">
        <span className="text-xs text-gray-500">{label}</span>
        <span className="text-xs text-gray-400 font-mono">{local}{unit}</span>
      </div>
      <input type="range" min={min} max={max} value={local}
        onChange={e => { setLocal(Number(e.target.value)); onChange(Number(e.target.value)) }}
        className="w-full h-1.5 rounded-full bg-white/10 accent-indigo-500 cursor-pointer" />
    </div>
  )
}

function parsePixels(val: string): number {
  return Math.round(parseFloat(val) || 0)
}

function rgbToHex(rgb: string): string {
  const m = rgb.match(/\d+/g)
  if (!m || m.length < 3) return '#000000'
  return '#' + m.slice(0, 3).map(n => parseInt(n).toString(16).padStart(2, '0')).join('')
}

function cssColorToHex(val: string): string {
  if (val.startsWith('#')) return val
  if (val.startsWith('rgb')) return rgbToHex(val)
  return '#000000'
}

// ─── Global Theme Panel (no element selected) ──────────────────

function GlobalThemePanel({ iframeRef }: { iframeRef: React.RefObject<HTMLIFrameElement | null> }) {
  const settings = useStudioStore(s => s.settings)
  const updateSettings = useStudioStore(s => s.updateSettings)
  const { sendMessage } = usePostMessage(iframeRef)

  // Load a Google Font into the page
  const loadGoogleFont = (fontName: string) => {
    const slug = fontName.trim().replace(/ /g, '+')
    const id = `gfont-${slug}`
    if (document.getElementById(id)) return
    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?family=${slug}:wght@400;600;700&display=swap`
    document.head.appendChild(link)
  }

  const applyColor = (key: keyof typeof settings.colors, val: string) => {
    updateSettings({ colors: { ...settings.colors, [key]: val } })
    sendMessage({ type: 'UPDATE_THEME', data: { colors: { ...settings.colors, [key]: val } } })
  }

  const FONTS = ['Inter', 'Playfair Display', 'Roboto', 'Poppins', 'Montserrat', 'Lato', 'Raleway', 'Nunito', 'DM Sans', 'Space Grotesk']

  const applyFont = (key: 'fontFamily' | 'headingFont', rawName: string) => {
    const val = key === 'fontFamily' ? `${rawName}, sans-serif` : `${rawName}, serif`
    loadGoogleFont(rawName)
    updateSettings({ typography: { ...settings.typography, [key]: val } })
    // Inject font into iframe canvas too
    sendMessage({
      type: 'UPDATE_THEME',
      data: {
        typography: {
          ...settings.typography,
          [key]: val,
          fontSlug: rawName.replace(/ /g, '+'),
        },
      },
    })
  }

  return (
    <>
      <Section title="Site Colors">
        <ColorInput label="Primary" value={settings.colors.primary}
          onChange={v => applyColor('primary', v)} />
        <ColorInput label="Secondary" value={settings.colors.secondary}
          onChange={v => applyColor('secondary', v)} />
        <ColorInput label="Background" value={settings.colors.background}
          onChange={v => applyColor('background', v)} />
        <ColorInput label="Text" value={settings.colors.text}
          onChange={v => applyColor('text', v)} />
      </Section>

      <Section title="Typography">
        <div>
          <label className="text-xs text-gray-500 block mb-1.5">Body Font</label>
          <select
            value={settings.typography.fontFamily.split(',')[0].trim()}
            onChange={e => applyFont('fontFamily', e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            {FONTS.map(f => <option key={f} value={f} className="bg-[#111]">{f}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1.5">Heading Font</label>
          <select
            value={settings.typography.headingFont.split(',')[0].trim()}
            onChange={e => applyFont('headingFont', e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            {FONTS.map(f => <option key={f} value={f} className="bg-[#111]">{f}</option>)}
          </select>
        </div>
        <SliderInput label="Base Font Size" value={parsePixels(settings.typography.baseFontSize)} min={12} max={24} unit="px"
          onChange={v => {
            updateSettings({ typography: { ...settings.typography, baseFontSize: `${v}px` } })
            sendMessage({ type: 'UPDATE_THEME', data: { typography: { ...settings.typography, baseFontSize: `${v}px` } } })
          }} />
      </Section>
    </>
  )
}

// ─── Text / Heading Panel ───────────────────────────────────────

function TextPanel({ elementKey, computed, iframeRef }: {
  elementKey: string
  computed: Record<string, string>
  iframeRef: React.RefObject<HTMLIFrameElement | null>
}) {
  const { updateStyle } = usePostMessage(iframeRef)
  const [align, setAlign] = useState(computed.textAlign || 'left')

  return (
    <>
      <Section title="Typography">
        <SliderInput label="Font Size"
          value={parsePixels(computed.fontSize || '16px')} min={10} max={96} unit="px"
          onChange={v => updateStyle(elementKey, { fontSize: `${v}px` }, 'Font size')} />

        <ColorInput label="Color"
          value={cssColorToHex(computed.color || '#000000')}
          onChange={v => updateStyle(elementKey, { color: v }, 'Text color')} />

        <div>
          <span className="text-xs text-gray-500 block mb-1.5">Alignment</span>
          <div className="flex gap-1">
            {[{ i: <AlignLeft size={13} />, v: 'left' }, { i: <AlignCenter size={13} />, v: 'center' },
              { i: <AlignRight size={13} />, v: 'right' }, { i: <AlignJustify size={13} />, v: 'justify' }]
              .map(a => (
                <button key={a.v}
                  onClick={() => { setAlign(a.v); updateStyle(elementKey, { textAlign: a.v }, 'Align') }}
                  className={`flex-1 p-2 rounded-lg transition-all ${align === a.v ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-500 hover:text-white'}`}>
                  {a.i}
                </button>
              ))}
          </div>
        </div>

        <div>
          <span className="text-xs text-gray-500 block mb-1.5">Style</span>
          <div className="flex gap-1">
            <button onClick={() => updateStyle(elementKey, { fontWeight: computed.fontWeight === 'bold' ? 'normal' : 'bold' }, 'Bold')}
              className={`flex-1 p-2 rounded-lg transition-all ${computed.fontWeight === 'bold' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-500 hover:text-white'}`}>
              <Bold size={13} className="mx-auto" />
            </button>
            <button onClick={() => updateStyle(elementKey, { fontStyle: computed.fontStyle === 'italic' ? 'normal' : 'italic' }, 'Italic')}
              className="flex-1 p-2 rounded-lg bg-white/5 text-gray-500 hover:text-white transition-all">
              <Italic size={13} className="mx-auto" />
            </button>
            <button onClick={() => updateStyle(elementKey, { textDecoration: computed.textDecoration === 'underline' ? 'none' : 'underline' }, 'Underline')}
              className={`flex-1 p-2 rounded-lg transition-all ${computed.textDecoration === 'underline' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-500 hover:text-white'}`}>
              <Underline size={13} className="mx-auto" />
            </button>
          </div>
        </div>

        <SliderInput label="Line Height"
          value={parsePixels(computed.lineHeight || '24px')} min={10} max={80} unit="px"
          onChange={v => updateStyle(elementKey, { lineHeight: `${v}px` }, 'Line height')} />

        <SliderInput label="Letter Spacing"
          value={parsePixels(computed.letterSpacing || '0px')} min={-5} max={20} unit="px"
          onChange={v => updateStyle(elementKey, { letterSpacing: `${v}px` }, 'Letter spacing')} />
      </Section>

      <Section title="Background" defaultOpen={false}>
        <ColorInput label="Background"
          value={cssColorToHex(computed.backgroundColor || '#ffffff')}
          onChange={v => updateStyle(elementKey, { backgroundColor: v }, 'Background')} />
      </Section>

      <Section title="Spacing" defaultOpen={false}>
        <SliderInput label="Padding"
          value={parsePixels(computed.padding || '0px')} min={0} max={120} unit="px"
          onChange={v => updateStyle(elementKey, { padding: `${v}px` }, 'Padding')} />
      </Section>
    </>
  )
}

// ─── Image Panel ────────────────────────────────────────────────

function ImagePanel({ elementKey, computed, iframeRef, src, alt }: {
  elementKey: string
  computed: Record<string, string>
  iframeRef: React.RefObject<HTMLIFrameElement | null>
  src?: string
  alt?: string
}) {
  const { updateStyle, updateAttribute } = usePostMessage(iframeRef)
  const openGallery = useStudioStore(s => s.openGallery)
  const [objFit, setObjFit] = useState(computed.objectFit || 'cover')

  return (
    <>
      <Section title="Image Source">
        {src && (
          <div className="rounded-xl overflow-hidden border border-white/10 mb-2">
            <img src={src} alt={alt || ''} className="w-full h-28 object-cover" />
          </div>
        )}
        <button onClick={() => openGallery(url => updateAttribute(elementKey, { src: url }))}
          className="w-full py-2.5 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-400 text-xs font-bold rounded-xl transition-all">
          📂 Change from Gallery
        </button>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Alt Text</label>
          <input type="text" defaultValue={alt} placeholder="Describe this image…"
            onChange={e => updateAttribute(elementKey, { alt: e.target.value })}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500" />
        </div>
      </Section>

      <Section title="Display">
        <div>
          <span className="text-xs text-gray-500 block mb-1.5">Object Fit</span>
          <div className="grid grid-cols-3 gap-1">
            {['cover', 'contain', 'fill'].map(v => (
              <button key={v} onClick={() => { setObjFit(v); updateStyle(elementKey, { objectFit: v }, 'Object fit') }}
                className={`py-1.5 text-xs rounded-lg capitalize transition-all ${objFit === v ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-500 hover:text-white'}`}>
                {v}
              </button>
            ))}
          </div>
        </div>
        <SliderInput label="Border Radius"
          value={parsePixels(computed.borderRadius || '0px')} min={0} max={60} unit="px"
          onChange={v => updateStyle(elementKey, { borderRadius: `${v}px` }, 'Border radius')} />
      </Section>
    </>
  )
}

// ─── Button Panel ───────────────────────────────────────────────

function ButtonPanel({ elementKey, computed, iframeRef, href }: {
  elementKey: string
  computed: Record<string, string>
  iframeRef: React.RefObject<HTMLIFrameElement | null>
  href?: string
}) {
  const { updateStyle, updateAttribute } = usePostMessage(iframeRef)
  return (
    <>
      <Section title="Button Style">
        <ColorInput label="Background"
          value={cssColorToHex(computed.backgroundColor || '#6366f1')}
          onChange={v => updateStyle(elementKey, { backgroundColor: v }, 'Button bg')} />
        <ColorInput label="Text Color"
          value={cssColorToHex(computed.color || '#ffffff')}
          onChange={v => updateStyle(elementKey, { color: v }, 'Button text')} />
        <SliderInput label="Border Radius"
          value={parsePixels(computed.borderRadius || '12px')} min={0} max={50} unit="px"
          onChange={v => updateStyle(elementKey, { borderRadius: `${v}px` }, 'Border radius')} />
        <SliderInput label="Padding X"
          value={parsePixels(computed.paddingLeft || '24px')} min={0} max={80} unit="px"
          onChange={v => updateStyle(elementKey, { paddingLeft: `${v}px`, paddingRight: `${v}px` }, 'Padding X')} />
        <SliderInput label="Padding Y"
          value={parsePixels(computed.paddingTop || '12px')} min={0} max={40} unit="px"
          onChange={v => updateStyle(elementKey, { paddingTop: `${v}px`, paddingBottom: `${v}px` }, 'Padding Y')} />
      </Section>
      <Section title="Link" defaultOpen={false}>
        <div>
          <label className="text-xs text-gray-500 block mb-1">URL</label>
          <input type="text" defaultValue={href} placeholder="https://…"
            onChange={e => updateAttribute(elementKey, { href: e.target.value })}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500" />
        </div>
        <div className="flex gap-1">
          {[{ l: 'Same Tab', v: '_self' }, { l: 'New Tab', v: '_blank' }].map(t => (
            <button key={t.v} onClick={() => updateAttribute(elementKey, { target: t.v })}
              className="flex-1 py-1.5 text-xs bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-all">{t.l}</button>
          ))}
        </div>
      </Section>
    </>
  )
}

// ─── Layout Panel (section/div) ─────────────────────────────────

function LayoutPanel({ elementKey, computed, iframeRef }: {
  elementKey: string
  computed: Record<string, string>
  iframeRef: React.RefObject<HTMLIFrameElement | null>
}) {
  const { updateStyle } = usePostMessage(iframeRef)
  return (
    <>
      <Section title="Spacing">
        <SliderInput label="Padding" value={parsePixels(computed.padding || '0px')} min={0} max={120} unit="px"
          onChange={v => updateStyle(elementKey, { padding: `${v}px` }, 'Padding')} />
      </Section>
      <Section title="Background">
        <ColorInput label="Background"
          value={cssColorToHex(computed.backgroundColor || '#ffffff')}
          onChange={v => updateStyle(elementKey, { backgroundColor: v }, 'Background')} />
      </Section>
      <Section title="Visibility" defaultOpen={false}>
        <SliderInput label="Opacity"
          value={Math.round(parseFloat(computed.opacity || '1') * 100)} min={0} max={100} unit="%"
          onChange={v => updateStyle(elementKey, { opacity: `${v / 100}` }, 'Opacity')} />
      </Section>
    </>
  )
}

// ─── Flex Panel ─────────────────────────────────────────────────

function FlexPanel({ elementKey, computed, iframeRef }: {
  elementKey: string
  computed: Record<string, string>
  iframeRef: React.RefObject<HTMLIFrameElement | null>
}) {
  const { updateStyle } = usePostMessage(iframeRef)
  
  // Only show if it's actually flex or grid, or allow user to force it to flex
  const isFlex = computed.display === 'flex' || computed.display === 'inline-flex'
  const [display, setDisplay] = useState(computed.display || 'block')
  
  return (
    <Section title="Layout & Flexbox" defaultOpen={false}>
      <div>
        <span className="text-xs text-gray-500 block mb-1.5">Display</span>
        <div className="grid grid-cols-3 gap-1 mb-3">
          {['block', 'flex', 'inline-block'].map(v => (
            <button key={v} onClick={() => { setDisplay(v); updateStyle(elementKey, { display: v }, 'Display') }}
              className={`py-1.5 text-[10px] rounded-lg capitalize transition-all ${display === v ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-500 hover:text-white'}`}>
              {v.replace('inline-block', 'inline')}
            </button>
          ))}
        </div>
      </div>

      {isFlex && (
        <>
          <div>
            <span className="text-xs text-gray-500 block mb-1.5">Direction</span>
            <div className="grid grid-cols-2 gap-1 mb-3">
              {['row', 'column'].map(v => (
                <button key={v} onClick={() => updateStyle(elementKey, { flexDirection: v }, 'Flex direction')}
                  className={`py-1.5 text-[10px] rounded-lg capitalize transition-all ${computed.flexDirection === v ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-500 hover:text-white'}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <span className="text-xs text-gray-500 block mb-1.5">Justify Content</span>
            <div className="grid grid-cols-3 gap-1 mb-3">
              {['flex-start', 'center', 'flex-end', 'space-between', 'space-around'].map(v => (
                <button key={v} onClick={() => updateStyle(elementKey, { justifyContent: v }, 'Justify')}
                  className={`py-1.5 text-[10px] rounded-lg capitalize transition-all ${computed.justifyContent === v ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-500 hover:text-white'}`}>
                  {v.replace('flex-', '').replace('space-', '')}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <span className="text-xs text-gray-500 block mb-1.5">Align Items</span>
            <div className="grid grid-cols-3 gap-1 mb-3">
              {['flex-start', 'center', 'flex-end', 'stretch'].map(v => (
                <button key={v} onClick={() => updateStyle(elementKey, { alignItems: v }, 'Align')}
                  className={`py-1.5 text-[10px] rounded-lg capitalize transition-all ${computed.alignItems === v ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-500 hover:text-white'}`}>
                  {v.replace('flex-', '')}
                </button>
              ))}
            </div>
          </div>
          
          <SliderInput label="Gap" value={parsePixels(computed.gap || '0px')} min={0} max={100} unit="px"
            onChange={v => updateStyle(elementKey, { gap: `${v}px` }, 'Gap')} />
        </>
      )}
    </Section>
  )
}


// ─── Advanced (Border + Shadow + Opacity) — all elements ───────

const SHADOW_PRESETS = [
  { label: 'None',   value: 'none' },
  { label: 'Soft',   value: '0 4px 24px rgba(0,0,0,0.08)' },
  { label: 'Medium', value: '0 8px 40px rgba(0,0,0,0.14)' },
  { label: 'Strong', value: '0 16px 64px rgba(0,0,0,0.22)' },
  { label: 'Inner',  value: 'inset 0 2px 8px rgba(0,0,0,0.12)' },
]

function AdvancedSection({ elementKey, computed, iframeRef }: {
  elementKey: string
  computed: Record<string, string>
  iframeRef: React.RefObject<HTMLIFrameElement | null>
}) {
  const { updateStyle } = usePostMessage(iframeRef)
  const [borderStyle, setBorderStyle] = useState(computed.borderStyle || 'none')

  return (
    <Section title="Border & Shadow" defaultOpen={false}>
      {/* Border */}
      <div>
        <span className="text-xs text-gray-500 block mb-1.5">Border Style</span>
        <div className="grid grid-cols-4 gap-1">
          {['none', 'solid', 'dashed', 'dotted'].map(s => (
            <button key={s} onClick={() => { setBorderStyle(s); updateStyle(elementKey, { borderStyle: s }, 'Border style') }}
              className={`py-1.5 text-[10px] rounded-lg capitalize transition-all ${borderStyle === s ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-500 hover:text-white'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>
      {borderStyle !== 'none' && (
        <>
          <SliderInput label="Border Width"
            value={parsePixels(computed.borderWidth || '1px')} min={1} max={12} unit="px"
            onChange={v => updateStyle(elementKey, { borderWidth: `${v}px` }, 'Border width')} />
          <ColorInput label="Border Color"
            value={cssColorToHex(computed.borderColor || '#e5e7eb')}
            onChange={v => updateStyle(elementKey, { borderColor: v }, 'Border color')} />
        </>
      )}
      <SliderInput label="Border Radius"
        value={parsePixels(computed.borderRadius || '0px')} min={0} max={60} unit="px"
        onChange={v => updateStyle(elementKey, { borderRadius: `${v}px` }, 'Border radius')} />

      {/* Shadow Presets */}
      <div>
        <span className="text-xs text-gray-500 block mb-1.5">Box Shadow</span>
        <div className="grid grid-cols-3 gap-1">
          {SHADOW_PRESETS.map(p => (
            <button key={p.label}
              onClick={() => updateStyle(elementKey, { boxShadow: p.value }, 'Box shadow')}
              className={`py-1.5 text-[10px] rounded-lg transition-all ${
                computed.boxShadow === p.value ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-500 hover:text-white'
              }`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Opacity */}
      <SliderInput label="Opacity"
        value={Math.round(parseFloat(computed.opacity || '1') * 100)} min={0} max={100} unit="%"
        onChange={v => updateStyle(elementKey, { opacity: `${v / 100}` }, 'Opacity')} />
    </Section>
  )
}

// ─── Main RightPanel ────────────────────────────────────────────

export default function RightPanel({ iframeRef }: RightPanelProps) {
  const selectedElement = useStudioStore(s => s.selectedElement)
  const setSelectedElement = useStudioStore(s => s.setSelectedElement)
  const aiOpen = useStudioStore(s => s.aiOpen)
  const setAiOpen = useStudioStore(s => s.setAiOpen)
  const { deleteElement, duplicateElement } = usePostMessage(iframeRef)

  const computed = selectedElement?.computedStyles ?? {}
  const type = selectedElement?.type

  // If AI is open, render the AI Generator inline
  if (aiOpen) {
    return (
      <aside className="w-72 bg-[#111] border-l border-white/5 flex flex-col overflow-hidden flex-shrink-0">
        <AIGenerator iframeRef={iframeRef} />
      </aside>
    )
  }

  return (
    <aside className="w-72 bg-[#111] border-l border-white/5 flex flex-col overflow-hidden flex-shrink-0 relative">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between flex-shrink-0">
        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
          {selectedElement ? 'Properties' : 'Site Settings'}
        </h3>
        
        <div className="flex items-center gap-1">
          {selectedElement && (
            <>
              <button onClick={() => duplicateElement(selectedElement.key)}
                title="Duplicate"
                className="p-1.5 text-gray-600 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                <Copy size={12} />
              </button>
              <button onClick={() => { deleteElement(selectedElement.key); setSelectedElement(null) }}
                title="Delete"
                className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                <Trash2 size={12} />
              </button>
              <div className="w-px h-3 bg-white/10 mx-1" />
            </>
          )}
          
          <button 
            onClick={() => setAiOpen(true)}
            title="Open Studio AI"
            className="px-2 py-1 text-indigo-400 hover:text-white hover:bg-indigo-600 hover:shadow-[0_0_15px_rgba(79,70,229,0.5)] rounded-lg transition-all group flex items-center gap-1.5"
          >
            <Sparkles size={14} className="group-hover:animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest">AI Studio</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {!selectedElement ? (
          <>
            {/* Empty state prompt */}
            <div className="flex flex-col items-center py-6 px-4 border-b border-white/5">
              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center mb-2">
                <MousePointer size={18} className="text-gray-600" />
              </div>
              <p className="text-gray-600 text-xs text-center">Click any element on the canvas to edit it</p>
            </div>
            {/* Global theme */}
            <GlobalThemePanel iframeRef={iframeRef} />
          </>
        ) : (
          <>
            {/* Element badge */}
            <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2 flex-shrink-0">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center">
                {type === 'text' || type === 'heading' ? <Type size={12} className="text-indigo-400" /> :
                 type === 'image' ? <ImageIcon size={12} className="text-indigo-400" /> :
                 type === 'button' ? <MousePointer size={12} className="text-indigo-400" /> :
                 <Square size={12} className="text-indigo-400" />}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white capitalize">{type}</p>
                <p className="text-[10px] text-gray-600 font-mono truncate">
                  {selectedElement.tagName} · {selectedElement.key?.slice(0, 10)}
                </p>
              </div>
            </div>

            {/* Dynamic panels by type */}
            {(type === 'text' || type === 'heading') && (
              <>
                <TextPanel elementKey={selectedElement.key} computed={computed} iframeRef={iframeRef} />
                <AdvancedSection elementKey={selectedElement.key} computed={computed} iframeRef={iframeRef} />
              </>
            )}
            {(type === 'image') && (
              <>
                <ImagePanel
                  elementKey={selectedElement.key}
                  computed={computed}
                  iframeRef={iframeRef}
                  src={selectedElement.src}
                  alt={selectedElement.alt}
                />
                <AdvancedSection elementKey={selectedElement.key} computed={computed} iframeRef={iframeRef} />
              </>
            )}
            {type === 'button' && (
              <>
                <ButtonPanel
                  elementKey={selectedElement.key}
                  computed={computed}
                  iframeRef={iframeRef}
                  href={selectedElement.href}
                />
                <AdvancedSection elementKey={selectedElement.key} computed={computed} iframeRef={iframeRef} />
              </>
            )}
            {(type === 'section' || type === 'div') && (
              <>
                <LayoutPanel elementKey={selectedElement.key} computed={computed} iframeRef={iframeRef} />
                <FlexPanel elementKey={selectedElement.key} computed={computed} iframeRef={iframeRef} />
                <AdvancedSection elementKey={selectedElement.key} computed={computed} iframeRef={iframeRef} />
              </>
            )}
          </>
        )}
      </div>
    </aside>
  )
}
