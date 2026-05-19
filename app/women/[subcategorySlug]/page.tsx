import { getCategoryBySlug, getProductsByCategory } from '@/lib/data';
import CategoryContent from '@/app/[categorySlug]/CategoryContent';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import categoriesData from '@/data/categories.json';
import productsData from '@/data/products.json';

interface SubCategoryPageProps {
  params: Promise<{
    subcategorySlug: string;
  }>;
}

function toSlug(str: string) {
  return str.toLowerCase().replace(/ /g, '-');
}

export async function generateStaticParams() {
  const categorySlug = 'women';
  const cat = (categoriesData as any[]).find(c => c.slug === categorySlug);
  if (!cat) return [];
  return cat.subcategories
    .filter((s: string) => s !== 'All')
    .map((s: string) => ({
      subcategorySlug: toSlug(s),
    }));
}

export async function generateMetadata({ params }: SubCategoryPageProps): Promise<Metadata> {
  const { subcategorySlug } = await params;
  const categorySlug = 'women';
  let category: any = null;
  try {
    category = await getCategoryBySlug(categorySlug);
  } catch (e) {}
  if (!category) {
    category = (categoriesData as any[]).find(c => c.slug === categorySlug);
  }
  if (!category) return { title: 'Not Found' };
  const originalSubName = (category.subcategories as string[]).find(
    (s) => toSlug(s) === subcategorySlug
  );
  return {
    title: originalSubName
      ? `${originalSubName} — ${category.name} | Azlaan`
      : `${category.name} | Azlaan`,
    description: `Explore the ${originalSubName ?? subcategorySlug} collection in ${category.name} at Azlaan.`,
  };
}

export default async function SubCategoryPage({ params }: SubCategoryPageProps) {
  const { subcategorySlug } = await params;
  const categorySlug = 'women';
  let category: any = null;
  let allCategoryProducts: any[] = [];
  try {
    category = await getCategoryBySlug(categorySlug);
    if (category) {
      allCategoryProducts = await getProductsByCategory(categorySlug);
    }
  } catch (e) {}
  
  if (!category) {
    category = (categoriesData as any[]).find(c => c.slug === categorySlug);
    if (!category) notFound();
    allCategoryProducts = (productsData as any[]).filter(p => p.categorySlug === categorySlug);
  }
  
  const originalSubName = (category.subcategories as string[]).find(
    (s) => toSlug(s) === subcategorySlug.toLowerCase()
  );
  if (!originalSubName) notFound();
  
  return (
    <CategoryContent
      category={category}
      initialProducts={allCategoryProducts}
      isSubcategoryPage={true}
      activeSubcategory={originalSubName}
    />
  );
}
