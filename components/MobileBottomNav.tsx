'use client';
import { Home, Grid, PlaySquare, MessageCircle, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/context/SidebarContext';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();

  const navItems = [
    { name: 'Shop', href: '/all-categories', icon: Grid },
    { name: 'Reels', href: '/#watch-and-buy', icon: PlaySquare },
    { name: 'Home', href: '/', icon: Home, isCenter: true },
    { name: 'Chat', href: '/chat', icon: MessageCircle },
    { name: 'Menu', href: '#', icon: Menu, action: toggleSidebar },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] w-full pointer-events-none pb-[env(safe-area-inset-bottom)]">
      <div className="bg-white/95 backdrop-blur-3xl border-t border-neutral-200 pointer-events-auto h-[57px] flex items-center justify-around px-1 relative">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && !item.href.startsWith('#') && pathname.startsWith(item.href));
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <div key={item.name} className="relative h-full flex items-center justify-center pointer-events-auto z-20 w-16">
                <Link 
                  href={item.href}
                  className="flex items-center justify-center outline-none focus:outline-none tap-highlight-transparent w-[62px] h-[62px] -mt-8 bg-neutral-300 text-black rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.18)] border-[1.5px] border-white transition-transform active:scale-95"
                >
                  <Icon strokeWidth={2.25} className="w-[28px] h-[28px]" />
                </Link>
              </div>
            );
          }

          if (item.action) {
            return (
              <button 
                key={item.name} 
                onClick={item.action}
                className="relative flex items-center justify-center w-16 h-full outline-none focus:outline-none tap-highlight-transparent z-10 group"
              >
                <Icon strokeWidth={1.75} className="w-6 h-6 text-neutral-600 group-active:scale-90 transition-transform" />
              </button>
            );
          }

          return (
            <Link 
              key={item.name} 
              href={item.href}
              className="relative flex items-center justify-center w-16 h-full outline-none focus:outline-none tap-highlight-transparent z-10 group"
            >
              <Icon 
                strokeWidth={isActive ? 2.5 : 1.75} 
                className={`transition-all duration-300 ${isActive ? 'w-[26px] h-[26px] text-black' : 'w-6 h-6 text-neutral-600 group-active:scale-90'}`} 
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
