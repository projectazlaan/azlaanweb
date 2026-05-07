import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getCategoryBySlug, getProductsByCategory, getAllCategories } from '@/lib/data';
import CategoryContent from './CategoryContent';

// ─── Static Params for Blazing-Fast SSG ───────────────────────
export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((cat) => ({ categorySlug: cat.slug }));
}

// ─── Dynamic SEO Metadata ──────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);
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
  const category = await getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const products = await getProductsByCategory(categorySlug);

  return <CategoryContent category={category} initialProducts={products} />;
}
