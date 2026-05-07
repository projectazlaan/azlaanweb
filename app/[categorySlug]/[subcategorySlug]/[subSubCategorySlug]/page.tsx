import { getCategoryBySlug, getProductsByCategory } from '@/lib/data';
import CategoryContent from '../../CategoryContent';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import categoriesData from '@/data/categories.json';

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
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return { title: 'Not Found' };

  const originalSubName = category.subcategories.find(
    (s) => toSlug(s) === subcategorySlug
  );
  const subSubList = originalSubName ? (category.subSubCategories?.[originalSubName] ?? []) : [];
  const originalSubSubName = subSubList.find((ss) => toSlug(ss) === subSubCategorySlug);

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
  const category = await getCategoryBySlug(categorySlug);

  if (!category) notFound();

  const originalSubName = category.subcategories.find(
    (s) => toSlug(s) === subcategorySlug.toLowerCase()
  );

  if (!originalSubName) notFound();

  const subSubList = category.subSubCategories?.[originalSubName] ?? [];
  const originalSubSubName = subSubList.find(
    (s) => toSlug(s) === subSubCategorySlug.toLowerCase()
  );

  if (!originalSubSubName) notFound();

  const allCategoryProducts = await getProductsByCategory(categorySlug);

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
