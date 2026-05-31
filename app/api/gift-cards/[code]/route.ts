import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const normalizedCode = code.toUpperCase();

    const { data, error } = await supabase
      .from('gift_cards')
      .select('*')
      .eq('code', normalizedCode)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Gift card not found' }, { status: 404 });
    }

    return NextResponse.json({
      balance: data.remaining_balance,
      status: data.status,
      expires_at: data.expires_at,
      tier_id: data.tier_id,
    });
  } catch (err) {
    console.error('Gift card lookup error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
