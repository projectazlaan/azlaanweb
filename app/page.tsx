import dynamic from 'next/dynamic';
import HeroSection from '@/components/HeroSection';
import CategoryNav from '@/components/CategoryNav';
import StudioRenderer from '@/components/StudioRenderer';
import { getDb } from '@/lib/db';

// Dynamic imports for performance optimization (Sub-3s load)
const ReelsPanel = dynamic(() => import('@/components/ReelsPanel'));
const FeaturedProducts = dynamic(() => import('@/components/FeaturedProducts'));
const BrandStory = dynamic(() => import('@/components/BrandStory'));
const Testimonials = dynamic(() => import('@/components/Testimonials'));
const Newsletter = dynamic(() => import('@/components/Newsletter'));
const NewCollection = dynamic(() => import('@/components/NewCollection'));

export default async function HomePage() {
  // Fetch data on the server for maximum speed
  // Fetch only necessary data for initial render
  const db = getDb();
  const products = db.prepare('SELECT * FROM products LIMIT 50').all();
  const heroData = db.prepare('SELECT * FROM hero').get();
  return (
    <div className="min-h-screen relative">
      {/* Studio Pro V12 — apply saved styles to live site */}
      <StudioRenderer pageKey="homepage" />
      
      {/* Sticky Hero Section */}
      <div className="sticky top-0 h-screen z-0 overflow-hidden">
        <div data-customizer-key="HeroSection" className="h-full">
          <HeroSection initialHero={heroData} />
        </div>
      </div>

      {/* Overlapping Content Container */}
      <div className="relative z-10 bg-white">
        <CategoryNav showAll={false} />
        
        <div data-customizer-key="NewCollection">
          <NewCollection />
        </div>

        {/* Watch & Buy Section */}
        <div data-customizer-key="WatchAndBuy" className="bg-white">
          <ReelsPanel />
        </div>

        <div className="space-y-8 md:space-y-12 pb-20">
          <div data-customizer-key="FeaturedProducts">
            <FeaturedProducts initialProducts={products} />
          </div>
          <div data-customizer-key="BrandStory"><BrandStory /></div>
          <div data-customizer-key="Testimonials"><Testimonials /></div>
          <div data-customizer-key="Newsletter"><Newsletter /></div>
        </div>
      </div>
    </div>
  );
}

