import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orders } = body; // Expected format: [{ id: '...', order: 0 }, ...]

    if (!Array.isArray(orders)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    // Update all orders in parallel
    const updates = orders.map((item: { id: string; order: number }) =>
      supabase
        .from('page_sections')
        .update({ section_order: item.order, updated_at: new Date().toISOString() })
        .eq('id', item.id)
    );

    const results = await Promise.all(updates);
    
    // Check if any update failed
    const hasError = results.some(r => r.error);
    if (hasError) throw new Error('One or more updates failed');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
