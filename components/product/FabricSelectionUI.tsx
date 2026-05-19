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
    const newLen = Math.max(0.5, Math.min(10, val));
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
      <div className="grid grid-cols-2 gap-3.5">
        {specifications.map((spec) => (
          <div key={spec.label} className="bg-neutral-50/60 border border-neutral-100 p-4 rounded-xl flex items-center gap-4 transition-all duration-300 hover:bg-neutral-50">
            <div className="w-9 h-9 rounded-lg bg-white border border-neutral-100 flex items-center justify-center text-neutral-800 shadow-sm shrink-0">
              <spec.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[8px] font-bold uppercase tracking-widest text-neutral-400 mb-0.5">{spec.label}</p>
              <p className="text-xs font-semibold text-neutral-800">{spec.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Dynamic Visual Ruler ── */}
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-2">Select Fabric Length</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-light tracking-tight font-serif text-neutral-900">{length}</span>
              <div className="flex flex-col">
                <div className="flex bg-neutral-100 rounded-lg p-0.5 scale-90 origin-left border border-neutral-200">
                  <button 
                    onClick={() => setUnit('meter')}
                    className={`px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all ${unit === 'meter' ? 'bg-white shadow-sm text-neutral-950' : 'text-neutral-400'}`}
                  >
                    Meters
                  </button>
                  <button 
                    onClick={() => setUnit('yard')}
                    className={`px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all ${unit === 'yard' ? 'bg-white shadow-sm text-neutral-950' : 'text-neutral-400'}`}
                  >
                    Yards
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-200 rounded-xl p-1 shadow-inner">
            <button 
              onClick={() => handleLengthChange(length - 0.5)}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-neutral-100 shadow-sm hover:bg-neutral-950 hover:text-white transition-all active:scale-95"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <div className="h-6 w-px bg-neutral-200 mx-1" />
            <button 
              onClick={() => handleLengthChange(length + 0.5)}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-neutral-100 shadow-sm hover:bg-neutral-950 hover:text-white transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── Mechanical Sliding Ruler UI (The WOW Factor) ── */}
        <div className="relative bg-neutral-50 border border-neutral-100 rounded-2xl p-6 overflow-hidden select-none shadow-sm">
          {/* Center Indicator needle */}
          <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-neutral-950 z-20 shadow-[0_0_8px_rgba(0,0,0,0.15)] rounded-full" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-neutral-950 z-20 rounded-full border border-white shadow-sm" />
          
          <div className="relative h-16 w-full overflow-hidden mt-1">
            <motion.div 
              className="absolute flex items-end gap-[16px] h-full"
              animate={{ x: `calc(50% - ${(length - 0.5) * 36}px - 8px)` }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
            >
              {/* ticks from 0.5 to 10.0 with 0.5 intervals */}
              {Array.from({ length: 20 }, (_, i) => {
                const val = 0.5 + i * 0.5;
                const isWhole = val % 1 === 0;
                const isSelected = length === val;
                return (
                  <div 
                    key={val} 
                    onClick={() => handleLengthChange(val)}
                    className="flex flex-col items-center justify-end h-full cursor-pointer w-[16px] group shrink-0"
                  >
                    <span className={`text-[9px] font-mono tracking-tighter mb-2.5 transition-all duration-300 ${
                      isSelected 
                        ? 'text-neutral-950 font-bold scale-110' 
                        : 'text-neutral-300 group-hover:text-neutral-500'
                    }`}>
                      {isWhole ? `${val}.0` : `${val}`}
                    </span>
                    <div className={`w-[1px] rounded-full transition-all duration-300 ${
                      isSelected 
                        ? 'h-8 bg-neutral-950 w-[2px]' 
                        : isWhole 
                          ? 'h-6 bg-neutral-300 group-hover:bg-neutral-400' 
                          : 'h-4 bg-neutral-200 group-hover:bg-neutral-300'
                    }`} />
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* ── Recommendations ── */}
        <div className="flex flex-wrap gap-2 mt-4">
          {recommendations.map((rec) => {
            const isSelected = length === rec.length;
            return (
              <button 
                key={rec.label}
                onClick={() => handleLengthChange(rec.length)}
                className={`relative px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${
                  isSelected 
                    ? 'bg-neutral-950 text-white shadow-sm' 
                    : 'bg-neutral-50 border border-neutral-100 text-neutral-400 hover:text-neutral-800 hover:border-neutral-300'
                }`}
              >
                {rec.label} ({rec.length}m)
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Estimated Total obsidian glass container ── */}
      <div className="bg-neutral-950 rounded-2xl p-8 text-white relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full" />
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] opacity-60">Estimated Total</p>
          </div>
          <div className="flex items-baseline gap-3">
            <h2 className="text-4xl font-medium tracking-tight font-serif">৳{(product.price * length).toLocaleString()}</h2>
            <p className="text-[10px] opacity-50 uppercase font-semibold tracking-wider">Inclusive of all taxes</p>
          </div>
          <div className="mt-6 flex items-center gap-3">
             <div className="px-3.5 py-1.5 rounded-lg bg-white/10 border border-white/15 flex items-center gap-1.5">
                <Check className="w-3 h-3 text-neutral-300" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-200">Quality Guaranteed</span>
             </div>
             <button className="px-3.5 py-1.5 rounded-lg bg-white text-neutral-950 flex items-center gap-1.5 hover:bg-neutral-50 transition-colors active:scale-[0.98]">
                <Scissors className="w-3 h-3 text-neutral-900" />
                <span className="text-[8px] font-bold uppercase tracking-widest">Order Sample (৳150)</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
