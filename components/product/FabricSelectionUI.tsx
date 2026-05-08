'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Ruler, Waves, Scale, Scissors, 
  Info, Check, Plus, Minus 
} from 'lucide-react';
import { Product } from '@/types';
interface FabricSelectionUIProps {
  product: Product;
  onLengthChange: (length: number) => void;
}
export default function FabricSelectionUI({ product, onLengthChange }: FabricSelectionUIProps) {
  const [length, setLength] = useState(1);
  const [unit, setUnit] = useState<'meter' | 'yard'>('meter');
  const handleLengthChange = (val: number) => {
    const newLen = Math.max(0.5, Math.min(50, val));
    setLength(newLen);
    onLengthChange(newLen);
  };
  const specifications = [
    { label: 'Material', value: product.material || 'Premium Silk', icon: Waves },
    { label: 'Weight', value: `${product.gsm || 120} GSM`, icon: Scale },
    { label: 'Width', value: product.width || '44 Inch', icon: Ruler },
    { label: 'Texture', value: 'Smooth & Luxurious', icon: Info },
  ];
  const recommendations = [
    { label: 'Panjabi', length: 3 },
    { label: 'Formal Shirt', length: 2.5 },
    { label: 'Saree', length: 5.5 },
    { label: 'Suiting', length: 3.5 },
  ];
  return (
    <div className="space-y-10">
      {/* ── Fabric Specifications Grid ── */}
      <div className="grid grid-cols-2 gap-4">
        {specifications.map((spec) => (
          <div key={spec.label} className="bg-gray-50/50 border border-black/[0.03] p-4 rounded-2xl flex items-center gap-4 group hover:bg-white hover:shadow-xl hover:border-black/5 transition-all duration-500">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <spec.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-0.5">{spec.label}</p>
              <p className="text-xs font-bold text-primary">{spec.value}</p>
            </div>
          </div>
        ))}
      </div>
      {/* ── Length Selection ── */}
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40 mb-2">Select Length</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tighter">{length}</span>
              <div className="flex flex-col">
                <div className="flex bg-gray-100 rounded-lg p-1 scale-75 origin-left">
                  <button 
                    onClick={() => setUnit('meter')}
                    className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${unit === 'meter' ? 'bg-white shadow-sm text-primary' : 'text-black/40'}`}
                  >
                    Meters
                  </button>
                  <button 
                    onClick={() => setUnit('yard')}
                    className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${unit === 'yard' ? 'bg-white shadow-sm text-primary' : 'text-black/40'}`}
                  >
                    Yards
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 border border-black/5 rounded-2xl p-2">
            <button 
              onClick={() => handleLengthChange(length - 0.5)}
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-sm hover:bg-black hover:text-white transition-all active:scale-95"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="h-8 w-px bg-black/5 mx-2" />
            <button 
              onClick={() => handleLengthChange(length + 0.5)}
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-sm hover:bg-black hover:text-white transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* ── Slider UI ── */}
        <div className="relative h-2 bg-gray-100 rounded-full cursor-pointer group">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-primary rounded-full"
            style={{ width: `${(length / 10) * 100}%` }}
          />
          <input 
            type="range" 
            min="0.5" 
            max="10" 
            step="0.5" 
            value={length}
            onChange={(e) => handleLengthChange(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        {/* ── Recommendations ── */}
        <div className="flex flex-wrap gap-2">
          {recommendations.map((rec) => (
            <button 
              key={rec.label}
              onClick={() => handleLengthChange(rec.length)}
              className={`px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${length === rec.length ? 'bg-primary text-white border-primary shadow-lg' : 'border-black/5 text-black/40 hover:border-black/20 hover:text-primary'}`}
            >
              {rec.label} ({rec.length}m)
            </button>
          ))}
        </div>
      </div>
      {/* ── Total Cost Highlight ── */}
      <div className="bg-blue-600 rounded-[2rem] p-8 text-white relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Estimated Total</p>
          </div>
          <div className="flex items-baseline gap-3">
            <h2 className="text-5xl font-black tracking-tighter">৳{(product.price * length).toLocaleString()}</h2>
            <p className="text-xs font-bold opacity-60">Inclusive of all taxes</p>
          </div>
          <div className="mt-6 flex items-center gap-3">
             <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 flex items-center gap-2">
                <Check className="w-3.5 h-3.5" />
                <span className="text-[9px] font-black uppercase tracking-widest">Quality Guaranteed</span>
             </div>
             <button className="px-4 py-2 rounded-xl bg-white text-blue-600 flex items-center gap-2 hover:scale-105 transition-transform active:scale-95">
                <Scissors className="w-3.5 h-3.5" />
                <span className="text-[9px] font-black uppercase tracking-widest underline">Order Sample (৳150)</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
