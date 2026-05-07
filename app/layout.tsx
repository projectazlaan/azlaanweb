import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import CustomizerBridge from "@/components/CustomizerBridge";
import { SidebarProvider } from "@/context/SidebarContext";
import SidebarDrawer from "@/components/SidebarDrawer";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://azlaan.com.bd'),
  title: {
    default: "AZLAAN - Bangladeshi Premium Clothing Brand",
    template: "%s | AZLAAN"
  },
  description: "Crafted with Pride in Bangladesh. Premium clothing for Men, Women & Kids.",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://azlaan.com.bd',
    siteName: 'Azlaan',
    images: [
      {
        url: '/media-pro/Cover/667707081_122124567927151981_5917933416815199932_n.webp',
        width: 1200,
        height: 630,
        alt: 'Azlaan - Bangladeshi Premium Clothing Brand',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased font-sans">
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

        {/* ── Global Sidebar & Navigation ── */}
        <SidebarProvider>
          <SidebarDrawer />
          <Navbar />
          <main className="flex-1 pt-[72px] md:pt-[80px]">
            {children}
          </main>
          <Footer />
        </SidebarProvider>
      </body>
    </html>
  );
}
