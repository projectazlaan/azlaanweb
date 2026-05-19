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
    <section className="bg-white text-black py-8 md:py-14 border-t border-black/[0.03]">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6">
        {/* Unified Horizontal Panel for Mobile and Desktop */}
        <div className="w-full bg-[#faf9f6]/70 rounded-[2rem] border border-black/[0.03] p-5 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
          <div className="grid grid-cols-4 gap-2 md:gap-6">
            {badges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div 
                  key={badge.id} 
                  className="flex flex-col items-center text-center gap-2 md:gap-3.5"
                >
                  <div className="shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full border border-black/10 flex items-center justify-center bg-white shadow-sm">
                    <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-black" strokeWidth={1.5} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[8px] md:text-[11px] font-black uppercase tracking-[0.05em] md:tracking-[0.2em] leading-tight">
                      {badge.title}
                    </h4>
                    <p className="text-black/50 text-[7px] md:text-[9.5px] leading-tight max-w-[80px] md:max-w-[160px] font-medium mx-auto">
                      {badge.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
