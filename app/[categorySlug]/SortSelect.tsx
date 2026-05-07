'use client';

import { useCategoryStore } from '@/store/categoryStore';
import { SortOption } from '@/types';
import { ArrowUpDown } from 'lucide-react';

const SORT_OPTIONS: SortOption[] = [
  { label: 'Newest', labelBn: 'নতুন', value: 'newest' },
  { label: 'Price: Low → High', labelBn: 'দাম: কম থেকে বেশি', value: 'price_asc' },
  { label: 'Price: High → Low', labelBn: 'দাম: বেশি থেকে কম', value: 'price_desc' },
  { label: 'Top Rated', labelBn: 'সর্বোচ্চ রেটিং', value: 'rating_desc' },
];

export default function SortSelect() {
  const { sortBy, setSortBy } = useCategoryStore();

  return (
    <div className="relative flex items-center group">
      <div className="flex items-center transition-colors">
        <ArrowUpDown className="w-3.5 h-3.5 text-black/40 group-hover:text-black transition-colors" />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption['value'])}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
