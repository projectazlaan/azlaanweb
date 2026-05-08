'use client';

import { motion } from 'framer-motion';
import { Save, Eye, ToggleLeft, ToggleRight, Pencil } from 'lucide-react';
import { useState } from 'react';

type Section = { id: string; label: string; value: string; type: 'text' | 'textarea' };

const INITIAL_SECTIONS: Section[] = [
  { id: 'hero_title', label: 'Homepage Hero Title', value: 'Define Your Style', type: 'text' },
  { id: 'hero_subtitle', label: 'Homepage Hero Subtitle', value: 'Premium Bangladeshi Ethnics. Crafted For the Modern World.', type: 'textarea' },
  { id: 'newsletter_title', label: 'Newsletter Banner Title', value: 'Register & Get Free Delivery.', type: 'text' },
  { id: 'newsletter_sub', label: 'Newsletter Subtitle', value: 'Join the Azlaan Inner Circle today and enjoy complimentary shipping on your first order.', type: 'textarea' },
  { id: 'collection_badge', label: 'New Collection Badge Text', value: 'New Collection', type: 'text' },
];

const TOGGLES = [
  { id: 'banner', label: 'Show "Free Delivery" Top Banner', default: true },
  { id: 'flash_badge', label: 'Show "Flash Sale" Badge on Products', default: false },
  { id: 'reels_section', label: 'Show Reels Section on Homepage', default: true },
  { id: 'vip_panel', label: 'Show Inner Circle Login Panel', default: true },
  { id: 'premier_early', label: 'Enable Premier Early Access', default: false },
];

export default function VisualBuilder() {
  const [sections, setSections] = useState(INITIAL_SECTIONS);
  const [editing, setEditing] = useState<string | null>(null);
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(TOGGLES.map(t => [t.id, t.default]))
  );
  const [saved, setSaved] = useState(false);

  const update = (id: string, value: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, value } : s));
  };

  const save = () => {
    setSaved(true);
    setEditing(null);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 pb-20">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Visual Builder</h2>
          <p className="text-gray-500 font-medium text-sm mt-1">Click any text to edit it live. Toggle sections on or off in one click.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 border border-gray-200 text-gray-700 px-5 py-3 rounded-full font-bold hover:bg-gray-50 transition-colors">
            <Eye className="w-5 h-5" /> Preview Site
          </button>
          <button onClick={save} className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-lg transition-all hover:scale-105 active:scale-95 ${saved ? 'bg-green-500 text-white' : 'bg-black text-white'}`}>
            <Save className="w-5 h-5" /> {saved ? 'Saved!' : 'Save All Changes'}
          </button>
        </div>
      </div>

      {/* Text Sections */}
      <div>
        <h3 className="font-black text-gray-700 text-sm uppercase tracking-widest mb-4 px-2">✏️ Text Content</h3>
        <div className="space-y-4">
          {sections.map((s, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}
              key={s.id}
              className={`bg-white rounded-[1.5rem] border-2 overflow-hidden shadow-sm transition-all ${editing === s.id ? 'border-blue-400 shadow-blue-100 shadow-md' : 'border-gray-100 hover:border-gray-200'}`}
            >
              <div className="p-5">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{s.label}</label>
                  <button
                    onClick={() => setEditing(editing === s.id ? null : s.id)}
                    className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${editing === s.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    <Pencil className="w-3 h-3" />
                    {editing === s.id ? 'Done' : 'Edit'}
                  </button>
                </div>
                {editing === s.id ? (
                  s.type === 'textarea' ? (
                    <textarea
                      autoFocus
                      value={s.value}
                      onChange={e => update(s.id, e.target.value)}
                      rows={3}
                      className="w-full border border-blue-200 rounded-xl px-4 py-3 outline-none text-gray-900 font-medium resize-none text-sm"
                    />
                  ) : (
                    <input
                      autoFocus
                      type="text"
                      value={s.value}
                      onChange={e => update(s.id, e.target.value)}
                      className="w-full border border-blue-200 rounded-xl px-4 py-3 outline-none text-gray-900 font-medium text-sm"
                    />
                  )
                ) : (
                  <p className="text-gray-800 font-medium text-sm leading-relaxed cursor-pointer" onClick={() => setEditing(s.id)}>
                    {s.value}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Section Toggles */}
      <div>
        <h3 className="font-black text-gray-700 text-sm uppercase tracking-widest mb-4 px-2">⚡ Section Controls</h3>
        <div className="space-y-3">
          {TOGGLES.map((t, index) => (
            <motion.div
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + index * 0.06 }}
              key={t.id}
              className="bg-white flex items-center justify-between p-5 rounded-[1.5rem] border border-gray-100 shadow-sm"
            >
              <div className="flex items-center gap-3">
                {toggles[t.id] ? <ToggleRight className="w-5 h-5 text-green-500" /> : <ToggleLeft className="w-5 h-5 text-gray-300" />}
                <span className="font-bold text-gray-800 text-sm">{t.label}</span>
              </div>
              <button
                onClick={() => setToggles({ ...toggles, [t.id]: !toggles[t.id] })}
                className={`relative w-14 h-7 rounded-full transition-colors ${toggles[t.id] ? 'bg-green-500' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition-transform shadow-sm ${toggles[t.id] ? 'translate-x-7' : 'translate-x-0'}`}></div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
