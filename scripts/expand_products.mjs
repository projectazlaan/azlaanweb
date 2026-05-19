import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load .env.local variables manually without external package
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const parts = trimmed.split('=');
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
      process.env[key] = val;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in .env.local!");
  process.exit(1);
}

// Create Supabase client using Service Role Key to bypass RLS and allow writes
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Define categories and their standardized subcategories
const categoriesFile = path.resolve(process.cwd(), 'data/categories.json');
const productsFile = path.resolve(process.cwd(), 'data/products.json');

const categories = JSON.parse(fs.readFileSync(categoriesFile, 'utf8'));
const products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));

// Helper to select standardized subcategories
const subcatMapping = {
  // Men mapping
  'men': {
    'Panjabi': 'Panjabi',
    'Premium Panjabi': 'Panjabi',
    'Classic Kurtas': 'Classic Kurtas',
    'Formal Shirts': 'Formal Shirts',
    'Chino Pants': 'Chino Pants',
    'Casual Edit': 'Casual Edit',
    'Wedding Edition': 'Panjabi', // map to Panjabi
    'Boys Panjabi': 'Panjabi'
  },
  // Women mapping
  'women': {
    'Luxury Pret': 'Luxury Pret',
    'Festive Collection': 'Luxury Pret',
    'Ready to Wear': 'Luxury Pret',
    'Exclusive': 'Luxury Pret',
    'Unstitched': 'Unstitched',
    'Unstitched Luxury Lawn': 'Unstitched',
    'Saree': 'Saree',
    'Bridal': 'Bridal',
    'Bridal Couture': 'Bridal',
    'Signature Series': 'Signature Series'
  },
  // Fabric mapping
  'fabric': {
    'Premium Silk': 'Premium Silk',
    'Luxury Cotton': 'Luxury Cotton',
    'Imported Linen': 'Imported Linen',
    'Designer Wool': 'Designer Wool',
    'Traditional Weaves': 'Traditional Weaves'
  }
};

// Clean up existing products to match categorySlug and standardized subcategories
const cleanedProducts = products.map(product => {
  const cat = product.categorySlug ? product.categorySlug.toLowerCase() : '';
  if (subcatMapping[cat]) {
    const sub = product.subcategory || '';
    if (subcatMapping[cat][sub]) {
      product.subcategory = subcatMapping[cat][sub];
    } else {
      // Default fallback to first non-'All' subcategory
      const firstValid = categories.find(c => c.slug === cat)?.subcategories.filter(s => s !== 'All')[0];
      product.subcategory = firstValid || product.subcategory;
    }
  }
  return product;
});

// Image pools for generating realistic mock cards
const imagesPool = {
  men: [
    "/media-pro/men/Design 1/649824908_122120770023151981_1372810042799937270_n.webp",
    "/media-pro/men/Design 1/651882421_122120769999151981_8209666213684742551_n.webp",
    "/media-pro/men/Design 1/650656536_122120770035151981_5282848327082156297_n.webp",
    "/media-pro/men/Design 2/651189502_122120775753151981_1115542629474834714_n.webp",
    "/media-pro/men/Design 2/649776456_122120775735151981_894663234632234790_n.webp",
    "/media-pro/men/Design 3/653700998_122121217251151981_4193321662627524387_n.webp",
    "/media-pro/men/Design 3/650030190_122121217221151981_4107622559203671909_n.webp",
    "/media-pro/men/Design 4/649658069_122120816709151981_7050745970883469671_n.webp",
    "/media-pro/men/Design 4/650135481_122120816691151981_3237423457649921454_n.webp",
    "/media-pro/men/Design 5/650905571_122120824035151981_4320891712881698677_n.webp",
    "/media-pro/men/Design 5/650488805_122120824017151981_3969776055903278431_n.webp",
    "/media-pro/men/Design 6/650061703_122120930277151981_1200600818769491462_n.webp",
    "/media-pro/men/Design 6/650709212_122120930289151981_4243578912510908876_n.webp",
    "/media-pro/men/Design 11/650770969_122120920443151981_7419337193691681295_n.webp",
    "/media-pro/men/Design 14/651337020_122121225477151981_322056965429338679_n.webp"
  ],
  women: [
    "/media-pro/women/Design 1/673191812_122125962327151981_8385571386878315506_n.webp",
    "/media-pro/women/Design 1/674438935_122125962423151981_7895183005361462477_n.webp",
    "/media-pro/women/Design 1/673949386_122125962357151981_1889495426070156223_n.webp",
    "/media-pro/women/Design 2/672121181_122125885095151981_7790861692313383598_n.webp",
    "/media-pro/women/Design 2/672681309_122125885053151981_339987484088257108_n.webp",
    "/media-pro/women/Design 2/671639040_122125885023151981_7657790961365514375_n.webp",
    "/media-pro/women/Design 2/671858259_122125885173151981_8012706557340946160_n.webp",
    "/media-pro/women/Design 3/670896434_122125960101151981_3029998908890020858_n.webp",
    "/media-pro/women/Design 3/671853622_122125960077151981_4116438312044612288_n.webp"
  ],
  fabric: [
    "/media-pro/cover/cover 2.jpg",
    "/media-pro/cover/cover 1.jpg",
    "/media-pro/cover/cover 3.jpg",
    "/media-pro/cover/cover 4.jpg",
    "/media-pro/women/Design 1/673191812_122125962327151981_8385571386878315506_n.webp",
    "/media-pro/women/Design 1/674438935_122125962423151981_7895183005361462477_n.webp",
    "/media-pro/men/Design 1/650656536_122120770035151981_5282848327082156297_n.webp",
    "/media-pro/men/Design 5/650905571_122120824035151981_4320891712881698677_n.webp"
  ]
};

// Subcategory premium titles builder
const namesPool = {
  // Men
  'Panjabi': [
    "Maharaja Heritage Panjabi", "Viceroy Brocade Silk Panjabi", "Royal Gold Zari Panjabi",
    "Giza Cotton Elegance Panjabi", "Mughal Oudh Fine Silk Panjabi", "Imperial Ivory Wash & Wear Panjabi",
    "Signature Embroidered Eid Panjabi", "Midnight Shadow Premium Panjabi", "Sartorial Silk Blend Panjabi"
  ],
  'Classic Kurtas': [
    "Ivory Herringbone Linen Kurta", "Slate Minimalist Slub Kurta", "Charcoal Luxe Summer Kurta",
    "Terracotta Cotton Slub Kurta", "Indigo Breeze Linen Kurta", "Oatmeal Melange Premium Kurta",
    "Midnight Silk Blend Kurta", "Forest Green Khadi Kurta", "Burgundy Twill Weave Kurta"
  ],
  'Formal Shirts': [
    "Giza 87 Double-Ply Dress Shirt", "Mayfair Satin Twill Tuxedo Shirt", "Italian Oxford Ice Blue Shirt",
    "Imperial Royal Micro-Check Shirt", "Sartorial Herringbone White Shirt", "Belgian Linen Summer Formal Shirt",
    "Midnight Satin Dinner Shirt", "Signature Navy Twill Shirt", "Classic Crimson Poplin Shirt"
  ],
  'Chino Pants': [
    "Chelsea Khaki Cotton Chinos", "Soho Midnight Navy Chinos", "Mayfair Sand Stretch Chinos",
    "Greenwich Forest Olive Chinos", "Tribeca Stone Grey Chinos", "Bespoke Charcoal Twill Chinos",
    "Richmond Tan Slim Fit Chinos", "Hampstead Burgundy Brushed Chinos", "Victoria Cream Twill Chinos"
  ],
  'Casual Edit': [
    "Linen Breeze Casual Shirt", "Classic Knit Mercerized Polo", "Sartorial Chambray Summer Shirt",
    "Indigo Wash Cotton Over-shirt", "Off-White Slub Woven Tee", "Crimson Linen Blend Polo",
    "Pima Knit Casual Crewneck", "Sage Summer Utility Shirt", "Midnight Indigo Denim Shirt"
  ],
  // Women
  'Luxury Pret': [
    "Orchid Blossom Organza Kaftan", "Golden Zari Silk Festive Kurta", "Ethereal Lavender Crepe Set",
    "Crimson Rose Silk Velvet Suit", "Royal Indigo Georgette Set", "Pastel Peony Chiffon Tunic",
    "Sage Meadow Handcrafted Pret", "Imperial Pearl Silk Kaftan", "Gilded Lace Organza Kurta"
  ],
  'Unstitched': [
    "Sovereign Linen 3-Piece Yardage", "Lustrous Mulberry Silk Suite", "Egyptian Lawn Fine Printed Set",
    "Real Gold Brocade Unstitched Set", "Emerald Silk Cotton Yardage", "Imperial Jacquard Lawn Set",
    "Chiffon Dupatta Summer Suit", "Artisanal Kantha Unstitched Set", "Handcrafted Indigo Block Print Suit"
  ],
  'Saree': [
    "Varanasi Golden Zari Saree", "Kanchipuram Heritage Silk Saree", "Banarasi Royal Brocade Saree",
    "Chanderi Pastel Summer Saree", "Gilded Organza Embroidered Saree", "Royal Indigo Jamdani Saree",
    "Crimson Satin Cocktail Saree", "Ethereal Georgette Zari Saree", "Atelier Handpainted Chiffon Saree"
  ],
  'Bridal': [
    "Empress Velvet Zardozi Lehenga", "Noor Jehan Gharara Ensemble", "Shehnai Royal Silk Lehenga",
    "Mughal Crimson Heritage Sharara", "Atelier Shimmering Gold Lehenga", "Ethereal Ivory Silk Anarkali",
    "Royal Blossom Hand-Embroidered Lehenga", "Princess Emerald Velvet Lehenga", "Ornate Zardozi Bridal Dupatta"
  ],
  'Signature Series': [
    "Atelier Heritage Artisan Silk Kaftan", "Royale Heritage Silk Kurta Set", "Limited Edition Pearl Organza Tunic",
    "Varanasi Handwoven Silk Kimono", "Midnight Brocade Special Collection", "Sartorial Gold Leaf Tunic",
    "Imperial Crimson Velvet Kaftan", "Royal Ivory Organza Masterpiece", "Premium Silk Dupatta Capsule"
  ],
  // Fabric
  'Premium Silk': [
    "Pure Mulberry Raw Silk Yardage", "Lustrous Satin Silk Fabric", "Atelier Silk Crepe de Chine",
    "Embroidered Brocade Silk Yardage", "Heavyweight Habotai Silk Fabric", "Gold Threaded Silk Brocade",
    "Printed Chiffon Silk Fabric", "Soft Tussar Silk Yardage", "Royal Satin Crepe Yardage"
  ],
  'Luxury Cotton': [
    "Super 120s Egyptian Cotton Weave", "Italian Pima Twill Cotton Fabric", "Supima Fine Weave Shirting",
    "Giza Satin Finish Premium Cotton", "Textured Slub Weave Cotton Yardage", "Irish Summer Poplin Fabric",
    "Double Mercerized Voile Cotton", "Organic Khadi Weave Fabric", "Sea Island Luxury Cotton Twill"
  ],
  'Imported Linen': [
    "Irish Heavyweight Sartorial Linen", "Belgian Summer Slub Linen Yardage", "Washed Pastel French Linen",
    "Textured Oatmeal Flax Linen", "Indigo Dyed Heavyweight Linen", "Premium Linen Cotton Blend Fabric",
    "Atelier Fine Weave White Linen", "Emerald Green Dress Linen", "Royal Burgundy Suit Linen"
  ],
  'Designer Wool': [
    "Merino Cashmere Premium Blend Wool", "English Herringbone Tweed Fabric", "Atelier Super 140s Worsted Wool",
    "Royal Cashmere Overcoating Wool", "Midnight Navy Wool Flannel Yardage", "Textured Alpaca Wool Blend",
    "Classic Grey Glen Plaid Wool", "Camel Hair Luxury Coat Fabric", "Worsted Wool Silk Blend Fabric"
  ],
  'Traditional Weaves': [
    "Handwoven Fine Jamdani Yardage", "Tangail Fine Cotton Brocade Weave", "Traditional Silver Zari Yardage",
    "Bespoke Khadi Handspun Weave", "Benarasi Katan Silk Yardage", "Handprinted Indigo Ajrakh Fabric",
    "Artisanal Ikat Cotton Weave", "Varanasi Silk Georgette Brocade", "Classic Block Print Cotton Fabric"
  ]
};

// Keep track of all generated items
const finalProductsList = [...cleanedProducts];

// Generate dynamic products for each subcategory until they reach at least 10 products
for (const catData of categories) {
  const catSlug = catData.slug;
  const subcats = catData.subcategories.filter(s => s !== 'All');
  
  for (const subcat of subcats) {
    const existing = finalProductsList.filter(p => p.categorySlug === catSlug && p.subcategory === subcat);
    console.log(`Category: ${catSlug} | Subcategory: ${subcat} | Existing count: ${existing.length}`);
    
    let needed = 10 - existing.length;
    if (needed > 0) {
      console.log(`Generating ${needed} mock products for ${catSlug} -> ${subcat}...`);
      
      const namesList = namesPool[subcat] || [];
      const imagesList = imagesPool[catSlug] || imagesPool.fabric;
      
      for (let i = 0; i < needed; i++) {
        const id = `p-gen-${catSlug}-${subcat.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${i}`;
        const name = namesList[i % namesList.length] || `${subcat} Masterpiece No. ${i + 1}`;
        const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;
        
        // Exquisite prices
        let price = 3000 + Math.floor(Math.random() * 5) * 500;
        if (catSlug === 'women') {
          if (subcat === 'Bridal') price = 30000 + Math.floor(Math.random() * 6) * 3000;
          else if (subcat === 'Saree') price = 12000 + Math.floor(Math.random() * 5) * 2000;
          else price = 5000 + Math.floor(Math.random() * 5) * 1000;
        } else if (catSlug === 'fabric') {
          price = 1500 + Math.floor(Math.random() * 5) * 300;
        }
        
        const originalPrice = Math.floor(price * 1.25);
        
        // Pick dynamic images
        const mainImage = imagesList[i % imagesList.length];
        const nextImage = imagesList[(i + 1) % imagesList.length];
        const images = [mainImage, nextImage];
        
        const generatedProduct = {
          id: id,
          name: name,
          slug: slug,
          price: price,
          originalPrice: originalPrice,
          images: images,
          image: mainImage,
          categorySlug: catSlug,
          subcategory: subcat,
          subSubCategory: 'All', // Default sub-sub filter
          rating: parseFloat((4.5 + Math.random() * 0.5).toFixed(1)),
          reviewCount: 15 + Math.floor(Math.random() * 80),
          isInStock: true,
          stockCount: 10 + Math.floor(Math.random() * 30),
          viewersCount: 20 + Math.floor(Math.random() * 60),
          sizes: catSlug === 'men' ? ["M", "L", "XL"] : (catSlug === 'women' ? ["S", "M", "L"] : ["Free Size"]),
          colors: [
            { name: "Royal Gold", value: "#D4AF37" },
            { name: "Classic Navy", value: "#000080" }
          ],
          fabric: catSlug === 'fabric' ? 'Premium Thread' : 'Premium Couture Textile',
          fit: catSlug === 'men' ? 'Tailored Fit' : 'Graceful Silhouette',
          isInStock: true
        };
        
        finalProductsList.push(generatedProduct);
      }
    }
  }
}

// Write the expanded list back to data/products.json
fs.writeFileSync(productsFile, JSON.stringify(finalProductsList, null, 2), 'utf8');
console.log("Successfully expanded and updated local products.json!");

// Map products to DB schema for Supabase
const dbProducts = finalProductsList.map(p => {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    original_price: p.originalPrice || null,
    images: p.images,
    category_slug: p.categorySlug,
    subcategory: p.subcategory,
    sub_sub_category: p.subSubCategory || 'All',
    rating: p.rating || 5.0,
    review_count: p.reviewCount || 0,
    is_in_stock: p.isInStock ?? true,
    stock_count: p.stockCount || 0,
    viewers_count: p.viewersCount || 0,
    recent_purchases: p.recentPurchases || [],
    recommended_with: p.recommendedWith || [],
    complete_the_look: p.completeTheLook || { title: 'Complete the Look', items: [] },
    sizes: p.sizes || [],
    colors: p.colors || [],
    fabric: p.fabric || null,
    fit: p.fit || null,
    occasion: p.occasion || null,
    silhouette: p.silhouette || null,
    material: p.material || null,
    weight: p.weight || null,
    texture: p.texture || null,
    width: p.width || null,
    is_sold_by_length: p.isSoldByLength || false
  };
});

// Upsert into Supabase database
console.log("Connecting to Supabase to upsert products list...");
const BATCH_SIZE = 30;
for (let j = 0; j < dbProducts.length; j += BATCH_SIZE) {
  const batch = dbProducts.slice(j, j + BATCH_SIZE);
  const { error } = await supabase
    .from('products')
    .upsert(batch, { onConflict: 'id' });
    
  if (error) {
    console.error(`Error uploading batch starting at index ${j}:`, error);
  } else {
    console.log(`Successfully uploaded batch starting at index ${j} (${batch.length} items)`);
  }
}

console.log("Supabase sync and expansion completed flawlessly!");
