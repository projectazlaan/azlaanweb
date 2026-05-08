'use client';
import { useCategoryStore } from '@/store/categoryStore';
import { Category } from '@/types';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
interface FilterBarProps {
  category: Category;
  variant?: 'full' | 'compact';
  items?: string[];
  activeItem?: string;
  onItemSelect?: (item: string) => void;
}
// Using high-detail realistic paths for a "Real" look
export const Icons = {
  All: (props: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
    </svg>
  ),
  Panjabi: (props: any) => (
    <svg viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M56,40 L200,40 L216,216 L40,216 Z" />
      <path d="M128,40 L128,104" />
      <path d="M104,40 C104,40 104,64 128,64 C152,64 152,40 152,40" />
      <path d="M56,80 L32,120 L32,160" />
      <path d="M200,80 L224,120 L224,160" />
    </svg>
  ),
  Suit: (props: any) => (
    <svg viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M48,32 L128,88 L208,32 L224,224 L32,224 Z" />
      <path d="M128,88 L128,224" />
      <path d="M88,32 L128,88 L168,32" />
      <circle cx="128" cy="128" r="4" fill="currentColor" />
      <circle cx="128" cy="168" r="4" fill="currentColor" />
    </svg>
  ),
  Kurta: (props: any) => (
    <svg viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M72,40 L184,40 L192,200 L64,200 Z" />
      <path d="M128,40 L128,88" />
      <path d="M100,40 S108,56 128,56 S156,40 156,40" />
      <path d="M72,72 L48,112" />
      <path d="M184,72 L208,112" />
    </svg>
  ),
  Shirt: (props: any) => (
    <svg viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M64,32 L192,32 L208,224 L48,224 Z" />
      <path d="M64,64 L32,96 L32,144" />
      <path d="M192,64 L224,96 L224,144" />
      <path d="M104,32 L128,56 L152,32" />
      <path d="M128,56 L128,224" />
    </svg>
  ),
  TShirt: (props: any) => (
    <svg viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M40,48 L88,48 L104,72 L152,72 L168,48 L216,48 L232,112 L192,128 L192,216 L64,216 L64,128 L24,112 Z" />
      <path d="M104,48 S112,64 128,64 S152,48 152,48" />
    </svg>
  ),
  Generic: (props: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" />
    </svg>
  ),
  SubSub: (props: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
    </svg>
  )
};
export default function FilterBar({ category, variant = 'full', items, activeItem, onItemSelect }: FilterBarProps) {
  const { filters, setFilter, activeSection } = useCategoryStore();
  const router = useRouter();
  const params = useParams();
  const displayItems = items || category.subcategories;
  return (
    <div className={`w-full transition-all duration-500 ${variant === 'compact' ? 'py-0.5' : 'py-3 md:py-4'}`}>
      <div className={`
        flex items-center w-full px-1 md:px-8
        ${variant === 'full' ? 'justify-between' : 'justify-center gap-1 md:gap-8'}
      `}>
        {displayItems.map((item) => {
          const isActive = activeItem ? activeItem === item : (variant === 'compact' ? activeSection === item : filters.subcategory === item);
          return (
            <button
              key={item}
              onClick={() => {
                if (onItemSelect) {
                  onItemSelect(item);
                } else {
                  if (variant === 'compact' && filters.subcategory === 'All') {
                    const el = document.getElementById(item);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    // Navigate to separate page address
                    const categorySlug = params.categorySlug || category.slug;
                    const subSlug = params.subcategorySlug;
                    if (item === 'All') {
                      if (subSlug) {
                        router.push(`/${categorySlug}/${subSlug}`);
                      } else {
                        router.push(`/${categorySlug}`);
                      }
                    } else {
                      const itemSlug = item.toLowerCase().replace(/ /g, '-');
                      if (subSlug) {
                        // We are already in a subcategory, so this is a sub-sub
                        router.push(`/${categorySlug}/${subSlug}/${itemSlug}`);
                        setFilter('subSubCategory', item);
                      } else {
                        // This is a subcategory level click
                        router.push(`/${categorySlug}/${itemSlug}`);
                        setFilter('subcategory', item);
                      }
                    }
                  }
                }
              }}
              className={`
                group relative flex flex-col items-center justify-center transition-all duration-500 ease-in-out flex-1 py-1 md:py-2
              `}
            >
              <h3 className={`
                font-sans font-bold uppercase transition-all duration-500 text-center whitespace-nowrap
                ${variant === 'full' 
                  ? 'text-[7px] md:text-[10px] tracking-[0.1em] md:tracking-[0.2em]' 
                  : 'text-[7px] md:text-[9px] tracking-[0.05em] md:tracking-[0.1em] font-black'}
                ${isActive ? 'text-black' : 'text-black/50 group-hover:text-black/80'}
              `}>
                {item}
              </h3>
              <div className={`
                absolute bottom-0 transition-all duration-500 bg-black rounded-full h-[1.5px] w-4
                ${isActive ? 'opacity-100 translate-y-1' : 'opacity-0 scale-x-0'}
              `} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
