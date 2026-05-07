import { Product, Category } from '@/types';
import { supabase } from './supabase';

// ─── Mapping Helpers ──────────────────────────────────────────

function mapCategory(row: any): Category {
  return {
    ...row,
    searchKeywords: row.search_keywords,
    heroImage: row.hero_image,
    subSubCategories: row.sub_sub_categories,
  };
}

function mapProduct(row: any): Product {
  return {
    ...row,
    originalPrice: row.original_price,
    categorySlug: row.category_slug,
    reviewCount: row.review_count,
    isInStock: row.is_in_stock,
    stockCount: row.stock_count,
    viewersCount: row.viewers_count,
    recentPurchases: row.recent_purchases,
    recommendedWith: row.recommended_with,
    completeTheLook: row.complete_the_look,
  };
}

// ─── Category Helpers ─────────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return (data || []).map(mapCategory);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
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
}

// ─── Product Helpers ──────────────────────────────────────────

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return (data || []).map(mapProduct);
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
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
}

export async function getProductById(id: string): Promise<Product | null> {
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
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
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
}

export async function getRecommendedProducts(productId: string): Promise<Product[]> {
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
}
