import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET — all reels
export async function GET() {
  const { data, error } = await supabase
    .from('reels')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// POST — add reel
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, link, platform } = body;
  if (!title || !link) return NextResponse.json({ error: 'title and link required' }, { status: 400 });

  const { data, error } = await supabase
    .from('reels')
    .insert([{ title, link, platform: platform ?? 'YouTube', trending: false }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
