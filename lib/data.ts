// =============================================================
// lib/data.ts — Central Data Fetching Layer
// Supports both new Category Page system AND existing Admin APIs
// =============================================================

import { Product, Category } from '@/types';
import categoriesData from '@/data/categories.json';
import productsData from '@/data/products.json';

// ─── Category Helpers ─────────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
  return categoriesData as any[];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = categoriesData as any[];
  return categories.find((c) => c.slug === slug) ?? null;
}

// ─── Product Helpers ──────────────────────────────────────────

export async function getAllProducts(): Promise<Product[]> {
  return productsData as any[];
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.categorySlug === categorySlug.toLowerCase());
}

export async function getProductById(id: string): Promise<Product | null> {
  const all = await getAllProducts();
  return all.find((p) => p.id === id) ?? null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const all = await getAllProducts();
  return all.find((p) => p.slug === slug || p.id === slug) ?? null;
}

export async function getRecommendedProducts(productId: string): Promise<Product[]> {
  const all = await getAllProducts();
  const product = all.find(p => p.id === productId);
  if (!product || !product.recommendedWith) return [];
  return all.filter(p => product.recommendedWith?.includes(p.id));
}
