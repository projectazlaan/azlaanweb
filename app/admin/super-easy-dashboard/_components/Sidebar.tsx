'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, ShoppingBag, Film, Users, Palette,
  Truck, Settings, LogOut, Home, Zap, Tag, BarChart3, Bell
} from 'lucide-react';

const MENU_GROUPS = [
  {
    label: '🏠 Site Control',
    items: [
      { name: 'News Feed', icon: LayoutDashboard, path: '/admin/super-easy-dashboard' },
      { name: 'Homepage', icon: Home, path: '/admin/super-easy-dashboard/homepage' },
      { name: 'Visual Builder', icon: Palette, path: '/admin/super-easy-dashboard/builder' },
    ],
  },
  {
    label: '🛒 Commerce',
    items: [
      { name: 'Products Hub', icon: ShoppingBag, path: '/admin/super-easy-dashboard/products' },
      { name: 'Deliveries', icon: Truck, path: '/admin/super-easy-dashboard/deliveries' },
      { name: 'Flash Sale ⚡', icon: Zap, path: '/admin/super-easy-dashboard/flash-sale' },
      { name: 'Promo Codes', icon: Tag, path: '/admin/super-easy-dashboard/promos' },
    ],
  },
  {
    label: '👥 Community',
    items: [
      { name: 'Cinema / Reels', icon: Film, path: '/admin/super-easy-dashboard/reels' },
      { name: 'VIP Circle', icon: Users, path: '/admin/super-easy-dashboard/vip' },
    ],
  },
  {
    label: '📊 Insights',
    items: [
      { name: 'Analytics', icon: BarChart3, path: '/admin/super-easy-dashboard/analytics' },
      { name: 'Notifications', icon: Bell, path: '/admin/super-easy-dashboard/notifications' },
      { name: 'Settings', icon: Settings, path: '/admin/super-easy-dashboard/settings' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.replace('/admin/login');
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col hidden md:flex shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 relative">
      {/* Brand Logo */}
      <div className="h-20 flex items-center px-8 border-b border-gray-100">
        <h1 className="text-2xl font-black tracking-tighter text-black">
          AZLAAN <span className="text-blue-600">PRO</span>
        </h1>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {MENU_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 px-3 mb-2">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-semibold text-sm ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Profile + Logout */}
      <div className="p-4 border-t border-gray-100 space-y-2">
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0">
            R
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900">Riaz</p>
            <p className="text-xs text-gray-500 font-medium">Super Admin</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl transition-colors font-bold text-sm"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
