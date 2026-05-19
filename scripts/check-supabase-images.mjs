import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

let supabaseUrl = '';
let supabaseAnonKey = '';

envContent.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
    supabaseUrl = line.split('=')[1].trim();
  }
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
    supabaseAnonKey = line.split('=')[1].trim();
  }
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

console.log('Supabase URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  // Check categories
  const { data: categories, error: catError } = await supabase.from('categories').select('name, slug, hero_image');
  if (catError) {
    console.error('Error fetching categories:', catError);
  } else {
    console.log('\n--- CATEGORIES IN SUPABASE ---');
    categories.forEach(c => {
      console.log(`- ${c.name} (${c.slug}): hero_image = "${c.hero_image}"`);
    });
  }

  // Check products
  const { data: products, error: prodError } = await supabase.from('products').select('name, slug, images').limit(10);
  if (prodError) {
    console.error('Error fetching products:', prodError);
  } else {
    console.log('\n--- PRODUCTS IN SUPABASE (First 10) ---');
    products.forEach(p => {
      console.log(`- ${p.name} (${p.slug}): images =`, p.images);
    });
  }
}

run();
