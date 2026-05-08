'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
/* ── Category Accordion Item ─────────────────────────────────── */
function CategoryAccordion({
  cat,
  pathname,
  onNavigate,
}: {
  cat: typeof categories[0];
  pathname: string;
  onNavigate: () => void;
}) {
  const router = useRouter();
  const isCatActive = pathname.startsWith(`/${cat.slug}`);
  const [open, setOpen] = useState(isCatActive);
  const [openSub, setOpenSub] = useState<string | null>(
    isCatActive
      ? cat.subcategories.find((s) => pathname.includes(toSlug(s))) ?? null
      : null
  );
  const Icon = categoryIcons[cat.slug] ?? Shirt;
  return (
    <div>
      {/* Category trigger */}
      <button
        onClick={() => {
          if (!open) {
            setOpen(true);
          } else {
            router.push(`/${cat.slug}`);
            onNavigate();
          }
        }}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group
          ${isCatActive
            ? 'bg-[#0071E3]/8 text-[#1D1D1F]'
            : 'text-[#1D1D1F]/70 hover:bg-black/[0.04] hover:text-[#1D1D1F]'
          }`}
      >
        <span className="flex items-center gap-2.5">
          <span className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
            ${isCatActive ? 'bg-[#0071E3] text-white' : 'bg-black/[0.05] text-[#1D1D1F]/60 group-hover:bg-[#0071E3]/10 group-hover:text-[#0071E3]'}`}>
            <Icon className="w-3.5 h-3.5" />
          </span>
          <span className="text-[13px] font-semibold tracking-[-0.01em]">{cat.name}</span>
          {isCatActive && (
            <span className="text-[9px] font-black uppercase tracking-widest bg-[#0071E3]/10 text-[#0071E3] px-1.5 py-0.5 rounded-full">
              Active
            </span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#1D1D1F]/30 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {/* Subcategories */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pl-3 pr-1 pb-1 mt-0.5 space-y-0.5">
          {/* All link */}
          <Link
            href={`/${cat.slug}`}
            onClick={onNavigate}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all
              ${pathname === `/${cat.slug}`
                ? 'text-[#0071E3] bg-[#0071E3]/8'
                : 'text-[#1D1D1F]/40 hover:text-[#1D1D1F] hover:bg-black/[0.03]'
              }`}
          >
            All {cat.name}
            <ArrowRight className="w-3 h-3 opacity-50" />
          </Link>
          {/* Subcategories */}
          {cat.subcategories
            .filter((s) => s !== 'All')
            .map((sub) => {
              const subSlug = toSlug(sub);
              const subUrl = `/${cat.slug}/${subSlug}`;
              const subSubs = cat.subSubCategories?.[sub]?.filter((ss) => ss !== 'All') ?? [];
              const isSubActive = pathname.startsWith(subUrl);
              const hasChildren = subSubs.length > 0;
              return (
                <div key={sub}>
                  <div className="flex items-center gap-1">
                    <Link
                      href={subUrl}
                      onClick={(e) => {
                        if (hasChildren && openSub !== sub) {
                          e.preventDefault();
                          setOpenSub(sub);
                        } else {
                          onNavigate();
                        }
                      }}
                      className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium transition-all
                        ${isSubActive
                          ? 'text-[#1D1D1F] font-semibold bg-black/[0.04]'
                          : 'text-[#1D1D1F]/55 hover:text-[#1D1D1F] hover:bg-black/[0.03]'
                        }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        isSubActive ? 'bg-[#0071E3]' : 'bg-[#D2D2D7]'
                      }`} />
                      {sub}
                    </Link>
                    {hasChildren && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setOpenSub((p) => (p === sub ? null : sub));
                        }}
                        className="p-1.5 rounded-lg hover:bg-black/[0.05] transition-colors"
                      >
                        <ChevronDown
                          className={`w-3 h-3 text-[#1D1D1F]/30 transition-transform duration-200 ${
                            openSub === sub ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    )}
                  </div>
                  {/* Sub-subcategories */}
                  {hasChildren && (
                    <div
                      className={`overflow-hidden transition-all duration-200 ${
                        openSub === sub ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="pl-7 pr-2 py-1 space-y-0.5">
                        {subSubs.map((ss) => {
                          const ssUrl = `/${cat.slug}/${subSlug}/${toSlug(ss)}`;
                          const isSSActive = pathname === ssUrl;
                          return (
                            <Link
                              key={ss}
                              href={ssUrl}
                              onClick={onNavigate}
                              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] transition-all
                                ${isSSActive
                                  ? 'text-[#0071E3] font-semibold bg-[#0071E3]/8'
                                  : 'text-[#1D1D1F]/40 hover:text-[#1D1D1F]/70 hover:bg-black/[0.03]'
                                }`}
                            >
                              <span className={`w-0.5 h-3 rounded-full flex-shrink-0 ${
                                isSSActive ? 'bg-[#0071E3]' : 'bg-[#D2D2D7]'
                              }`} />
                              {ss}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
      {/* Divider between categories */}
      <div className="mx-3 mt-1 mb-1 border-b border-[#D2D2D7]/50" />
    </div>
  );
}
/* ── Main SidebarDrawer ──────────────────────────────────────── */
export default function SidebarDrawer() {
  const { isOpen, closeSidebar } = useSidebar();
  const drawerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSidebar();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeSidebar]);
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
            className="font-serif text-2xl font-bold tracking-tight text-[#1D1D1F]"
          >
            Azlaan
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
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0">
          {/* Collections label */}
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#6E6E73] px-3 pt-1 pb-3">
            Collections
          </p>
          {categories.map((cat) => (
            <CategoryAccordion
              key={cat.slug}
              cat={cat}
              pathname={pathname}
              onNavigate={closeSidebar}
            />
          ))}
          {/* Quick Links label */}
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#6E6E73] px-3 pt-4 pb-2">
            Quick Links
          </p>
          {staticLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={closeSidebar}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200
                  ${isActive
                    ? 'bg-[#0071E3]/8 text-[#1D1D1F]'
                    : 'text-[#1D1D1F]/65 hover:bg-black/[0.04] hover:text-[#1D1D1F]'
                  }`}
              >
                <span className="flex items-center gap-2.5">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
                    ${isActive ? 'bg-[#0071E3] text-white' : 'bg-black/[0.05] text-[#1D1D1F]/50 group-hover:bg-[#0071E3]/10 group-hover:text-[#0071E3]'}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[13px] font-medium tracking-[-0.01em]">{label}</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-40 transition-all -translate-x-1 group-hover:translate-x-0 duration-200 text-[#1D1D1F]" />
              </Link>
            );
          })}
        </nav>
        {/* Footer */}
        <div className="px-5 py-4 border-t border-[#D2D2D7]/60 shrink-0">
          <p className="text-[10px] text-[#6E6E73]">© 2026 Azlaan. All rights reserved.</p>
        </div>
      </aside>
    </>
  );
}
