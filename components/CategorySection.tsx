import Link from 'next/link';
import Image from 'next/image';
const categories = [
  {
    name: 'Men',
    image: '/media-pro/men/Design 5/650905571_122120824035151981_4320891712881698677_n.webp',
    href: '/men',
  },
  {
    name: 'Women',
    image: '/media-pro/women/Design 2/672121181_122125885095151981_7790861692313383598_n.webp',
    href: '/women',
  },
  {
    name: 'Kids',
    image: '/media-pro/women/Design 1/673191812_122125962327151981_8385571386878315506_n.webp',
    href: '/kids',
  },
];
export default function CategorySection() {
  return (
    <section 
      data-customizable 
      data-custom-key="categorySection"
      className="bg-white overflow-hidden"
    >
      <div className="max-w-full mx-auto">
        <div className="grid grid-cols-2 gap-1 md:gap-2 p-1 md:p-2 bg-white">
          {/* Left Column - Men (1 large image) */}
          <Link
            href="/men"
            className="col-span-1 group relative overflow-hidden h-[360px] md:h-[500px] lg:h-[700px] transition-all duration-700 rounded-lg md:rounded-2xl"
          >
            <Image
              src={categories[0].image}
              alt="Men"
              fill
              className="object-cover object-bottom group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
            <div className="absolute bottom-6 left-6 text-left">
              <p className="text-white/80 text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold mb-1">Elevated Classics</p>
              <h3 className="text-white text-3xl md:text-5xl font-sans font-extrabold tracking-tight">Men</h3>
            </div>
          </Link>
          {/* Right Column - Women & Kids (Stacked vertically) */}
          <div className="col-span-1 flex flex-col gap-1 md:gap-2 h-full">
            {/* Women - Top */}
            <Link
              href="/women"
              className="flex-1 group relative overflow-hidden transition-all duration-700 rounded-lg md:rounded-2xl"
            >
              <Image
                src={categories[1].image}
                alt="Women"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
              <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-left">
                <p className="text-white/80 text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-bold mb-0.5 md:mb-1">Timeless Elegance</p>
                <h3 className="text-white text-xl md:text-4xl font-sans font-extrabold tracking-tight">Women</h3>
              </div>
            </Link>
            {/* Kids - Bottom */}
            <div className="flex-1 group relative overflow-hidden bg-black transition-all duration-700 rounded-lg md:rounded-2xl">
              <Image
                src="/media-pro/Cover/651731213_122121294069151981_7046002980511560260_n.webp"
                alt="Kids Coming Soon"
                fill
                className="object-cover opacity-40 blur-xl group-hover:scale-110 transition-transform duration-[2000ms]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
              <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-left w-full pr-4">
                <div className="flex items-center gap-2 md:gap-3 mb-1">
                  <h3 className="text-white text-xl md:text-4xl font-sans font-extrabold tracking-tight">Kids</h3>
                  <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[7px] md:text-[9px] uppercase tracking-[0.2em] px-2 md:px-3 py-1 rounded-full font-bold shadow-2xl">
                    Soon
                  </span>
                </div>
                <p className="text-white/40 text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-bold">Arriving Shortly</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
