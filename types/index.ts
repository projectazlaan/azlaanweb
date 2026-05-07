// =============================================================
// Azlaan Category Page — Central Type Definitions
// =============================================================

export interface Category {
  name: string;
  nameBn: string;
  slug: string;
  description: string;
  descriptionBn: string;
  heroImage: string;
  subcategories: string[];
  subSubCategories?: Record<string, string[]>; // Mapping: subcat -> sub-subcats
  filters: FilterConfig;
  searchKeywords: string[];
}

export interface FilterConfig {
  size?: string[];
  color?: string[];
  fabric?: string[];
  fit?: string[];
  occasion?: string[];
  silhouette?: string[];
  material?: string[];
  weight?: string[];
  texture?: string[];
  width?: string[];
  priceRange: boolean;
  rating: boolean;
}

export interface Product {
  id: string;
  name: string;
  nameBn?: string;
  slug: string;
  price: number;
  priceDisplay?: string;
  originalPrice?: number;
  images: string[];
  image?: string; // fallback
  category?: string; // legacy support
  categoryBn?: string;
  categorySlug: string;
  subcategory?: string;
  subSubCategory?: string;
  description?: string;
  descriptionBn?: string;
  rating: number;
  reviewCount: number;
  badge?: string;
  badgeText?: string;
  sizes?: string[];
  colors?: { name: string; value: string }[];
  fabric?: string;
  fit?: string;
  occasion?: string;
  silhouette?: string;
  isInStock: boolean;
  stockCount: number;
  viewersCount?: number;
  recentPurchases?: { name: string; timeAgo: string }[];
  offerEndsAt?: string;
  installmentMonths?: number;
  saveAmount?: number;
  matchingRules?: {
    requiredCategory: string;
    preferredSubcategories: string[];
    colorMatch: string;
    autoBundleDiscount?: number;
  };
  recommendedWith?: string[];
  completeTheLook?: {
    title: string;
    items: { productId: string; type: string; discount: number }[];
  };
  material?: string;
  gsm?: number;
  width?: string;
  isSoldByLength?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FilterState {
  subcategory: string;
  subSubCategory: string; // New: Filter for sub-sub
  size: string[];
  color: string[];
  fabric: string[];
  fit: string[];
  occasion: string[];
  silhouette: string[];
  minPrice: number;
  maxPrice: number;
  rating: number;
}

export interface SortOption {
  label: string;
  labelBn: string;
  value: 'price_asc' | 'price_desc' | 'rating_desc' | 'newest';
}

export type ViewMode = 'grid' | 'list';

export type Language = 'en' | 'bn';
