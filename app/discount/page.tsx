import { getAllProducts } from '@/lib/data';
import DiscountClient from './DiscountClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Exclusive Sale | Azlaan',
  description: 'Discover exclusive markdown events and discounts on premium Panjabis, Kurtas, Sarees, and Luxury Pret.',
};

export default async function DiscountPage() {
  // Fetch all products on the server side for maximum performance and SEO
  const allProducts = await getAllProducts();
  
  // Isolate only the products that have an active discount
  const discountedProducts = allProducts.filter(p => p.originalPrice && p.originalPrice > p.price);
  
  return <DiscountClient initialProducts={discountedProducts} />;
}
