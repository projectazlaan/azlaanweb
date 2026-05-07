import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manually parse .env.local
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = Object.fromEntries(
  envFile.split('\n')
    .filter(line => line.includes('='))
    .map(line => line.split('=').map(part => part.trim()))
);

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase credentials in .env.local (Ensure SUPABASE_SERVICE_ROLE_KEY is present)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrate() {
  try {
    console.log('🚀 Starting Migration...');

    // 1. Read Categories
    const categoriesData = JSON.parse(fs.readFileSync('./data/categories.json', 'utf8'));
    console.log(`📦 Found ${categoriesData.length} categories. Uploading...`);
    
    const formattedCategories = categoriesData.map(c => ({
      name: c.name,
      slug: c.slug,
      description: c.description,
      subcategories: c.subcategories,
      filters: c.filters,
      search_keywords: c.searchKeywords,
      hero_image: c.heroImage,
      sub_sub_categories: c.subSubCategories
    }));

    const { error: catError } = await supabase.from('categories').upsert(formattedCategories, { onConflict: 'slug' });
    if (catError) throw catError;
    console.log('✅ Categories migrated successfully!');

    // 2. Read Products
    const productsData = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'));
    console.log(`🏷️ Found ${productsData.length} products. Uploading...`);

    const formattedProducts = productsData.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      original_price: p.originalPrice,
      images: p.images,
      category_slug: p.categorySlug,
      subcategory: p.subcategory,
      rating: p.rating,
      review_count: p.reviewCount,
      badge: p.badge,
      sizes: p.sizes,
      colors: p.colors,
      fabric: p.fabric,
      fit: p.fit,
      occasion: p.occasion,
      is_in_stock: p.isInStock,
      stock_count: p.stockCount,
      viewers_count: p.viewersCount,
      recent_purchases: p.recentPurchases,
      recommended_with: p.recommendedWith,
      complete_the_look: p.completeTheLook
    }));

    const { error: prodError } = await supabase.from('products').upsert(formattedProducts, { onConflict: 'id' });
    if (prodError) throw prodError;
    console.log('✅ Products migrated successfully!');

    console.log('\n✨ All data has been successfully moved to Supabase!');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  }
}

migrate();
