export const TestimonialBlocks = [
  {
    id: 'testi-v1-single',
    label: 'Single Large Impact',
    html: `
<section data-customizable data-custom-key="testi-1" class="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
  <div class="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.50),white)] opacity-20"></div>
  <div class="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center"></div>
  <div class="mx-auto max-w-2xl lg:max-w-4xl">
    <img data-customizable data-custom-key="testi-1-logo" class="mx-auto h-12" src="https://tailwindui.com/img/logos/workcation-logo-indigo-600.svg" alt="Workcation">
    <figure class="mt-10">
      <blockquote data-customizable data-custom-key="testi-1-quote" class="text-center text-xl font-semibold leading-8 text-gray-900 sm:text-2xl sm:leading-9">
        <p>“Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo expedita voluptas culpa sapiente alias molestiae. Numquam corrupti in laborum sed rerum et corporis.”</p>
      </blockquote>
      <figcaption class="mt-10">
        <img data-customizable data-custom-key="testi-1-avatar" class="mx-auto h-14 w-14 rounded-full" src="/media-pro/kids/design 1/674400512_122125962441151981_4473859238379468925_n.webp" alt="Avatar">
        <div class="mt-4 flex items-center justify-center space-x-3 text-base">
          <div data-customizable data-custom-key="testi-1-author" class="font-semibold text-gray-900">Judith Black</div>
          <svg viewBox="0 0 2 2" width="3" height="3" aria-hidden="true" class="fill-gray-900"><circle cx="1" cy="1" r="1" /></svg>
          <div data-customizable data-custom-key="testi-1-role" class="text-gray-600">CEO of Workcation</div>
        </div>
      </figcaption>
    </figure>
  </div>
</section>
    `.trim()
  },
  {
    id: 'testi-v2-grid',
    label: 'Masonry Grid Reviews',
    html: `
<section data-customizable data-custom-key="testi-2" class="bg-gray-50 py-24 sm:py-32">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="mx-auto max-w-xl text-center">
      <h2 data-customizable data-custom-key="testi-2-title" class="text-lg font-semibold leading-8 tracking-tight text-indigo-600">Testimonials</h2>
      <p data-customizable data-custom-key="testi-2-subtitle" class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">We have worked with thousands of amazing people</p>
    </div>
    <div class="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Review 1 -->
        <figure data-customizable data-custom-key="testi-2-card-1" class="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5">
          <blockquote class="text-gray-900">
            <p>“Laborum quis quam. Dolorum et ut quod quia. Voluptas numquam delectus nihil. Aut enim doloremque et ipsam.”</p>
          </blockquote>
          <figcaption class="mt-6 flex items-center gap-x-4">
            <img class="h-10 w-10 rounded-full bg-gray-50" src="/media-pro/kids/design 1/674400512_122125962441151981_4473859238379468925_n.webp" alt="">
            <div>
              <div class="font-semibold text-gray-900">Michael Foster</div>
              <div class="text-gray-600 text-sm">@michaelfoster</div>
            </div>
          </figcaption>
        </figure>
        <!-- Review 2 -->
        <figure data-customizable data-custom-key="testi-2-card-2" class="rounded-2xl bg-indigo-600 p-6 shadow-lg ring-1 ring-indigo-500">
          <blockquote class="text-white">
            <p>“Voluptas voluptas minims imperdiet. Iure sed aliquid magnam et. Est et et est ut et aliquid ipsa minima.”</p>
          </blockquote>
          <figcaption class="mt-6 flex items-center gap-x-4">
            <img class="h-10 w-10 rounded-full bg-indigo-50" src="/media-pro/kids/design 1/674400512_122125962441151981_4473859238379468925_n.webp" alt="">
            <div>
              <div class="font-semibold text-white">Lindsay Walton</div>
              <div class="text-indigo-200 text-sm">@lindsaywalton</div>
            </div>
          </figcaption>
        </figure>
        <!-- Review 3 -->
        <figure data-customizable data-custom-key="testi-2-card-3" class="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5">
          <blockquote class="text-gray-900">
            <p>“Amet reprehenderit non magnam. Omnis vel quis ut non eos non provident voluptatibus eaque.”</p>
          </blockquote>
          <figcaption class="mt-6 flex items-center gap-x-4">
            <img class="h-10 w-10 rounded-full bg-gray-50" src="/media-pro/kids/design 1/674400512_122125962441151981_4473859238379468925_n.webp" alt="">
            <div>
              <div class="font-semibold text-gray-900">Tom Cook</div>
              <div class="text-gray-600 text-sm">@tomcook</div>
            </div>
          </figcaption>
        </figure>
      </div>
    </div>
  </div>
</section>
    `.trim()
  },
  {
    id: 'testi-v3-dark',
    label: 'Dark Cinema Quote',
    html: `
<section data-customizable data-custom-key="testi-3" class="bg-gray-950 py-24 sm:py-32">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div>
        <h2 data-customizable data-custom-key="testi-3-title" class="text-3xl font-bold tracking-tight text-white sm:text-4xl">Don't just take our word for it</h2>
        <p data-customizable data-custom-key="testi-3-desc" class="mt-4 text-lg text-gray-400">Our customers are our biggest advocates. See what they have to say about the results they've achieved.</p>
        <div class="mt-10 flex gap-4">
          <button class="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-colors">←</button>
          <button class="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-colors">→</button>
        </div>
      </div>
      <figure data-customizable data-custom-key="testi-3-quote" class="relative pl-8 border-l border-indigo-500">
        <span class="absolute -left-6 top-0 text-7xl text-white/10 font-serif">"</span>
        <blockquote class="text-2xl font-medium text-white leading-relaxed mb-8">
          This software has single-handedly transformed how our team operates. The speed and efficiency we've gained is truly unquantifiable. I cannot recommend it highly enough.
        </blockquote>
        <figcaption class="flex items-center gap-4">
          <img src="/media-pro/kids/design 1/674400512_122125962441151981_4473859238379468925_n.webp" alt="Avatar" class="w-14 h-14 rounded-full object-cover grayscale border-2 border-white/10">
          <div>
            <div class="text-lg font-bold text-white">David Miller</div>
            <div class="text-indigo-400">Head of Engineering at Globex</div>
          </div>
        </figcaption>
      </figure>
    </div>
  </div>
</section>
    `.trim()
  },
  {
    id: 'testi-v4-carousel',
    label: 'Brand Trust Carousel',
    html: `
<section data-customizable data-custom-key="testi-4" class="bg-white py-24">
  <div class="mx-auto max-w-7xl px-6 lg:px-8 text-center">
    <p data-customizable data-custom-key="testi-4-title" class="text-sm font-bold text-gray-500 uppercase tracking-widest mb-10">Trusted by innovative teams worldwide</p>
    <div class="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
      <img src="https://tailwindui.com/img/logos/tuple-logo-gray-900.svg" alt="Tuple" class="h-8">
      <img src="https://tailwindui.com/img/logos/reform-logo-gray-900.svg" alt="Reform" class="h-8">
      <img src="https://tailwindui.com/img/logos/savvycal-logo-gray-900.svg" alt="SavvyCal" class="h-8">
      <img src="https://tailwindui.com/img/logos/statamic-logo-gray-900.svg" alt="Statamic" class="h-8">
    </div>
    <div class="mt-20 max-w-3xl mx-auto">
      <div class="flex justify-center text-yellow-400 mb-6 text-xl">★★★★★</div>
      <h3 data-customizable data-custom-key="testi-4-quote" class="text-3xl font-medium text-gray-900 mb-8 leading-snug">
        "The intuitive interface and powerful backend have allowed us to scale our operations 10x without adding any extra headcount. It's simply brilliant."
      </h3>
      <div class="font-bold text-gray-900">Sarah Jenkins</div>
      <div class="text-sm text-gray-500">Operations Director</div>
    </div>
  </div>
</section>
    `.trim()
  },
  {
    id: 'testi-v5-minimal',
    label: 'Minimalist Text Only',
    html: `
<section data-customizable data-custom-key="testi-5" class="bg-[#fafafa] py-32 px-6">
  <div class="mx-auto max-w-4xl text-center">
    <p data-customizable data-custom-key="testi-5-quote" class="text-3xl md:text-5xl font-light text-[#111] leading-tight mb-12">
      "We replaced three different tools with this single platform. The transition was seamless and our team loves it."
    </p>
    <div class="h-px w-16 bg-[#111] mx-auto mb-8"></div>
    <p data-customizable data-custom-key="testi-5-author" class="text-sm font-bold tracking-widest uppercase text-[#111]">
      Elena Rodriguez, CTO
    </p>
  </div>
</section>
    `.trim()
  }
]
