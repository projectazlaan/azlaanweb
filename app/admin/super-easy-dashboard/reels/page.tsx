'use client';

import { motion } from 'framer-motion';
import { Link2, Flame, Trash2, GripVertical, Plus } from 'lucide-react';
import { useState } from 'react';

const INITIAL_REELS = [
  { id: 1, title: 'Eid Collection 2025', link: 'https://youtube.com/watch?v=demo1', platform: 'YouTube', views: '24K', trending: true },
  { id: 2, title: 'Behind The Scenes', link: 'https://facebook.com/videos/demo2', platform: 'Facebook', views: '12K', trending: false },
  { id: 3, title: 'Summer Linen Drop', link: 'https://youtube.com/watch?v=demo3', platform: 'YouTube', views: '8K', trending: false },
];

export default function ReelsHub() {
  const [reels, setReels] = useState(INITIAL_REELS);
  const [newLink, setNewLink] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [adding, setAdding] = useState(false);

  const addReel = () => {
    if (!newLink || !newTitle) return;
    const isYT = newLink.includes('youtube');
    setReels([{ id: Date.now(), title: newTitle, link: newLink, platform: isYT ? 'YouTube' : 'Facebook', views: '0', trending: false }, ...reels]);
    setNewLink(''); setNewTitle(''); setAdding(false);
  };

  const toggleTrending = (id: number) => setReels(reels.map(r => r.id === id ? { ...r, trending: !r.trending } : r));
  const deleteReel = (id: number) => setReels(reels.filter(r => r.id !== id));

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Cinema / Reels Hub</h2>
          <p className="text-gray-500 font-medium text-sm mt-1">Paste a YouTube or Facebook link — it goes live instantly.</p>
        </div>
        <button
          onClick={() => setAdding(!adding)}
          className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-full font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5" /> Add New Reel
        </button>
      </div>

      {/* Add Reel Form */}
      {adding && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-[2rem] shadow-sm border border-blue-100">
          <h3 className="font-bold text-gray-900 mb-6 text-lg">📎 Add a New Video</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Video title (e.g. Eid Collection 2025)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-blue-400 text-gray-900 font-medium transition-colors"
            />
            <div className="relative">
              <Link2 className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="url"
                placeholder="Paste YouTube or Facebook video link..."
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 pl-14 outline-none focus:border-blue-400 text-gray-900 font-medium transition-colors"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={addReel} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-colors">
                ✅ Add to Site
              </button>
              <button onClick={() => setAdding(false)} className="px-6 border border-gray-200 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Reels List */}
      <div className="space-y-4">
        {reels.map((reel, index) => (
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.08 }}
            key={reel.id}
            className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-gray-100 flex items-center gap-4 group hover:shadow-md transition-all"
          >
            {/* Drag Handle */}
            <GripVertical className="w-5 h-5 text-gray-300 cursor-grab flex-shrink-0 group-hover:text-gray-500 transition-colors" />

            {/* Thumbnail Placeholder */}
            <div className={`w-20 h-14 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-2xl font-bold ${reel.platform === 'YouTube' ? 'bg-red-600' : 'bg-blue-700'}`}>
              {reel.platform === 'YouTube' ? '▶' : 'f'}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 truncate">{reel.title}</h3>
              <p className="text-sm text-gray-500 font-medium truncate mt-0.5">{reel.link}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs font-bold text-gray-400">{reel.platform}</span>
                <span className="text-xs font-bold text-gray-400">👁 {reel.views} views</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => toggleTrending(reel.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${reel.trending ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500 hover:bg-orange-50 hover:text-orange-500'}`}
              >
                <Flame className="w-4 h-4" />
                {reel.trending ? 'Trending' : 'Set Trending'}
              </button>
              <button onClick={() => deleteReel(reel.id)} className="p-2 rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
