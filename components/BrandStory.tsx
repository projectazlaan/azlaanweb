import Image from 'next/image';

export default function BrandStory({ isBangla = false }: { isBangla?: boolean }) {
  return (
    <section className="py-[12px] px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-16 items-center">
        <div className="order-2 md:order-1">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="/media-pro/Cover/616795496_122112085989151981_2801687860027277426_n.webp"
              alt="Azlaan Outlet Counter"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        <div className="order-1 md:order-2">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 md:mb-8 text-primary">
            {isBangla ? 'আমাদের গল্প' : 'Our Story'}
          </h2>
          <p className="text-text-muted mb-3 md:mb-4 leading-relaxed text-sm md:text-base">
            {isBangla 
              ? 'আজলান বাংলাদেশে প্রিমিয়াম ফ্যাশনের এক নতুন ধারণা নিয়ে আসে। আমরা বিশ্বাস করি প্রতিটি সেলাই একটি কারুশিল্প, নিষ্ঠা এবং গর্বের গল্প বলে।'
              : 'Azlaan was born from a vision to redefine premium fashion in Bangladesh. We believe that every stitch tells a story of craftsmanship, dedication, and pride.'
            }
          </p>
          <p className="text-text-muted mb-6 md:mb-10 leading-relaxed text-sm md:text-base">
            {isBangla
              ? 'আমাদের পোশাক তৈরি করা হয় সর্বোত্তম উপাদান দিয়ে, যা বাংলাদেশের ঐতিহ্যবাহী টেক্সটাইল হেরিটেজ এবং আধুনিক ডিজাইনের সংমিশ্রণে তৈরি।'
              : 'Our garments are crafted with the finest materials, combining traditional Bangladeshi textile heritage with contemporary designs that speak to the modern sophisticated individual.'
            }
          </p>

          <div className="grid grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-10">
            <div>
              <p className="font-serif text-2xl md:text-4xl font-bold text-gray-700">500+</p>
              <p className="text-text-muted text-xs md:text-sm">
                {isBangla ? 'প্রিমিয়াম ডিজাইন' : 'Premium Designs'}
              </p>
            </div>
            <div>
              <p className="font-serif text-2xl md:text-4xl font-bold text-gray-700">50k+</p>
              <p className="text-text-muted text-xs md:text-sm">
                {isBangla ? 'সন্তুষ্ট ক্রেতা' : 'Happy Customers'}
              </p>
            </div>
            <div>
              <p className="font-serif text-2xl md:text-4xl font-bold text-gray-700">15+</p>
              <p className="text-text-muted text-xs md:text-sm">
                {isBangla ? 'বছরের অভিজ্ঞতা' : 'Years Experience'}
              </p>
            </div>
          </div>

          <p className="font-serif text-lg md:text-xl text-gray-500 font-semibold">
            {isBangla ? 'বাংলাদেশে গর্বের সাথে তৈরি' : 'Crafted with Pride in Bangladesh'}
          </p>
        </div>
      </div>
    </section>
  );
}
