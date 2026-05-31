export interface GiftCardRecord {
  id: string;
  code: string;
  tier_id: string;
  initial_balance: number;
  remaining_balance: number;
  status: 'active' | 'used' | 'expired' | 'cancelled';
  purchaser_email?: string;
  purchased_at: string;
  expires_at: string;
  used_at?: string;
  order_id?: string;
}

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateGiftCardCode(): string {
  let code = '';
  for (let i = 0; i < 10; i++) {
    if (i === 4 || i === 7) code += '-';
    code += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return code;
}

export function validateGiftCard(
  card: GiftCardRecord
): { valid: boolean; reason?: string } {
  if (card.status === 'used') return { valid: false, reason: 'This card has already been used.' };
  if (card.status === 'expired') return { valid: false, reason: 'This card has expired.' };
  if (card.status === 'cancelled') return { valid: false, reason: 'This card has been cancelled.' };
  if (new Date(card.expires_at) < new Date()) return { valid: false, reason: 'This card has expired.' };
  if (card.remaining_balance <= 0) return { valid: false, reason: 'This card has no remaining balance.' };
  return { valid: true };
}

export function getExpiryDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString();
}
