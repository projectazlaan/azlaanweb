import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getRecommendedProducts, getAllProducts } from '@/lib/data';
import ProductPageContent from './ProductPageContent';
import productsData from '@/data/products.json';
export async function generateStaticParams() {
  try {
    const products = await getAllProducts();
    if (products.length > 0) {
      return products.map((p) => ({ productSlug: p.slug }));
    }
  } catch (e) {}
  return (productsData as any[]).map((p) => ({ productSlug: p.slug || p.id?.toString() }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}): Promise<Metadata> {
  const { productSlug } = await params;
  let product: any = null;
  try {
    product = await getProductBySlug(productSlug);
  } catch (e) {}
  if (!product) {
    product = (productsData as any[]).find(p => p.slug === productSlug || p.id?.toString() === productSlug);
  }
  if (!product) return { title: 'Product Not Found' };
  return {
    title: `${product.name} | Azlaan Luxury`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.images[0] }],
    },
  };
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}) {
  const { productSlug } = await params;
  let product: any = null;
  let recommended: any[] = [];
  try {
    product = await getProductBySlug(productSlug);
    if (product) {
      recommended = await getRecommendedProducts(product.id);
    }
  } catch (e) {}
  if (!product) {
    product = (productsData as any[]).find(p => p.slug === productSlug || p.id?.toString() === productSlug);
    if (!product) notFound();
    // Simple recommended fallback
    recommended = (productsData as any[]).filter(p => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, 4);
  }
  return <ProductPageContent product={product} recommended={recommended} />;
}
