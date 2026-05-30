import dynamic from 'next/dynamic';
import HomeHeroSection from '@/components/HomeHeroSection';
import CategoryNav from '@/components/CategoryNav';
import StudioRenderer from '@/components/StudioRenderer';
import { getDb } from '@/lib/db';
import ScrollReveal from '@/components/ScrollReveal';

// Dynamic imports for performance optimization (Sub-3s load)
const ReelsPanel = dynamic(() => import('@/components/ReelsPanel'));
const FeaturedProducts = dynamic(() => import('@/components/FeaturedProducts'));
const BrandStory = dynamic(() => import('@/components/BrandStory'));
const Testimonials = dynamic(() => import('@/components/Testimonials'));
const Newsletter = dynamic(() => import('@/components/Newsletter'));
const NewCollection = dynamic(() => import('@/components/NewCollection'));
const PromoBanner = dynamic(() => import('@/components/PromoBanner'));

export default async function HomePage() {
  // Fetch data on the server for maximum speed
  // Fetch only necessary data for initial render
  const db = getDb();
  const products = db.prepare('SELECT * FROM products LIMIT 50').all();
  const heroData = db.prepare('SELECT * FROM hero').get();
  const settings = db.prepare('SELECT * FROM settings').get() as any;
  return (
    <div className="min-h-screen relative">
      {/* Studio Pro V12 — apply saved styles to live site */}
      <StudioRenderer pageKey="homepage" />
      
      {/* Sticky Hero Section */}
      <div className="sticky top-0 h-screen z-0 overflow-hidden">
        <div data-customizer-key="HeroSection" className="h-full">
          <HomeHeroSection initialHero={heroData} />
        </div>
      </div>

      {/* Overlapping Content Container */}
      <div className="relative z-10 bg-white">
        <CategoryNav showAll={false} />
        
        <div data-customizer-key="NewCollection">
          <NewCollection />
        </div>

        <ScrollReveal direction="none">
          <div data-customizer-key="PromoBanner">
            <PromoBanner settings={settings?.promoBanner} />
          </div>
        </ScrollReveal>

        {/* Watch & Buy Section */}
        <ScrollReveal>
          <div id="watch-and-buy" data-customizer-key="WatchAndBuy" className="bg-white">
            <ReelsPanel />
          </div>
        </ScrollReveal>

        <div className="space-y-8 md:space-y-12">
          <ScrollReveal>
            <div data-customizer-key="FeaturedProducts">
              <FeaturedProducts initialProducts={products} />
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div data-customizer-key="BrandStory"><BrandStory /></div>
          </ScrollReveal>
          <ScrollReveal>
            <div data-customizer-key="Testimonials"><Testimonials /></div>
          </ScrollReveal>
          <ScrollReveal>
            <div data-customizer-key="Newsletter"><Newsletter /></div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}

