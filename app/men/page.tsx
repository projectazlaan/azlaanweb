import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getCategoryBySlug, getProductsByCategory } from '@/lib/data';
import CategoryContent from '@/app/[categorySlug]/CategoryContent';
import categoriesData from '@/data/categories.json';
import productsData from '@/data/products.json';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const categorySlug = 'men';
  let category: any = null;
  try {
    category = await getCategoryBySlug(categorySlug);
  } catch (e) {}
  if (!category) {
    category = (categoriesData as any[]).find(c => c.slug === categorySlug);
  }
  if (!category) return { title: 'Men Collection' };
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

export default async function MenCategoryPage() {
  const categorySlug = 'men';
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
  
  if (!category) {
    category = (categoriesData as any[]).find(c => c.slug === categorySlug);
    if (!category) notFound();
    products = (productsData as any[]).filter(p => p.categorySlug === categorySlug);
  }
  return <CategoryContent category={category} initialProducts={products} />;
}
