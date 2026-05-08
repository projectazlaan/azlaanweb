'use client';
import { usePathname } from 'next/navigation';
import CustomizerBridge from "@/components/CustomizerBridge";
import { SidebarProvider } from "@/context/SidebarContext";
import SidebarDrawer from "@/components/SidebarDrawer";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from 'react-hot-toast';
import VisualEditorBridge from "@/components/VisualEditorBridge";
import { Suspense } from 'react';
export default function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  if (isAdmin) {
    return (
      <>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#000',
              color: '#fff',
              fontSize: '12px',
              borderRadius: '999px',
              padding: '8px 16px',
              fontWeight: '900',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            },
          }}
        />
        <main className="min-h-screen">
          {children}
        </main>
      </>
    );
  }
  return (
    <>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#000',
            color: '#fff',
            fontSize: '12px',
            borderRadius: '999px',
            padding: '8px 16px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          },
        }}
      />
      <CustomizerBridge />
      <Suspense fallback={null}>
        <VisualEditorBridge />
      </Suspense>
      {/* ── Global Sidebar & Navigation ── */}
      <SidebarProvider>
        <SidebarDrawer />
        <Navbar />
        <main className="flex-1 pt-[72px] md:pt-[80px]">
          {children}
        </main>
        <Footer />
      </SidebarProvider>
    </>
  );
}
