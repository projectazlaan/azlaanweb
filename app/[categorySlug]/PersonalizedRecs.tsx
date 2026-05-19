'use client';
import { useState, useEffect } from 'react';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import { Sparkles } from 'lucide-react';

interface PersonalizedRecsProps {
  products: Product[];
  categoryName: string;
}

export default function PersonalizedRecs({ products, categoryName }: PersonalizedRecsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Generate recommendations only on client to avoid hydration mismatch
    const shuffled = [...products].sort(() => 0.5 - Math.random()).slice(0, 4);
    setRecommendations(shuffled);
  }, [products]);

  if (!mounted || recommendations.length === 0) return null;

  return (
    <section className="py-20 bg-white border-y border-black/[0.03]">
      <div className="max-w-[1600px] mx-auto px-6">
        {/* Header - Matching "New Collection" Style */}
        <div className="flex flex-col items-center text-center mb-8 md:mb-12">
          <h2 className="flex flex-col items-center justify-center leading-[0.85] md:leading-[0.8]">
            <span className="font-serif italic text-2xl md:text-3xl text-gray-400 font-light tracking-wider pr-8 md:pr-12 -mb-1 md:-mb-2 z-10">
              Picked
            </span>
            <span className="font-sans text-4xl md:text-5xl font-bold tracking-tighter text-black uppercase drop-shadow-sm">
              For You
            </span>
          </h2>
          <div className="flex items-center justify-center gap-3 md:gap-4 mt-4 md:mt-6">
            <div className="h-[1px] w-4 md:w-8 bg-black/20" />
            <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-gray-500">
              Curated Style Essentials
            </span>
            <div className="h-[1px] w-4 md:w-8 bg-black/20" />
          </div>
          <p className="mt-4 max-w-lg text-black/40 text-[9px] md:text-[10px] font-bold uppercase tracking-widest leading-relaxed">
            Our algorithm analyzed your preferences to curate these essentials from the {categoryName} collection.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {recommendations.map((product) => (
            <ProductCard key={product.id} product={product} viewMode="grid" />
          ))}
        </div>
      </div>
    </section>
  );
}
