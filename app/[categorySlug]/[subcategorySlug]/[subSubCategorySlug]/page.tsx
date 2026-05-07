import { getCategoryBySlug, getProductsByCategory } from '@/lib/data';
import CategoryContent from '../../CategoryContent';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import categoriesData from '@/data/categories.json';
import productsData from '@/data/products.json';

interface SubSubCategoryPageProps {
  params: Promise<{
    categorySlug: string;
    subcategorySlug: string;
    subSubCategorySlug: string;
  }>;
}

function toSlug(str: string) {
  return str.toLowerCase().replace(/ /g, '-');
}

// ─── Static Params ─────────────────────────────────────────────
export async function generateStaticParams() {
  const cats = (categoriesData as unknown) as Array<{
    slug: string;
    subcategories: string[];
    subSubCategories?: Record<string, string[]>;
  }>;

  return cats.flatMap((cat) =>
    cat.subcategories
      .filter((s) => s !== 'All')
      .flatMap((sub) => {
        const subSubs = cat.subSubCategories?.[sub] ?? [];
        return subSubs
          .filter((ss) => ss !== 'All')
          .map((ss) => ({
            categorySlug: cat.slug,
            subcategorySlug: toSlug(sub),
            subSubCategorySlug: toSlug(ss),
          }));
      })
  );
}

// ─── SEO Metadata ──────────────────────────────────────────────
export async function generateMetadata({ params }: SubSubCategoryPageProps): Promise<Metadata> {
  const { categorySlug, subcategorySlug, subSubCategorySlug } = await params;
  
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
  const subSubList = originalSubName ? (category.subSubCategories?.[originalSubName] ?? []) : [];
  const originalSubSubName = (subSubList as string[]).find((ss) => toSlug(ss) === subSubCategorySlug);

  return {
    title: originalSubSubName
      ? `${originalSubSubName} ${originalSubName} — ${category.name} | Azlaan`
      : `${category.name} | Azlaan`,
    description: `Shop ${originalSubSubName ?? subSubCategorySlug} in the ${originalSubName ?? subcategorySlug} collection at Azlaan.`,
  };
}

// ─── Page Component ────────────────────────────────────────────
export default async function SubSubCategoryPage({ params }: SubSubCategoryPageProps) {
  const { categorySlug, subcategorySlug, subSubCategorySlug } = await params;
  
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

  const subSubList = (category.subSubCategories?.[originalSubName] as string[]) ?? [];
  const originalSubSubName = subSubList.find(
    (s) => toSlug(s) === subSubCategorySlug.toLowerCase()
  );

  if (!originalSubSubName) notFound();

  return (
    <CategoryContent
      category={category}
      initialProducts={allCategoryProducts}
      isSubcategoryPage={true}
      activeSubcategory={originalSubName}
      activeSubSubCategory={originalSubSubName}
    />
  );
}
