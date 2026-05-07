import { getCategoryBySlug, getProductsByCategory, getAllCategories } from '@/lib/data';
import CategoryContent from '../CategoryContent';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import categoriesData from '@/data/categories.json';
import productsData from '@/data/products.json';

interface SubCategoryPageProps {
  params: Promise<{
    categorySlug: string;
    subcategorySlug: string;
  }>;
}

function toSlug(str: string) {
  return str.toLowerCase().replace(/ /g, '-');
}

// ─── Static Params ─────────────────────────────────────────────
export async function generateStaticParams() {
  const cats = categoriesData as Array<{ slug: string; subcategories: string[] }>;
  return cats.flatMap((cat) =>
    cat.subcategories
      .filter((s) => s !== 'All')
      .map((s) => ({
        categorySlug: cat.slug,
        subcategorySlug: toSlug(s),
      }))
  );
}

// ─── SEO Metadata ──────────────────────────────────────────────
export async function generateMetadata({ params }: SubCategoryPageProps): Promise<Metadata> {
  const { categorySlug, subcategorySlug } = await params;
  
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

// ─── Page Component ────────────────────────────────────────────
export default async function SubCategoryPage({ params }: SubCategoryPageProps) {
  const { categorySlug, subcategorySlug } = await params;
  
  let category: any = null;
  let allCategoryProducts: any[] = [];

  try {
    category = await getCategoryBySlug(categorySlug);
    if (category) {
      allCategoryProducts = await getProductsByCategory(categorySlug);
    }
  } catch (e) {}

  // Fallback
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
