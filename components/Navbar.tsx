'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu, ShoppingBag, ChevronDown, ArrowRight, User } from 'lucide-react';
import { useSidebar } from '@/context/SidebarContext';
import { useCartStore } from '@/store/cartStore';
import categoriesData from '@/data/categories.json';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const categories = (categoriesData as unknown) as Array<{
  name: string;
  slug: string;
  subcategories: string[];
  subSubCategories?: Record<string, string[]>;
  description?: string;
  heroImage?: string;
}>;

function toSlug(str: string) {
  return str.toLowerCase().replace(/ /g, '-');
}

export default function Navbar() {
  const { openSidebar } = useSidebar();
  const { itemsCount } = useCartStore();
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = (slug: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(slug);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 150);
  };

  const activeCategory = categories.find(c => c.slug === openMenu);

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/[0.05]"
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-7xl mx-auto flex items-center px-4 py-3 md:px-6 md:py-4 relative">
        
        {/* ── Left side (Mobile Profile & Cart) ── */}
        <div className="md:hidden flex items-center gap-1 -ml-2">
          <Link
            href="/account"
            className="p-2 rounded-full hover:bg-black/[0.04] transition-all group"
          >
            <User className="w-5 h-5 text-[#1D1D1F] group-hover:scale-110 transition-transform" />
          </Link>

          <Link
            href="/cart"
            className="p-2 rounded-full hover:bg-black/[0.04] transition-all relative group"
          >
            <ShoppingBag className="w-5 h-5 text-[#1D1D1F] group-hover:scale-110 transition-transform" />
            {itemsCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#0071E3] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemsCount}
              </span>
            )}
          </Link>
        </div>

        {/* ── Brand Logo (Centered on Mobile) ── */}
        <Link 
          href="/" 
          className="font-serif text-xl md:text-2xl font-bold text-[#1D1D1F] tracking-tight hover:opacity-70 transition-opacity
            absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0"
        >
          Azlaan
        </Link>

        {/* ── Desktop Navigation Triggers ── */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-10 lg:gap-12">
          {categories.map((cat) => {
            const isActive = pathname.startsWith(`/${cat.slug}`);
            const isHovered = openMenu === cat.slug;
            return (
              <div
                key={cat.slug}
                onMouseEnter={() => handleMouseEnter(cat.slug)}
                className="relative py-2"
              >
                <Link
                  href={`/${cat.slug}`}
                  className={`flex items-center gap-1.5 text-[13px] font-semibold tracking-wide uppercase transition-all duration-300
                    ${isActive || isHovered ? 'text-[#0071E3]' : 'text-[#1D1D1F]/70 hover:text-[#1D1D1F]'}`}
                >
                  {cat.name}
                  <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isHovered ? 'rotate-180' : ''}`} />
                </Link>
                
                {/* Active Indicator Line */}
                {(isActive || isHovered) && (
                  <motion.div 
                    layoutId="nav-active"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#0071E3] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </div>
            );
          })}
          
          {/* Static Link for Azlaan Cinema */}
          <div className="relative py-2">
            <Link
              href="/videos"
              className={`flex items-center gap-1.5 text-[13px] font-semibold tracking-wide uppercase transition-all duration-300
                ${pathname.startsWith('/videos') ? 'text-[#0071E3]' : 'text-[#1D1D1F]/70 hover:text-[#1D1D1F]'}`}
            >
              Cinema
            </Link>
            {pathname.startsWith('/videos') && (
              <motion.div 
                layoutId="nav-active"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#0071E3] rounded-full"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </div>

          <Link 
            href="/contact" 
            className={`text-[13px] font-semibold tracking-wide uppercase transition-colors
              ${pathname === '/contact' ? 'text-[#0071E3]' : 'text-[#1D1D1F]/70 hover:text-[#1D1D1F]'}`}
          >
            Contact
          </Link>
        </div>

        {/* ── Right side (Desktop: Icons | Mobile: Menu) ── */}
        <div className="flex items-center justify-end gap-1 md:gap-5 ml-auto">
          {/* Desktop Only Icons */}
          <Link
            href="/account"
            className="hidden md:flex p-2 rounded-full hover:bg-black/[0.04] transition-all group"
            title="Account"
          >
            <User className="w-5 h-5 text-[#1D1D1F] group-hover:scale-110 transition-transform" />
          </Link>

          <Link
            href="/cart"
            className="hidden md:flex p-2 rounded-full hover:bg-black/[0.04] transition-all relative group"
          >
            <ShoppingBag className="w-5 h-5 text-[#1D1D1F] group-hover:scale-110 transition-transform" />
            {itemsCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#0071E3] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemsCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Trigger */}
          <button
            onClick={openSidebar}
            className="md:hidden p-2 -mr-2 rounded-full hover:bg-black/[0.04] transition-all group"
          >
            <Menu className="w-5 h-5 text-[#1D1D1F] group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>
      </div>

      {/* ── Mega Menu Dropdown (Edge-to-Edge) ── */}
      <AnimatePresence>
        {activeCategory && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="absolute top-full left-0 right-0 w-full bg-white border-b border-black/[0.05] shadow-[0_20px_40px_rgba(0,0,0,0.08)] z-50 overflow-hidden"
            onMouseEnter={() => handleMouseEnter(activeCategory.slug)}
          >
            <div className="max-w-7xl mx-auto px-6 py-12">
              <div className="grid grid-cols-12 gap-10">
                
                {/* Featured / Info Column */}
                <div className="col-span-3 border-r border-black/[0.05] pr-10">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#6E6E73] mb-4">Featured</h3>
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 group cursor-pointer">
                    <Image 
                      src={activeCategory.heroImage || '/media-pro/men/Design 1/649824908_122120770023151981_1372810042799937270_n.webp'} 
                      alt={activeCategory.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      quality={80}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
                      <p className="text-white text-xs font-bold tracking-widest uppercase">Explore {activeCategory.name}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#6E6E73] leading-relaxed italic">
                    {activeCategory.description || "Discover the latest premium collections crafted for elegance and comfort."}
                  </p>
                </div>

                {/* Categories Grid (Edge to Edge side by side) */}
                <div className="col-span-9">
                  <div className="flex items-baseline justify-between mb-8">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#6E6E73]">Collections</h3>
                    <Link 
                      href={`/${activeCategory.slug}`}
                      className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#0071E3] hover:underline"
                    >
                      Shop All {activeCategory.name}
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-3 gap-x-8 gap-y-10">
                    {activeCategory.subcategories
                      .filter(s => s !== 'All')
                      .map((sub) => {
                        const subSlug = toSlug(sub);
                        const subSubs = activeCategory.subSubCategories?.[sub] ?? [];
                        
                        return (
                          <div key={sub} className="flex flex-col gap-4">
                            <Link 
                              href={`/${activeCategory.slug}/${subSlug}`}
                              onClick={() => setOpenMenu(null)}
                              className="text-sm font-bold text-[#1D1D1F] hover:text-[#0071E3] transition-colors border-b border-black/[0.05] pb-2 flex items-center justify-between group"
                            >
                              {sub}
                              <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </Link>

                            <div className="flex flex-col gap-2">
                              {subSubs.filter(ss => ss !== 'All').map((ss) => (
                                <Link
                                  key={ss}
                                  href={`/${activeCategory.slug}/${subSlug}/${toSlug(ss)}`}
                                  onClick={() => setOpenMenu(null)}
                                  className="text-[12px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors flex items-center gap-2 group/item"
                                >
                                  <span className="w-1 h-1 bg-black/10 rounded-full group-hover/item:bg-[#0071E3] transition-colors" />
                                  {ss}
                                </Link>
                              ))}
                              {subSubs.length === 0 && (
                                <p className="text-[11px] text-[#6E6E73]/50 italic">New arrivals coming soon</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

              </div>
            </div>
            
            {/* Bottom Accent Line */}
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#0071E3]/20 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
