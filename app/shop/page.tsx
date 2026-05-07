'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Filter, SlidersHorizontal } from 'lucide-react';

const allProducts = [
  { id: 1, name: 'Premium Cotton Panjabi', nameBn: 'প্রিমিয়াম কটন পাঞ্জাবি', price: '৳8,500', image: '/media-pro/men/Design 1/649824908_122120770023151981_1372810042799937270_n.webp', category: 'Men', isNew: true },
  { id: 2, name: 'Classic Formal Suit', nameBn: 'ক্লাসিক ফরমাল স্যুট', price: '৳15,000', image: '/media-pro/men/Design 1/651882421_122120769999151981_8209666213684742551_n.webp', category: 'Men', isNew: false },
  { id: 3, name: 'Casual Short Kurta', nameBn: 'ক্যাজুয়াল শর্ট কুর্তা', price: '৳3,800', image: '/media-pro/men/Design 1/650656536_122120770035151981_5282848327082156297_n.webp', category: 'Men', isNew: true },
  { id: 7, name: 'Elegant Evening Dress', nameBn: 'বিশুদ্ধ ইভিনিং ড্রেস', price: '৳9,800', image: '/media-pro/women/Design 1/673191812_122125962327151981_8385571386878315506_n.webp', category: 'Women', isNew: true },
  { id: 8, name: 'Silk Saree Premium', nameBn: 'সিল্ক শাড়ি প্রিমিয়াম', price: '৳12,500', image: '/media-pro/women/Design 1/673949386_122125962357151981_1889495426070156223_n.webp', category: 'Women', isNew: false },
  { id: 13, name: 'Junior Premium Suit', nameBn: 'জুনিয়র প্রিমিয়াম স্যুট', price: '৳6,500', image: '/media-pro/women/Design 1/674438935_122125962423151981_7895183005361462477_n.webp', category: 'Kids', isNew: true },
  { id: 14, name: 'Kids Party Wear', nameBn: 'কিডস পার্টি ওয়্যার', price: '৳4,200', image: '/media-pro/men/Design 1/649824908_122120770023151981_1372810042799937270_n.webp', category: 'Kids', isNew: false },
];

export default function ShopPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const resolvedSearchParams = use(searchParams);
  const isBangla = resolvedSearchParams?.lang === 'bn'; 
  
  const [showFilters, setShowFilters] = useState(false);

  return (
    <main className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary">
            {isBangla ? 'সব পণ্য' : 'All Products'}
          </h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 px-4 py-2 border border-border-light rounded-full text-sm cursor-pointer"
          >
            <Filter className="w-4 h-4" />
            {isBangla ? 'ফিল্টার' : 'Filters'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          <div className={`${showFilters ? 'block' : 'hidden'} md:block col-span-1 bg-white p-5 md:p-6 rounded-2xl h-fit`}>
            <h3 className="font-bold mb-4 text-primary">{isBangla ? 'ফিল্টার' : 'Filters'}</h3>
            
            <div className="mb-6">
              <h4 className="font-semibold text-sm mb-2 text-primary">{isBangla ? 'ক্যাটেগরি' : 'Category'}</h4>
              {['Men', 'Women', 'Kids'].map((cat) => (
                <label key={cat} className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-secondary focus:ring-secondary" />
                  <span className="text-sm">{isBangla ? (cat === 'Men' ? 'পুরুষ' : cat === 'Women' ? 'নারী' : 'শিশু') : cat}</span>
                </label>
              ))}
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-sm mb-2 text-primary">{isBangla ? 'দাম' : 'Price'}</h4>
              {['Under ৳5,000', '৳5,000 - ৳10,000', 'Above ৳10,000'].map((price) => (
                <label key={price} className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-secondary focus:ring-secondary" />
                  <span className="text-sm">{price}</span>
                </label>
              ))}
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-sm mb-2 text-primary">Size</h4>
              {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                <label key={size} className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-secondary focus:ring-secondary" />
                  <span className="text-sm">{size}</span>
                </label>
              ))}
            </div>

            <button
              onClick={() => setShowFilters(false)}
              className="md:hidden w-full bg-secondary text-white py-2 rounded-full text-sm cursor-pointer"
            >
              {isBangla ? 'ফিল্টার প্রয়োগ করুন' : 'Apply Filters'}
            </button>
          </div>

          <div className="md:col-span-3">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <p className="text-sm text-text-muted">{allProducts.length} {isBangla ? 'টি পণ্য' : 'products'}</p>
              <select className="px-3 py-2 border border-border-light rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer">
                <option>{isBangla ? 'নতুন' : 'Newest'}</option>
                <option>{isBangla ? 'দাম: কম থেকে বেশি' : 'Price: Low to High'}</option>
                <option>{isBangla ? 'দাম: বেশি থেকে কম' : 'Price: High to Low'}</option>
              </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {allProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    {product.isNew && (
                      <span className="absolute top-2 left-2 bg-secondary text-white text-xs px-2 py-1 rounded-full">
                        {isBangla ? 'নতুন' : 'NEW'}
                      </span>
                    )}
                  </div>
                  <div className="p-3 md:p-4">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2 text-primary">
                      {isBangla ? product.nameBn : product.name}
                    </h3>
                    <p className="text-secondary font-bold text-sm">{product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
