// Central config for Azlaan Gift Card tiers
export interface GiftCardTier {
  id: string;
  name: string;
  payPrice: number;    // What customer pays
  getValue: number;    // What customer receives in credit
  bonusPct: number;    // Bonus percentage
  badge: string;       // Display badge text
  theme: {
    bg: string;
    shimmer: string;
    text: string;
    accent: string;
    badge: string;
    badgeText: string;
    border: string;
    glow: string;
  };
  popular?: boolean;
}

export const GIFT_CARD_TIERS: GiftCardTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    payPrice: 900,
    getValue: 1000,
    bonusPct: 10,
    badge: '10% FREE',
    theme: {
      bg: 'from-[#1a1a1a] to-[#2c2c2c]',
      shimmer: 'from-white/0 via-white/6 to-white/0',
      text: 'text-white',
      accent: 'text-white/40',
      badge: 'bg-white/10',
      badgeText: 'text-white/80',
      border: 'border-white/[0.06]',
      glow: 'shadow-black/60',
    },
  },
  {
    id: 'value',
    name: 'Value',
    payPrice: 1800,
    getValue: 2000,
    bonusPct: 11,
    badge: '11% FREE',
    popular: true,
    theme: {
      bg: 'from-[#1D1D1F] via-[#252527] to-[#1D1D1F]',
      shimmer: 'from-[#C9A84C]/0 via-[#C9A84C]/10 to-[#C9A84C]/0',
      text: 'text-white',
      accent: 'text-[#C9A84C]/80',
      badge: 'bg-[#C9A84C]/20',
      badgeText: 'text-[#C9A84C]',
      border: 'border-[#C9A84C]/30',
      glow: 'shadow-[#C9A84C]/10',
    },
  },
  {
    id: 'premium',
    name: 'Premium',
    payPrice: 4000,
    getValue: 5000,
    bonusPct: 25,
    badge: '25% FREE',
    theme: {
      bg: 'from-[#C9A84C] via-[#B8952E] to-[#96751C]',
      shimmer: 'from-white/0 via-white/20 to-white/0',
      text: 'text-[#1D1D1F]',
      accent: 'text-[#1D1D1F]/60',
      badge: 'bg-[#1D1D1F]/15',
      badgeText: 'text-[#1D1D1F]',
      border: 'border-[#E8C86A]/50',
      glow: 'shadow-[#C9A84C]/30',
    },
  },
  {
    id: 'luxury',
    name: 'Luxury',
    payPrice: 8000,
    getValue: 10000,
    bonusPct: 25,
    badge: '25% FREE',
    theme: {
      bg: 'from-[#0d0d0d] via-[#161616] to-[#0d0d0d]',
      shimmer: 'from-[#C9A84C]/0 via-[#C9A84C]/15 to-[#C9A84C]/0',
      text: 'text-[#C9A84C]',
      accent: 'text-[#C9A84C]/50',
      badge: 'bg-[#C9A84C]/15',
      badgeText: 'text-[#C9A84C]',
      border: 'border-[#C9A84C]/20',
      glow: 'shadow-[#C9A84C]/15',
    },
  },
];
