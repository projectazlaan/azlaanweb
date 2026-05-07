import Image from 'next/image';

export default async function AboutPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const isBangla = resolvedSearchParams?.lang === 'bn';

  return (
    <main className="min-h-screen pt-24 pb-12">
      <section className="relative h-48 sm:h-64 md:h-80 bg-primary">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
              {isBangla ? 'আমাদের গল্প' : 'Our Story'}
            </h1>
            <p className="text-sm sm:text-base md:text-lg">
              {isBangla ? 'বাংলাদেশে গর্বের সাথে তৈরি' : 'Crafted with Pride in Bangladesh'}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <section className="mb-8 md:mb-12">
          <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center">
            <div>
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
                <Image
                  src="/media-pro/Cover/667707081_122124567927151981_5917933416815199932_n.webp"
                  alt="Craftsmanship"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4 text-primary">
                {isBangla ? 'মিশন ও ভিশন' : 'Mission & Vision'}
              </h2>
              <p className="text-text-muted mb-3 md:mb-4 leading-relaxed text-sm md:text-base">
                {isBangla
                  ? 'আজলান বাংলাদেশে প্রিমিয়াম ফ্যাশনের এক নতুন ধারণা নিয়ে আসে। আমরা বিশ্বাস করি প্রতিটি সেলাই একটি কারুশিল্প, নিষ্ঠা এবং গর্বের গল্প বলে।'
                  : 'Azlaan was born from a vision to redefine premium fashion in Bangladesh. We believe that every stitch tells a story of craftsmanship, dedication, and pride.'
                }
              </p>
              <p className="text-text-muted leading-relaxed text-sm md:text-base">
                {isBangla
                  ? 'আমাদের পোশাক তৈরি করা হয় সর্বোত্তম উপাদান দিয়ে, যা বাংলাদেশের ঐতিহ্যবাহী টেক্সটাইল হেরিটেজ এবং আধুনিক ডিজাইনের সংমিশ্রণে তৈরি।'
                  : 'Our garments are crafted with the finest materials, combining traditional Bangladeshi textile heritage with contemporary designs.'
                }
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8 md:mb-12">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-primary">
            {isBangla ? 'আমাদের মূল্যবোধ' : 'Our Values'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { title: 'Quality', titleBn: 'মান', desc: 'Premium materials & craftsmanship', descBn: 'প্রিমিয়াম উপাদান ও কারুশিল্প' },
              { title: 'Heritage', titleBn: 'ঐতিহ্য', desc: 'Celebrating Bangladeshi textile legacy', descBn: 'বাংলাদেশের টেক্সটাইল ঐতিহ্য' },
              { title: 'Innovation', titleBn: 'উদ্ভাবন', desc: 'Modern designs with traditional roots', descBn: 'ঐতিহ্যের সাথে আধুনিক ডিজাইন' },
            ].map((value, i) => (
              <div key={i} className="bg-white p-5 md:p-8 rounded-2xl text-center">
                <h3 className="font-serif text-xl md:text-2xl font-bold text-secondary mb-2">
                  {isBangla ? value.titleBn : value.title}
                </h3>
                <p className="text-text-muted text-sm md:text-base">
                  {isBangla ? value.descBn : value.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-section-bg text-primary rounded-2xl p-6 md:p-10">
          <div className="grid grid-cols-3 gap-4 md:gap-8 text-center">
            <div>
              <p className="font-serif text-2xl md:text-4xl font-bold text-secondary">500+</p>
              <p className="text-sm md:text-base mt-1 md:mt-2">Premium Designs</p>
            </div>
            <div>
              <p className="font-serif text-2xl md:text-4xl font-bold text-secondary">50k+</p>
              <p className="text-sm md:text-base mt-1 md:mt-2">Happy Customers</p>
            </div>
            <div>
              <p className="font-serif text-2xl md:text-4xl font-bold text-secondary">15+</p>
              <p className="text-sm md:text-base mt-1 md:mt-2">Years Experience</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
