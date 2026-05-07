import { ShieldCheck, Truck, RotateCcw, HeadphonesIcon } from 'lucide-react';

const badges = [
  {
    id: 1,
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over ৳5,000 across Bangladesh',
  },
  {
    id: 2,
    icon: ShieldCheck,
    title: '100% Authentic',
    description: 'Directly from our own artisan workshops',
  },
  {
    id: 3,
    icon: RotateCcw,
    title: 'Easy Returns',
    description: '7-day hassle-free return policy',
  },
  {
    id: 4,
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'Dedicated customer service at your fingertips',
  },
];

export default function TrustBadges() {
  return (
    <section className="bg-[#0d0d0d] text-white py-6 md:py-14 border-t border-white/[0.03]">
      <div className="max-w-[1600px] mx-auto px-2 md:px-6">
        <div className="grid grid-cols-4 gap-1 md:gap-4">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div key={badge.id} className="flex flex-col items-center text-center gap-1">
                <div className="shrink-0 w-6 h-6 md:w-10 md:h-10 rounded-full border border-white/10 flex items-center justify-center">
                  <Icon className="w-3 h-3 md:w-4 md:h-4 text-white" strokeWidth={1.5} />
                </div>
                <h4 className="text-[7px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] leading-tight">
                  {badge.title.split(' ')[0]} {badge.title.split(' ')[1] || ''}
                </h4>
                <p className="hidden md:block text-white/30 text-[9px] leading-tight max-w-[150px]">
                  {badge.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
