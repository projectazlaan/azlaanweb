import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import RootLayoutContent from "@/components/RootLayoutContent";
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
import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased font-sans">
        <Script id="scroll-restoration-handler" strategy="afterInteractive">
          {`
            if (typeof window !== 'undefined') {
              window.history.scrollRestoration = 'manual';
              window.addEventListener('beforeunload', () => {
                sessionStorage.setItem('scrollPos', window.scrollY.toString());
              });
              const pos = sessionStorage.getItem('scrollPos');
              if (pos) {
                window.scrollTo(0, parseInt(pos));
              }
            }
          `}
        </Script>
        <RootLayoutContent>
          {children}
        </RootLayoutContent>
      </body>
    </html>
  );
}
