import { registerComponent } from './component-registry'

export const COMPONENT_CONFIGS = {
  navbar: {
    key: 'Navbar',
    name: 'Navigation Bar',
    nameBn: 'ন্যাভিগেশন বার',
    category: 'layout',
    description: 'Main site navigation with logo and menu links',
    descriptionBn: 'লোগো এবং মেনু লিংক সহ প্রধান সাইট ন্যাভিগেশন',
    customizableFields: [
      { key: 'logo', label: 'Logo Text', labelBn: 'লোগো টেক্সট', type: 'text', defaultValue: 'Azlaan' },
      { key: 'transparent', label: 'Transparent Background', labelBn: 'স্বচ্ছ পটভূমি', type: 'toggle', defaultValue: false },
    ],
  },
  heroSection: {
    key: 'HeroSection',
    name: 'Hero Section',
    nameBn: 'হিরো সেকশন',
    category: 'hero',
    description: 'Full-screen hero with background image and CTAs',
    descriptionBn: 'পটভূমি ইমেজ এবং সিটিএ সহ ফুল-স্ক্রিন হিরো',
    customizableFields: [
      { key: 'title', label: 'Headline', labelBn: 'শিরোনাম', type: 'textarea', defaultValue: '' },
      { key: 'subtitle', label: 'Subtitle', labelBn: 'উপশিরোনাম', type: 'text', defaultValue: '' },
      { key: 'description', label: 'Description', labelBn: 'বিবরণ', type: 'textarea', defaultValue: '' },
      { key: 'cta1Text', label: 'Primary Button Text', labelBn: 'প্রাথমিক বাটন টেক্সট', type: 'text', defaultValue: 'Shop Now' },
      { key: 'cta2Text', label: 'Secondary Button Text', labelBn: 'সেকেন্ডারি বাটন টেক্সট', type: 'text', defaultValue: 'Learn More' },
      { key: 'bgImage', label: 'Background Image', labelBn: 'পটভূমি ইমেজ', type: 'image', defaultValue: '' },
    ],
  },
  categorySection: {
    key: 'CategorySection',
    name: 'Category Grid',
    nameBn: 'ক্যাটাগরি গ্রিড',
    category: 'products',
    description: 'Display product categories in a grid layout',
    descriptionBn: 'গ্রিড লেআউটে প্রোডাক্ট ক্যাটাগরি প্রদর্শন',
    customizableFields: [
      { key: 'columns', label: 'Number of Columns', labelBn: 'কলাম সংখ্যা', type: 'select', defaultValue: 3, options: [
        { value: '2', label: '2 Columns', labelBn: '২ কলাম' },
        { value: '3', label: '3 Columns', labelBn: '৩ কলাম' },
        { value: '4', label: '4 Columns', labelBn: '৪ কলাম' },
      ]},
    ],
  },
  featuredProducts: {
    key: 'FeaturedProducts',
    name: 'Featured Products',
    nameBn: 'ফিচারড প্রোডাক্টস',
    category: 'products',
    description: 'Showcase featured products in a grid',
    descriptionBn: 'গ্রিডে ফিচারড প্রোডাক্ট প্রদর্শন',
    customizableFields: [
      { key: 'title', label: 'Section Title', labelBn: 'সেকশন শিরোনাম', type: 'text', defaultValue: '' },
      { key: 'subtitle', label: 'Section Subtitle', labelBn: 'সেকশন উপশিরোনাম', type: 'text', defaultValue: '' },
      { key: 'productsCount', label: 'Number of Products', labelBn: 'প্রোডাক্ট সংখ্যা', type: 'number', defaultValue: 4 },
      { key: 'columns', label: 'Columns', labelBn: 'কলাম', type: 'select', defaultValue: 4, options: [
        { value: '2', label: '2', labelBn: '২' },
        { value: '3', label: '3', labelBn: '৩' },
        { value: '4', label: '4', labelBn: '৪' },
      ]},
    ],
  },
  brandStory: {
    key: 'BrandStory',
    name: 'Brand Story',
    nameBn: 'ব্র্যান্ড স্টোরি',
    category: 'content',
    description: 'Brand story section with image and text',
    descriptionBn: 'ইমেজ এবং টেক্সট সহ ব্র্যান্ড স্টোরি সেকশন',
    customizableFields: [
      { key: 'title', label: 'Title', labelBn: 'শিরোনাম', type: 'text', defaultValue: 'Our Story' },
      { key: 'content', label: 'Content', labelBn: 'কন্টেন্ট', type: 'textarea', defaultValue: '' },
      { key: 'image', label: 'Image', labelBn: 'ইমেজ', type: 'image', defaultValue: '' },
    ],
  },
  testimonials: {
    key: 'Testimonials',
    name: 'Testimonials',
    nameBn: 'টেস্টিমোনিয়ালস',
    category: 'content',
    description: 'Customer testimonials carousel',
    descriptionBn: 'গ্রাহক টেস্টিমোনিয়াল ক্যারাউজেল',
    customizableFields: [
      { key: 'title', label: 'Section Title', labelBn: 'সেকশন শিরোনাম', type: 'text', defaultValue: 'What Our Customers Say' },
      { key: 'showRating', label: 'Show Rating', labelBn: 'রেটিং দেখান', type: 'toggle', defaultValue: true },
    ],
  },
  newsletter: {
    key: 'Newsletter',
    name: 'Newsletter Signup',
    nameBn: 'নিউজলেটার সাইনআপ',
    category: 'marketing',
    description: 'Email newsletter subscription form',
    descriptionBn: 'ইমেইল নিউজলেটার সাবস্ক্রিপশন ফর্ম',
    customizableFields: [
      { key: 'title', label: 'Title', labelBn: 'শিরোনাম', type: 'text', defaultValue: 'Subscribe to Our Newsletter' },
      { key: 'subtitle', label: 'Subtitle', labelBn: 'উপশিরোনাম', type: 'text', defaultValue: 'Get the latest updates on new products and upcoming sales' },
      { key: 'buttonText', label: 'Button Text', labelBn: 'বাটন টেক্সট', type: 'text', defaultValue: 'Subscribe' },
    ],
  },
  footer: {
    key: 'Footer',
    name: 'Footer',
    nameBn: 'ফুটার',
    category: 'layout',
    description: 'Site footer with links and contact info',
    descriptionBn: 'লিংক এবং যোগাযোগ তথ্য সহ সাইট ফুটার',
    customizableFields: [
      { key: 'showSocial', label: 'Show Social Links', labelBn: 'সোশ্যাল লিংক দেখান', type: 'toggle', defaultValue: true },
      { key: 'showNewsletter', label: 'Show Newsletter', labelBn: 'নিউজলেটার দেখান', type: 'toggle', defaultValue: true },
    ],
  },
}

export function registerAllComponents() {
  const components = [
    { config: COMPONENT_CONFIGS.navbar, path: '@/components/Navbar' },
    { config: COMPONENT_CONFIGS.heroSection, path: '@/components/HeroSection' },
    { config: COMPONENT_CONFIGS.categorySection, path: '@/components/CategorySection' },
    { config: COMPONENT_CONFIGS.featuredProducts, path: '@/components/FeaturedProducts' },
    { config: COMPONENT_CONFIGS.brandStory, path: '@/components/BrandStory' },
    { config: COMPONENT_CONFIGS.testimonials, path: '@/components/Testimonials' },
    { config: COMPONENT_CONFIGS.newsletter, path: '@/components/Newsletter' },
    { config: COMPONENT_CONFIGS.footer, path: '@/components/Footer' },
  ]

  return components
}