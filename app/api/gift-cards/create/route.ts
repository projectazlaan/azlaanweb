import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { generateGiftCardCode, getExpiryDate } from '@/lib/giftcard';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { tier_id, initial_balance, purchaser_email, order_id } = await req.json();

    if (!tier_id || !initial_balance) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const code = generateGiftCardCode();

    const { data, error } = await supabase
      .from('gift_cards')
      .insert([{
        code,
        tier_id,
        initial_balance,
        remaining_balance: initial_balance,
        purchaser_email: purchaser_email || null,
        order_id: order_id || null,
        expires_at: getExpiryDate(),
      }])
      .select()
      .single();

    if (error) {
      console.error('Gift card creation error:', error);
      return NextResponse.json({ error: 'Failed to create gift card' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('Gift card create error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
