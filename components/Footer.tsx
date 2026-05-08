import Link from 'next/link';
import Image from 'next/image';

export default function Footer({ isBangla = false }: { isBangla?: boolean }) {
  return (
    <footer className="bg-white border-t border-black/[0.03] text-black py-10 md:py-12 px-4 md:px-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-10">
          {/* Brand Info */}
          <div className="col-span-2 lg:col-span-2 flex flex-col gap-4">
            <div className="relative w-[120px] h-[40px] md:w-[150px] md:h-[50px] mix-blend-multiply -ml-2">
              <Image
                src="/media-pro/azlaan-logo-trimmed.png"
                alt="Azlaan Logo"
                fill
                className="object-contain object-left contrast-[1.5] grayscale"
                quality={100}
              />
            </div>
            <p className="text-[10px] md:text-xs text-gray-600 max-w-xs leading-relaxed mt-1">
              Premium clothing brand dedicated to craftsmanship and timeless elegance.
            </p>
            <p className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-widest mt-2">
              © 2026 Azlaan Premium.
            </p>
          </div>
          {/* Company */}
          <div className="flex flex-col gap-4">
            <h4 className="font-black text-[9px] md:text-xs uppercase tracking-widest text-black">Company</h4>
            <ul className="flex flex-col gap-2.5 text-[10px] md:text-xs text-gray-600">
              <li><Link href="/about" className="hover:text-black transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-black transition-colors">Contact</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          {/* Service */}
          <div className="flex flex-col gap-4">
            <h4 className="font-black text-[9px] md:text-xs uppercase tracking-widest text-black">Service</h4>
            <ul className="flex flex-col gap-2.5 text-[10px] md:text-xs text-gray-600">
              <li><Link href="/shipping" className="hover:text-black transition-colors">Shipping</Link></li>
              <li><Link href="/returns" className="hover:text-black transition-colors">Returns</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          {/* Follow */}
          <div className="flex flex-col gap-4">
            <h4 className="font-black text-[9px] md:text-xs uppercase tracking-widest text-black">Follow</h4>
            <div className="flex gap-4">
              <Link href="#" className="text-gray-600 hover:text-black transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.236 2.686.236v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-black transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266-.058-1.645-.07-4.85-.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.667.07-4.947-.196-4.354-2.617-6.78-6.98-6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.583-.072-4.949-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 3.35a8.65 8.65 0 100 17.3 8.65 8.65 0 000-17.3zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
