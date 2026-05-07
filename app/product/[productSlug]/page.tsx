import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getRecommendedProducts, getAllProducts } from '@/lib/data';
import ProductPageContent from './ProductPageContent';

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ productSlug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}): Promise<Metadata> {
  const { productSlug } = await params;
  const product = await getProductBySlug(productSlug);
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
  const product = await getProductBySlug(productSlug);
  if (!product) notFound();

  const recommended = await getRecommendedProducts(product.id);

  return <ProductPageContent product={product} recommended={recommended} />;
}
