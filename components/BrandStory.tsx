import Image from 'next/image';
export default function BrandStory({ isBangla = false }: { isBangla?: boolean }) {
  return (
    <section className="py-8 md:py-16 px-4 overflow-hidden bg-gray-50/80 border-y border-gray-100">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center gap-6 md:gap-10">
        <div className="w-full max-w-3xl">
          <div className="relative aspect-[21/9] overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/5">
            <Image
              src="/media-pro/cover/cover 3.jpg"
              alt="Azlaan"
              fill
              className="object-cover hover:scale-105 transition-transform duration-[3000ms] ease-out"
              sizes="(max-width: 768px) 100vw, 80vw"
            />
            <div className="absolute inset-0 bg-black/5 pointer-events-none" />
          </div>
        </div>
        
        <div className="flex flex-col items-center max-w-4xl">
          <div className="flex flex-col items-center mb-6">
            <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-2">Our Heritage</span>
            <h2 className="font-serif italic text-3xl md:text-5xl text-primary leading-tight">
              {isBangla ? 'আমাদের গল্প' : 'The Story of Azlaan'}
            </h2>
          </div>
          
          <p className="text-text-muted leading-relaxed text-sm md:text-xl font-light italic px-4 md:px-12">
            {isBangla 
              ? 'আজলান বাংলাদেশে প্রিমিয়াম ফ্যাশনের নতুন ধারণা। প্রতিটি সেলাই একটি কারুশিল্প এবং গর্বের গল্প।'
              : 'Azlaan redefines premium fashion in Bangladesh. Every stitch tells a story of craftsmanship, dedication, and pride.'
            }
          </p>
        </div>
      </div>
    </section>
  );
}
