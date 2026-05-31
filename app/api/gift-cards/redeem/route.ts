import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { validateGiftCard, GiftCardRecord } from '@/lib/giftcard';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Gift card code is required' }, { status: 400 });
    }

    const normalizedCode = code.trim().toUpperCase();

    const { data, error } = await supabase
      .from('gift_cards')
      .select('*')
      .eq('code', normalizedCode)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Invalid gift card code' }, { status: 404 });
    }

    const card = data as GiftCardRecord;
    const validation = validateGiftCard(card);

    if (!validation.valid) {
      return NextResponse.json({ error: validation.reason }, { status: 422 });
    }

    return NextResponse.json({
      valid: true,
      balance: card.remaining_balance,
      tier_id: card.tier_id,
    });
  } catch (err) {
    console.error('Gift card redeem error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
