'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Play, Square, Clock } from 'lucide-react';
function pad(n: number) { return String(n).padStart(2, '0'); }
function Countdown({ endsAt }: { endsAt: Date }) {
  const [remaining, setRemaining] = useState(0);
  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, Math.floor((endsAt.getTime() - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt]);
  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;
  return (
    <div className="flex items-center gap-2">
      {[pad(h), pad(m), pad(s)].map((v, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="bg-black text-white font-black text-2xl px-3 py-2 rounded-xl min-w-[52px] text-center">{v}</span>
          {i < 2 && <span className="text-black font-black text-2xl">:</span>}
        </span>
      ))}
    </div>
  );
}
const PRESET_DURATIONS = [
  { label: '1 Hour', hours: 1 },
  { label: '3 Hours', hours: 3 },
  { label: '6 Hours', hours: 6 },
  { label: '12 Hours', hours: 12 },
  { label: '24 Hours', hours: 24 },
];
const PRESET_DISCOUNTS = [10, 15, 20, 25, 30, 50];
export default function FlashSalePage() {
  const [active, setActive] = useState(false);
  const [discount, setDiscount] = useState(20);
  const [duration, setDuration] = useState(6);
  const [endsAt, setEndsAt] = useState<Date | null>(null);
  const [message, setMessage] = useState('🔥 Flash Sale! Extra 20% OFF — Today Only!');
  const [saving, setSaving] = useState(false);
  const startSale = async () => {
    setSaving(true);
    const end = new Date(Date.now() + duration * 60 * 60 * 1000);
    setEndsAt(end);
    setActive(true);
    await fetch('/api/admin/site-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        flash_sale_active: 'true',
        flash_sale_pct: discount.toString(),
        flash_sale_ends: end.toISOString(),
        flash_sale_message: message
      })
    });
    setSaving(false);
  };
  const stopSale = async () => {
    setSaving(true);
    setActive(false);
    setEndsAt(null);
    await fetch('/api/admin/site-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        flash_sale_active: 'false',
        flash_sale_ends: ''
      })
    });
    setSaving(false);
  };
  return (
    <div className="space-y-8 pb-20 max-w-2xl mx-auto">
      {/* Header */}
      <div className={`p-6 rounded-[2rem] border transition-all ${active ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-100'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${active ? 'bg-orange-500' : 'bg-gray-100'}`}>
              <Zap className={`w-6 h-6 ${active ? 'text-white' : 'text-gray-400'}`} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">Flash Sale Engine</h2>
              <p className="text-sm font-bold mt-0.5">
                {active ? <span className="text-orange-600">🔴 LIVE — Sale is running</span> : <span className="text-gray-500">No active sale</span>}
              </p>
            </div>
          </div>
          {active && <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />}
        </div>
      </div>
      {/* Live Countdown */}
      {active && endsAt && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-black text-white p-8 rounded-[2rem] text-center space-y-4">
          <p className="text-orange-400 font-black uppercase tracking-widest text-sm">⚡ Sale Ends In</p>
          <Countdown endsAt={endsAt} />
          <p className="text-white/60 font-bold">{discount}% OFF on ALL products</p>
        </motion.div>
      )}
      {/* Config Card */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 space-y-8">
        {/* Discount % */}
        <div>
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-3">Discount Percentage</label>
          <div className="grid grid-cols-6 gap-2">
            {PRESET_DISCOUNTS.map(d => (
              <button key={d} onClick={() => setDiscount(d)} className={`py-3 rounded-2xl font-black text-sm transition-all ${discount === d ? 'bg-black text-white shadow-lg scale-105' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {d}%
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-3">
            <input
              type="range" min={5} max={70} step={5} value={discount}
              onChange={e => setDiscount(Number(e.target.value))}
              className="flex-1"
            />
            <span className="font-black text-2xl text-gray-900 min-w-[60px] text-right">{discount}%</span>
          </div>
        </div>
        {/* Duration */}
        <div>
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-3">Sale Duration</label>
          <div className="grid grid-cols-5 gap-2">
            {PRESET_DURATIONS.map(d => (
              <button key={d.hours} onClick={() => setDuration(d.hours)} className={`py-3 rounded-2xl font-black text-sm transition-all ${duration === d.hours ? 'bg-black text-white shadow-lg scale-105' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {d.label}
              </button>
            ))}
          </div>
        </div>
        {/* Banner Message */}
        <div>
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Announcement Message (shown on site)</label>
          <input
            type="text" value={message} onChange={e => setMessage(e.target.value)}
            className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-orange-400 text-gray-900 font-medium text-sm transition-colors"
          />
        </div>
        {/* Summary */}
        <div className="bg-gray-50 rounded-2xl p-5">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Preview</p>
          <div className="space-y-2 text-sm font-bold text-gray-700">
            <p>🎯 Discount: <span className="text-orange-600">{discount}% OFF all products</span></p>
            <p>⏱ Duration: <span className="text-blue-600">{duration} hour{duration > 1 ? 's' : ''}</span></p>
            <p>📢 Message: <span className="text-gray-900">"{message}"</span></p>
          </div>
        </div>
        {/* Action Buttons */}
        {!active ? (
          <button
            onClick={startSale}
            disabled={saving}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-black py-5 rounded-2xl shadow-[0_8px_24px_rgba(249,115,22,0.3)] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 text-lg"
          >
            <Zap className="w-6 h-6" />
            {saving ? 'Starting...' : `Start Flash Sale — ${discount}% OFF for ${duration}hrs`}
          </button>
        ) : (
          <button
            onClick={stopSale}
            disabled={saving}
            className="w-full bg-gray-900 hover:bg-black text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 text-lg"
          >
            <Square className="w-5 h-5" />
            {saving ? 'Stopping...' : 'Stop Flash Sale'}
          </button>
        )}
      </div>
    </div>
  );
}
