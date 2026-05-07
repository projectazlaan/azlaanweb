import HeroSection from '@/components/HeroSection';
import CategorySection from '@/components/CategorySection';
import FeaturedProducts from '@/components/FeaturedProducts';
import BrandStory from '@/components/BrandStory';
import Testimonials from '@/components/Testimonials';
import Newsletter from '@/components/Newsletter';
import StudioRenderer from '@/components/StudioRenderer';
import { getDb } from '@/lib/db';

export default async function HomePage() {
  // Fetch data on the server for maximum speed
  const db = getDb();
  const products = db.prepare('SELECT * FROM products').all();
  const heroData = db.prepare('SELECT * FROM hero').get();

  return (
    <div className="min-h-screen">
      {/* Studio Pro V12 — apply saved styles to live site */}
      <StudioRenderer pageKey="homepage" />
      
      <div data-customizer-key="HeroSection" className="mt-[-72px] md:mt-[-80px]">
        <HeroSection initialHero={heroData} />
      </div>
      <div data-customizer-key="CategorySection">
        <CategorySection />
      </div>
      
      <div className="space-y-8 md:space-y-12">
        <div data-customizer-key="FeaturedProducts">
          <FeaturedProducts initialProducts={products} />
        </div>
        <div data-customizer-key="BrandStory"><BrandStory /></div>
        <div data-customizer-key="Testimonials"><Testimonials /></div>
        <div data-customizer-key="Newsletter"><Newsletter /></div>
      </div>
    </div>
  );
}
