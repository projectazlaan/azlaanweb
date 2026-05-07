export const FeatureBlocks = [
  {
    id: 'features-v1-grid',
    label: 'Modern Grid Features',
    html: `
<section data-customizable data-custom-key="features-1" class="bg-white py-24 sm:py-32">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="mx-auto max-w-2xl lg:text-center">
      <h2 data-customizable data-custom-key="features-1-tag" class="text-base font-bold leading-7 text-indigo-600">Deploy faster</h2>
      <p data-customizable data-custom-key="features-1-title" class="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">Everything you need to deploy your app</p>
      <p data-customizable data-custom-key="features-1-desc" class="mt-6 text-lg leading-8 text-gray-600">Quis tellus eget adipiscing convallis sit sit eget aliquet quis. Suspendisse eget egestas a elementum pulvinar et feugiat blandit at.</p>
    </div>
    <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
      <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
        <!-- Feature 1 -->
        <div data-customizable data-custom-key="features-1-item-1" class="flex flex-col p-8 bg-gray-50 rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-indigo-500/10 transition-all border border-transparent hover:border-gray-100">
          <dt class="flex items-center gap-x-3 text-base font-bold leading-7 text-gray-900">
            <div class="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xl">1</div>
            Push to deploy
          </dt>
          <dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
            <p class="flex-auto">Morbi viverra dui mi arcu sed. Tellus semper adipiscing suspendisse semper morbi.</p>
            <p class="mt-6"><a href="#" class="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Learn more <span aria-hidden="true">→</span></a></p>
          </dd>
        </div>
        <!-- Feature 2 -->
        <div data-customizable data-custom-key="features-1-item-2" class="flex flex-col p-8 bg-gray-50 rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-indigo-500/10 transition-all border border-transparent hover:border-gray-100">
          <dt class="flex items-center gap-x-3 text-base font-bold leading-7 text-gray-900">
            <div class="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xl">2</div>
            SSL certificates
          </dt>
          <dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
            <p class="flex-auto">Sit quis amet rutrum tellus ullamcorper ultricies libero dolor eget. Sem sodales gravida quam turpis enim lacus amet.</p>
            <p class="mt-6"><a href="#" class="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Learn more <span aria-hidden="true">→</span></a></p>
          </dd>
        </div>
        <!-- Feature 3 -->
        <div data-customizable data-custom-key="features-1-item-3" class="flex flex-col p-8 bg-gray-50 rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-indigo-500/10 transition-all border border-transparent hover:border-gray-100">
          <dt class="flex items-center gap-x-3 text-base font-bold leading-7 text-gray-900">
            <div class="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xl">3</div>
            Simple queues
          </dt>
          <dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
            <p class="flex-auto">Quisque est vel vulputate cursus. Risus proin diam nunc commodo. Lobortis auctor congue commodo diam neque.</p>
            <p class="mt-6"><a href="#" class="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Learn more <span aria-hidden="true">→</span></a></p>
          </dd>
        </div>
      </dl>
    </div>
  </div>
</section>
    `.trim()
  },
  {
    id: 'features-v2-bento',
    label: 'Bento Box Layout',
    html: `
<section data-customizable data-custom-key="features-2" class="bg-gray-900 py-24 sm:py-32">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="mx-auto max-w-2xl text-center mb-16">
      <h2 data-customizable data-custom-key="features-2-title" class="text-3xl font-black tracking-tight text-white sm:text-4xl">Everything you need</h2>
      <p data-customizable data-custom-key="features-2-desc" class="mt-4 text-lg text-gray-400">Discover all the tools available in our ecosystem.</p>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Big Box -->
      <div data-customizable data-custom-key="features-2-box-1" class="lg:col-span-2 relative overflow-hidden rounded-3xl bg-gray-800 p-10 ring-1 ring-white/10">
        <h3 class="text-2xl font-bold text-white mb-4">Advanced Analytics</h3>
        <p class="text-gray-400 max-w-md">Get deep insights into your user behavior with our privacy-first analytics engine built directly into the core.</p>
        <img src="/media-pro/Cover/667707081_122124567927151981_5917933416815199932_n.webp" alt="Analytics" class="absolute -bottom-24 -right-24 w-[400px] rounded-xl shadow-2xl opacity-50 blur-sm group-hover:blur-0 transition-all">
      </div>
      <!-- Small Box 1 -->
      <div data-customizable data-custom-key="features-2-box-2" class="relative overflow-hidden rounded-3xl bg-indigo-600 p-10">
        <h3 class="text-2xl font-bold text-white mb-4">Fast API</h3>
        <p class="text-indigo-100">Connect your tools instantly with our GraphQL endpoints.</p>
      </div>
      <!-- Small Box 2 -->
      <div data-customizable data-custom-key="features-2-box-3" class="relative overflow-hidden rounded-3xl bg-gray-800 p-10 ring-1 ring-white/10">
        <h3 class="text-2xl font-bold text-white mb-4">Secure Storage</h3>
        <p class="text-gray-400">End-to-end encryption for all your sensitive files.</p>
      </div>
      <!-- Wide Box -->
      <div data-customizable data-custom-key="features-2-box-4" class="lg:col-span-2 relative overflow-hidden rounded-3xl bg-gray-800 p-10 ring-1 ring-white/10 flex items-center justify-between">
        <div>
          <h3 class="text-2xl font-bold text-white mb-4">Team Collaboration</h3>
          <p class="text-gray-400 max-w-sm">Work together in real-time without conflicts.</p>
        </div>
        <a href="#" class="rounded-full bg-white px-6 py-3 text-sm font-bold text-gray-900 hover:bg-gray-200 transition-colors">Invite Team</a>
      </div>
    </div>
  </div>
</section>
    `.trim()
  },
  {
    id: 'features-v3-zigzag',
    label: 'Zig-Zag Layout',
    html: `
<section data-customizable data-custom-key="features-3" class="bg-white py-24 sm:py-32 overflow-hidden">
  <div class="mx-auto max-w-7xl px-6 lg:px-8 space-y-24">
    <!-- Row 1 -->
    <div class="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
      <div>
        <h2 data-customizable data-custom-key="features-3-title-1" class="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl mb-6">Designed for speed</h2>
        <p data-customizable data-custom-key="features-3-desc-1" class="text-lg text-gray-600 mb-8">Stop waiting for builds to finish. Our platform uses edge computing to render your pages instantly around the globe.</p>
        <ul class="space-y-4 text-gray-600 font-medium">
          <li class="flex items-center gap-3"><span class="text-indigo-600 font-bold">✓</span> Global CDN caching</li>
          <li class="flex items-center gap-3"><span class="text-indigo-600 font-bold">✓</span> Automated image optimization</li>
          <li class="flex items-center gap-3"><span class="text-indigo-600 font-bold">✓</span> Instant rollbacks</li>
        </ul>
      </div>
      <div class="mt-10 lg:mt-0">
        <img data-customizable data-custom-key="features-3-img-1" src="/media-pro/Cover/667707081_122124567927151981_5917933416815199932_n.webp" alt="Speed" class="rounded-3xl shadow-2xl w-full object-cover aspect-video">
      </div>
    </div>
    <!-- Row 2 -->
    <div class="lg:grid lg:grid-cols-2 lg:gap-16 items-center flex flex-col-reverse">
      <div class="mt-10 lg:mt-0">
        <img data-customizable data-custom-key="features-3-img-2" src="/media-pro/Cover/667707081_122124567927151981_5917933416815199932_n.webp" alt="Collaboration" class="rounded-3xl shadow-2xl w-full object-cover aspect-video">
      </div>
      <div>
        <h2 data-customizable data-custom-key="features-3-title-2" class="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl mb-6">Work as a team</h2>
        <p data-customizable data-custom-key="features-3-desc-2" class="text-lg text-gray-600 mb-8">Collaboration has never been easier. Invite your team, assign roles, and see changes in real-time.</p>
        <a data-customizable data-custom-key="features-3-btn-2" href="#" class="inline-flex items-center font-bold text-indigo-600 hover:text-indigo-500">Discover Collaboration <span class="ml-2">→</span></a>
      </div>
    </div>
  </div>
</section>
    `.trim()
  },
  {
    id: 'features-v4-cards',
    label: 'Dark Glow Cards',
    html: `
<section data-customizable data-custom-key="features-4" class="bg-[#050505] py-24 sm:py-32">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="text-center mb-20">
      <h2 data-customizable data-custom-key="features-4-title" class="text-4xl font-black text-white">Superpowers for your team</h2>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div data-customizable data-custom-key="features-4-card-1" class="group relative bg-[#111] border border-white/10 p-8 rounded-3xl overflow-hidden hover:border-indigo-500/50 transition-colors">
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="relative z-10">
          <div class="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-indigo-400 font-bold text-xl mb-6">⚡</div>
          <h3 class="text-xl font-bold text-white mb-3">Lightning Fast</h3>
          <p class="text-gray-400">Everything loads instantly, giving your users the best possible experience on any device.</p>
        </div>
      </div>
      <div data-customizable data-custom-key="features-4-card-2" class="group relative bg-[#111] border border-white/10 p-8 rounded-3xl overflow-hidden hover:border-pink-500/50 transition-colors">
        <div class="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="relative z-10">
          <div class="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-pink-400 font-bold text-xl mb-6">🛡️</div>
          <h3 class="text-xl font-bold text-white mb-3">Highly Secure</h3>
          <p class="text-gray-400">Military-grade encryption protects your data at rest and in transit automatically.</p>
        </div>
      </div>
      <div data-customizable data-custom-key="features-4-card-3" class="group relative bg-[#111] border border-white/10 p-8 rounded-3xl overflow-hidden hover:border-emerald-500/50 transition-colors">
        <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="relative z-10">
          <div class="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-emerald-400 font-bold text-xl mb-6">📈</div>
          <h3 class="text-xl font-bold text-white mb-3">Scalable</h3>
          <p class="text-gray-400">Our infrastructure grows with you. From 10 to 10 million users without changing code.</p>
        </div>
      </div>
    </div>
  </div>
</section>
    `.trim()
  },
  {
    id: 'features-v5-minimal',
    label: 'Clean Typography',
    html: `
<section data-customizable data-custom-key="features-5" class="bg-white py-32 px-6 lg:px-8 border-t border-b border-gray-100">
  <div class="mx-auto max-w-5xl">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-16">
      <div data-customizable data-custom-key="features-5-item-1">
        <h3 class="text-2xl font-medium tracking-tight text-gray-900 mb-4">Precision Engineering</h3>
        <p class="text-gray-500 leading-relaxed">Every component is meticulously crafted to ensure the highest quality standards. We leave no stone unturned in our pursuit of perfection.</p>
      </div>
      <div data-customizable data-custom-key="features-5-item-2">
        <h3 class="text-2xl font-medium tracking-tight text-gray-900 mb-4">Absolute Clarity</h3>
        <p class="text-gray-500 leading-relaxed">Our interfaces are designed to get out of your way. No clutter, no confusion. Just the tools you need right when you need them.</p>
      </div>
      <div data-customizable data-custom-key="features-5-item-3">
        <h3 class="text-2xl font-medium tracking-tight text-gray-900 mb-4">Enduring Architecture</h3>
        <p class="text-gray-500 leading-relaxed">Built on a foundation that will stand the test of time. Update safely, scale confidently, and never worry about legacy technical debt.</p>
      </div>
      <div data-customizable data-custom-key="features-5-item-4">
        <h3 class="text-2xl font-medium tracking-tight text-gray-900 mb-4">Human Centric</h3>
        <p class="text-gray-500 leading-relaxed">Technology should serve people, not the other way around. Our entire philosophy centers on augmenting human capability.</p>
      </div>
    </div>
  </div>
</section>
    `.trim()
  }
]
