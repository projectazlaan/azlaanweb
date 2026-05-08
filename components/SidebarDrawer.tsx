'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  X,
  Home,
  Phone,
  ShoppingBag,
  User,
  User2,
  Shirt,
  Baby,
  ChevronRight,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from '@/context/SidebarContext';
import categoriesData from '@/data/categories.json';
/* ── Types ───────────────────────────────────────────────────── */
const categories = (categoriesData as unknown) as Array<{
  name: string;
  slug: string;
  subcategories: string[];
  subSubCategories?: Record<string, string[]>;
}>;
function toSlug(str: string) {
  return str.toLowerCase().replace(/ /g, '-');
}
const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  men: Shirt,
  women: User2,
  kids: Baby,
};
const staticLinks = [
  { href: '/',        label: 'Home',     icon: Home },
  { href: '/shop',    label: 'Shop All', icon: ShoppingBag },
  { href: '/account', label: 'Account',  icon: User },
  { href: '/about',   label: 'About',    icon: User2 },
  { href: '/contact', label: 'Contact',  icon: Phone },
];
/* ── Main SidebarDrawer ──────────────────────────────────────── */
export default function SidebarDrawer() {
  const { isOpen, closeSidebar } = useSidebar();
  const drawerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string | null>(
    categories.find(c => pathname.startsWith(`/${c.slug}`))?.slug ?? 'men'
  );
  const [openSub, setOpenSub] = useState<string | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSidebar();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setOpenSub(null);
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeSidebar]);

  const activeCategoryData = categories.find(c => c.slug === activeTab);

  const handleCategoryClick = (slug: string) => {
    setActiveTab(prev => prev === slug ? null : slug);
    setOpenSub(null);
  };

  const handleSubCategoryClick = (e: React.MouseEvent, subName: string, hasChildren: boolean) => {
    if (hasChildren) {
      e.preventDefault();
      setOpenSub(prev => prev === subName ? null : subName);
    } else {
      closeSidebar();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeSidebar}
        className={`fixed inset-0 z-[998] bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />
      {/* Panel */}
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Sidebar"
        className={`fixed top-0 right-0 h-full w-80 z-[999] flex flex-col bg-white transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ boxShadow: '-12px 0 48px rgba(0,0,0,0.12)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#D2D2D7]/60 shrink-0">
          <Link
            href="/"
            onClick={closeSidebar}
            className="relative w-[110px] h-[35px] hover:opacity-80 transition-opacity mix-blend-multiply"
          >
            <Image
              src="/media-pro/azlaan-logo-trimmed.png"
              alt="Azlaan Logo"
              fill
              className="object-contain object-left contrast-[1.5] grayscale"
              priority
              quality={100}
            />
          </Link>
          <button
            onClick={closeSidebar}
            aria-label="Close sidebar"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/[0.05] hover:bg-black/[0.09] transition-colors"
          >
            <X className="w-4 h-4 text-[#1D1D1F]" />
          </button>
        </div>
        {/* Scrollable body */}
        <nav className="flex-1 overflow-y-auto py-5 px-4 space-y-6">
          {/* Collections Section - Side by Side Tabs */}
          <div className="space-y-3">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#6E6E73] pl-2">
              Collections
            </p>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => {
                const isTabActive = activeTab === cat.slug;
                const Icon = categoryIcons[cat.slug] ?? Shirt;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => handleCategoryClick(cat.slug)}
                    className={`relative flex flex-col items-center gap-1.5 p-2.5 rounded-2xl transition-all duration-500 border
                      ${isTabActive 
                        ? 'bg-white text-black border-black shadow-sm scale-[1.02]' 
                        : 'bg-black/[0.02] text-[#1D1D1F]/60 border-transparent hover:bg-black/[0.04]'}`}
                  >
                    <Icon className={`w-4.5 h-4.5 ${isTabActive ? 'text-black' : 'text-[#1D1D1F]/40'}`} />
                    <span className="text-[10px] font-bold tracking-tight">
                      {cat.name}
                    </span>
                    {isTabActive && (
                      <div className="absolute top-1.5 right-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Shared Subcategories Dropdown Area */}
            <AnimatePresence mode="wait">
              {activeCategoryData && (
                <motion.div
                  key={activeCategoryData.slug}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  className="overflow-hidden bg-white rounded-2xl border border-black/10 shadow-sm"
                >
                  <div className="p-3 space-y-3">
                    {/* All [Category] Link */}
                    <Link
                      href={`/${activeCategoryData.slug}`}
                      onClick={closeSidebar}
                      className="group flex items-center justify-between py-3.5 px-4 rounded-xl bg-black text-white hover:scale-[1.02] transition-all shadow-md mb-1"
                    >
                      <div className="flex items-center gap-3">
                        <ShoppingBag className="w-4 h-4 text-white/70" />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                          All {activeCategoryData.name}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    {/* Subcategories List */}
                    <div className="flex flex-col">
                      {activeCategoryData.subcategories
                        .filter(s => s !== 'All')
                        .map((sub, index) => {
                          const subSlug = toSlug(sub);
                          const path = `/${activeCategoryData.slug}/${subSlug}`;
                          const subSubs = activeCategoryData.subSubCategories?.[sub]?.filter(ss => ss !== 'All') ?? [];
                          const hasChildren = subSubs.length > 0;
                          const isSubOpen = openSub === sub;

                          return (
                            <motion.div
                              key={sub}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05, duration: 0.3 }}
                              className="flex flex-col"
                            >
                              <Link
                                href={path}
                                onClick={(e) => handleSubCategoryClick(e, sub, hasChildren)}
                                className={`group flex items-center justify-between py-3.5 border-b border-black/[0.03] last:border-0 px-2 rounded-lg transition-all hover:bg-black/[0.01]
                                  ${isSubOpen ? 'bg-black/[0.02]' : ''}`}
                              >
                                <div className="flex items-center gap-3">
                                  <span className={`w-1 h-1 rounded-full transition-all bg-black/10 group-hover:bg-black group-hover:scale-150 ${isSubOpen ? 'bg-black scale-150' : ''}`} />
                                  <span className={`text-[13px] font-semibold tracking-tight text-[#1D1D1F] transition-all group-hover:translate-x-1 ${isSubOpen ? 'text-black translate-x-1' : ''}`}>
                                    {sub}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {hasChildren ? (
                                    <ChevronDown className={`w-3.5 h-3.5 text-black/20 transition-transform duration-300 ${isSubOpen ? 'rotate-180 text-black' : ''}`} />
                                  ) : (
                                    <ChevronRight className="w-3.5 h-3.5 text-black/0 group-hover:text-black group-hover:translate-x-1 transition-all duration-300" />
                                  )}
                                </div>
                              </Link>

                              {/* Nested Sub-subcategories */}
                              <AnimatePresence>
                                {isSubOpen && hasChildren && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden bg-black/[0.015] rounded-xl mb-2 mx-1 border-l-2 border-black/5"
                                  >
                                    <div className="pl-4 pr-2 py-2 flex flex-col gap-1">
                                      {/* All Sub-category Link */}
                                      <Link
                                        href={path}
                                        onClick={closeSidebar}
                                        className="flex items-center gap-3 py-3 px-3.5 rounded-lg bg-black/[0.04] text-black hover:bg-black hover:text-white transition-all group"
                                      >
                                        <ArrowRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">
                                          All {sub}
                                        </span>
                                      </Link>

                                      {subSubs.map((ss) => {
                                        const ssPath = `${path}/${toSlug(ss)}`;
                                        return (
                                          <Link
                                            key={ss}
                                            href={ssPath}
                                            onClick={closeSidebar}
                                            className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-black/[0.03] transition-all group"
                                          >
                                            <div className="flex items-center gap-2.5">
                                              <span className="w-0.5 h-3 bg-black/10 group-hover:bg-black group-hover:h-4 transition-all" />
                                              <span className="text-[11px] font-bold tracking-tight text-[#6E6E73] group-hover:text-black transition-colors">
                                                {ss}
                                              </span>
                                            </div>
                                            <ChevronRight className="w-3 h-3 text-black/0 group-hover:text-black transition-all" />
                                          </Link>
                                        );
                                      })}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          );
                        })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Links Section - Grid 4 Columns */}
          <div className="space-y-3">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#6E6E73] pl-2">
              Explore Azlaan
            </p>
            <div className="grid grid-cols-4 gap-2">
              {staticLinks.filter(l => l.href !== '/account').map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={closeSidebar}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all duration-200 border
                      ${isActive
                        ? 'bg-white text-black border-black shadow-sm'
                        : 'bg-black/[0.02] text-[#1D1D1F]/60 border-transparent hover:bg-black/[0.04]'
                      }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-[#1D1D1F]/40'}`} />
                    <span className="text-[9px] font-bold tracking-tight text-center px-1">{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Profile Section - MOVED HERE */}
          <div className="space-y-3">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#6E6E73] pl-2">
              Account Management
            </p>
            <Link
              href="/account"
              onClick={closeSidebar}
              className="flex items-center gap-3 p-3 bg-white rounded-2xl group hover:bg-black/[0.02] transition-colors border border-black/10"
            >
              <div className="w-10 h-10 rounded-full bg-black/[0.03] flex items-center justify-center text-black group-hover:scale-105 transition-transform">
                <User className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-black">Your Profile</span>
                <span className="text-[9px] text-[#6E6E73] uppercase tracking-widest font-black">View Details</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 ml-auto text-black/20 group-hover:text-black transition-all" />
            </Link>
          </div>

          {/* Support & Help Section */}
          <div className="space-y-3 pt-2 border-t border-black/[0.05]">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#6E6E73] pl-2">
              Support & Help
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="https://wa.me/yournumber"
                className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-2xl hover:bg-black/[0.02] transition-colors group border border-black/5"
              >
                <div className="w-7 h-7 rounded-full bg-black/[0.03] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="w-3.5 h-3.5 text-black" />
                </div>
                <span className="text-[10px] font-bold text-black">WhatsApp</span>
              </Link>
              <Link
                href="mailto:support@azlaan.com"
                className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-2xl hover:bg-black/[0.02] transition-colors group border border-black/5"
              >
                <div className="w-7 h-7 rounded-full bg-black/[0.03] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Home className="w-3.5 h-3.5 text-black" />
                </div>
                <span className="text-[10px] font-bold text-black">Email Us</span>
              </Link>
            </div>
          </div>

          {/* Promo Card - MINIMALIST LINE ART */}
          <div className="pt-0">
            <div className="relative overflow-hidden bg-white rounded-2xl p-3.5 text-black group cursor-pointer shadow-sm border border-black">
              <div className="relative z-10">
                <p className="text-[8px] font-black uppercase tracking-widest text-black/40 mb-0.5">Limited Offer</p>
                <h4 className="text-[12px] font-bold leading-tight mb-2">Join Member & Get 15% Off</h4>
                <button className="text-[8px] font-black uppercase tracking-widest bg-black text-white px-2.5 py-1 rounded-full flex items-center gap-1 hover:scale-105 transition-transform">
                  Join Now <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>
              <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-black/[0.02] rounded-full blur-xl group-hover:scale-150 transition-transform duration-1000" />
            </div>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-5 border-t border-[#D2D2D7]/60 shrink-0 bg-gray-50/30">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-center gap-8">
              <Link href="#" className="p-2 rounded-full hover:bg-black/[0.05] transition-colors group">
                <svg className="w-4 h-4 fill-[#6E6E73] group-hover:fill-[#1D1D1F] transition-colors" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </Link>
              <Link href="#" className="p-2 rounded-full hover:bg-black/[0.05] transition-colors group">
                <svg className="w-4 h-4 fill-[#6E6E73] group-hover:fill-[#1D1D1F] transition-colors" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </Link>
              <Link href="#" className="p-2 rounded-full hover:bg-black/[0.05] transition-colors group">
                <svg className="w-4 h-4 fill-[#6E6E73] group-hover:fill-[#1D1D1F] transition-colors" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </Link>
            </div>
            <p className="text-[9px] text-[#6E6E73]/50 text-center font-bold uppercase tracking-[0.1em]">
              Azlaan Premium Craftsmanship
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
