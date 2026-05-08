'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { LayoutDashboard, Package, MessageSquare, ShoppingCart, Users, Settings, LogOut, Menu, X, Layout } from 'lucide-react'
import SiteHealth from '@/components/admin/SiteHealth'
const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/studio', label: 'Azlaan Studio', icon: Layout },
  { href: '/admin/customizer', label: 'Visual Builder', icon: Layout },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [adminUser, setAdminUser] = useState<{ username: string } | null>(null)
  useEffect(() => {
    checkAuth()
  }, [])
  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/verify', { credentials: 'include' })
      if (!res.ok) {
        router.push('/admin/login')
      } else {
        const data = await res.json()
        setAdminUser(data.user)
      }
    } catch {
      router.push('/admin/login')
    }
  }
  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }
  const isLoginPage = pathname === '/admin/login'
  const isCustomizerPage = pathname === '/admin/customizer'
  const isStudioPage = pathname === '/admin/studio'
  const isStudioProPage = pathname === '/admin/studio-pro-v12'
  const isPortalPage = pathname === '/admin'
  const isSuperEasyPage = pathname.startsWith('/admin/super-easy-dashboard')
  if (isLoginPage) {
    return <div className="min-h-screen bg-section-bg">{children}</div>
  }
  if (isCustomizerPage || isStudioPage || isStudioProPage || isPortalPage || isSuperEasyPage) {
    return <div className="min-h-screen bg-transparent">{children}</div>
  }
  return (
    <div className="min-h-screen bg-section-bg flex">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-border-light transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full sticky top-0">
          <div className="p-6 border-b border-border-light flex items-center justify-between">
            <div>
              <h1 className="font-serif text-2xl font-bold text-primary tracking-tighter">Azlaan</h1>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1 opacity-60">Admin Panel</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-text-muted hover:text-primary">
              <X size={20} />
            </button>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'text-text-muted hover:bg-section-bg hover:text-primary'
                  }`}
                >
                  <item.icon size={20} className={isActive ? 'text-secondary' : ''} />
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <SiteHealth />
          <div className="p-4 border-t border-border-light bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-section-bg flex items-center justify-center text-primary font-bold text-xs">
                  {adminUser?.username?.[0]?.toUpperCase() || 'A'}
                </div>
                <div>
                  <p className="text-xs font-bold text-primary leading-tight">{adminUser?.username || 'Admin'}</p>
                  <p className="text-[9px] text-text-muted uppercase font-black tracking-tighter">Master Access</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 max-h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-border-light p-4 flex items-center justify-between sticky top-0 z-40">
          <h1 className="font-serif text-xl font-bold text-primary">Azlaan</h1>
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-text-muted hover:text-primary">
            <Menu size={24} />
          </button>
        </header>
        {/* Page Content with independent scroll */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  )
}
