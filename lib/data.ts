import { Product, Category } from '@/types';
import { supabase } from './supabase';
import { unstable_cache as nextCache } from 'next/cache';
import { cache as reactCache } from 'react';

// ─── Mapping Helpers ──────────────────────────────────────────

function mapCategory(row: any): Category {
  return {
    ...row,
    name: row.name || '',
    slug: row.slug || '',
    description: row.description || '',
    nameBn: row.name_bn || row.name || '',
    descriptionBn: row.description_bn || row.description || '',
    subcategories: row.subcategories || [],
    filters: row.filters || { priceRange: true, rating: true },
    searchKeywords: row.search_keywords || [],
    heroImage: row.hero_image || '',
    subSubCategories: row.sub_sub_categories || {},
  };
}

function mapProduct(row: any): Product {
  return {
    ...row,
    name: row.name || 'Untitled Product',
    slug: row.slug || row.id || '',
    price: row.price || 0,
    images: row.images || [],
    originalPrice: row.original_price,
    categorySlug: row.category_slug || '',
    reviewCount: row.review_count || 0,
    rating: row.rating || 0,
    isInStock: row.is_in_stock ?? true,
    stockCount: row.stock_count || 0,
    viewersCount: row.viewers_count || 0,
    recentPurchases: row.recent_purchases || [],
    recommendedWith: row.recommended_with || [],
    completeTheLook: row.complete_the_look || { title: 'Complete the Look', items: [] },
  };
}

// ─── Category Helpers ─────────────────────────────────────────

export const getAllCategories = reactCache(async (): Promise<Category[]> => {
  return nextCache(
    async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
      return (data || []).map(mapCategory);
    },
    ['all-categories'],
    { revalidate: 3600, tags: ['categories'] }
  )();
});

export const getCategoryBySlug = reactCache(async (slug: string): Promise<Category | null> => {
  return nextCache(
    async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      
      if (error || !data) {
        if (error) console.error('Error fetching category:', error);
        return null;
      }
      return mapCategory(data);
    },
    [`category-${slug}`],
    { revalidate: 3600, tags: ['categories', `category-${slug}`] }
  )();
});

// ─── Product Helpers ──────────────────────────────────────────

export const getAllProducts = reactCache(async (): Promise<Product[]> => {
  return nextCache(
    async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching products:', error);
        return [];
      }
      return (data || []).map(mapProduct);
    },
    ['all-products'],
    { revalidate: 3600, tags: ['products'] }
  )();
});

export const getProductsByCategory = reactCache(async (categorySlug: string): Promise<Product[]> => {
  return nextCache(
    async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_slug', categorySlug.toLowerCase())
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching products by category:', error);
        return [];
      }
      return (data || []).map(mapProduct);
    },
    [`products-category-${categorySlug}`],
    { revalidate: 3600, tags: ['products', `category-${categorySlug}`] }
  )();
});

export const getProductById = reactCache(async (id: string): Promise<Product | null> => {
  return nextCache(
    async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error || !data) {
        if (error) console.error('Error fetching product by ID:', error);
        return null;
      }
      return mapProduct(data);
    },
    [`product-id-${id}`],
    { revalidate: 3600, tags: ['products', `product-${id}`] }
  )();
});

export const getProductBySlug = reactCache(async (slug: string): Promise<Product | null> => {
  return nextCache(
    async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`slug.eq."${slug}",id.eq."${slug}"`)
        .maybeSingle();
      
      if (error || !data) {
        if (error) console.error('Error fetching product by slug:', error);
        return null;
      }
      return mapProduct(data);
    },
    [`product-slug-${slug}`],
    { revalidate: 3600, tags: ['products', `product-slug-${slug}`] }
  )();
});

export const getRecommendedProducts = reactCache(async (productId: string): Promise<Product[]> => {
  return nextCache(
    async () => {
      const product = await getProductById(productId);
      if (!product || !product.recommendedWith || product.recommendedWith.length === 0) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('id', product.recommendedWith);
      
      if (error) {
        console.error('Error fetching recommended products:', error);
        return [];
      }
      return (data || []).map(mapProduct);
    },
    [`recommended-${productId}`],
    { revalidate: 3600, tags: ['products', `recommended-${productId}`] }
  )();
});
