'use client';
import CategoryNav from '@/components/CategoryNav';
import { motion } from 'framer-motion';

export default function AllCategoriesPage() {
  return (
    <main className="min-h-screen bg-black pt-24 md:pt-32">
      {/* Header Section */}
      <div className="px-6 md:px-12 lg:px-20 mb-12 md:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <span className="text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase text-white/50 mb-4 block">
            Azlaan Collections
          </span>
          <h1 className="font-sans text-4xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white leading-none">
            All Categories
          </h1>
          <div className="w-24 h-[1px] bg-white/20 mt-8 md:mt-12" />
        </motion.div>
      </div>

      {/* Categories List (Full) */}
      <CategoryNav showAll={true} />

      {/* Footer Spacer */}
      <div className="py-20 bg-black" />
    </main>
  );
}
