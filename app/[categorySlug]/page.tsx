import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getCategoryBySlug, getProductsByCategory, getAllCategories } from '@/lib/data';
import CategoryContent from './CategoryContent';
import categoriesData from '@/data/categories.json';
import productsData from '@/data/products.json';

// ─── Static Params for Blazing-Fast SSG ───────────────────────
export async function generateStaticParams() {
  try {
    const categories = await getAllCategories();
    if (categories.length > 0) {
      return categories.map((cat) => ({ categorySlug: cat.slug }));
    }
  } catch (e) {
    console.error('SSG Static Params Fallback to JSON');
  }
  
  // Fallback to local JSON
  return (categoriesData as any[]).map((cat) => ({ categorySlug: cat.slug }));
}

// ─── Dynamic SEO Metadata ──────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}): Promise<Metadata> {
  const { categorySlug } = await params;
  
  let category: any = null;
  try {
    category = await getCategoryBySlug(categorySlug);
  } catch (e) {}

  if (!category) {
    category = (categoriesData as any[]).find(c => c.slug === categorySlug);
  }

  if (!category) return { title: 'Category Not Found' };

  return {
    title: `${category.name} Collection | Azlaan`,
    description: category.description,
    openGraph: {
      title: `${category.name} Clothing | Azlaan Premium Collection`,
      description: category.description,
      images: [{ url: category.heroImage, width: 1200, height: 630 }],
    },
  };
}

// ─── Page Component (Server Component) ────────────────────────
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;
  
  let category: any = null;
  let products: any[] = [];

  try {
    category = await getCategoryBySlug(categorySlug);
    if (category) {
      products = await getProductsByCategory(categorySlug);
    }
  } catch (e) {
    console.error('Database connection failed, falling back to JSON');
  }

  // Robust Fallback to JSON
  if (!category) {
    category = (categoriesData as any[]).find(c => c.slug === categorySlug);
    if (!category) notFound();
    
    products = (productsData as any[]).filter(p => p.categorySlug === categorySlug);
  }

  return <CategoryContent category={category} initialProducts={products} />;
}
