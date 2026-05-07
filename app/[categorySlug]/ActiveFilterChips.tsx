'use client';

import { X } from 'lucide-react';
import { useCategoryStore } from '@/store/categoryStore';

export default function ActiveFilterChips() {
  const { filters, removeFilter, clearAllFilters } = useCategoryStore();

  const chips: { label: string; onRemove: () => void }[] = [];

  // Subcategory chip is removed as it's managed by the FilterBar
  filters.size.forEach((s) => chips.push({ label: `Size: ${s}`, onRemove: () => removeFilter('size', s) }));
  filters.color.forEach((c) => chips.push({ label: `Color: ${c}`, onRemove: () => removeFilter('color', c) }));
  filters.fabric.forEach((f) => chips.push({ label: `Fabric: ${f}`, onRemove: () => removeFilter('fabric', f) }));
  filters.fit.forEach((f) => chips.push({ label: `Fit: ${f}`, onRemove: () => removeFilter('fit', f) }));
  filters.occasion.forEach((o) => chips.push({ label: `Occasion: ${o}`, onRemove: () => removeFilter('occasion', o) }));
  if (filters.rating > 0) {
    chips.push({ label: `${filters.rating}★+`, onRemove: () => removeFilter('rating') });
  }
  if (filters.maxPrice < 50000) {
    chips.push({
      label: `Under ৳${filters.maxPrice.toLocaleString()}`,
      onRemove: () => removeFilter('maxPrice'),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap pb-3 pt-1">
      {chips.map((chip, i) => (
        <span
          key={i}
          className="flex items-center gap-1.5 bg-black text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
        >
          {chip.label}
          <button onClick={chip.onRemove} className="hover:opacity-70 transition-opacity">
            <X className="w-2.5 h-2.5" />
          </button>
        </span>
      ))}
      {chips.length > 1 && (
        <button
          onClick={clearAllFilters}
          className="text-[9px] font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors ml-1"
        >
          Clear All
        </button>
      )}
    </div>
  );
}
