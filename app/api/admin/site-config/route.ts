import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET — fetch all site configs as a key-value map
export async function GET() {
  const { data, error } = await supabase.from('site_config').select('*');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  // Transform array of {key, value} to { [key]: value }
  const configMap = data?.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>) || {};

  return NextResponse.json(configMap);
}

// POST — upsert multiple config keys
export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Expected format: { key1: 'value1', key2: 'value2' }
    
    const updates = Object.entries(body).map(([key, value]) => ({
      key,
      value: String(value)
    }));

    if (updates.length === 0) {
      return NextResponse.json({ success: true });
    }

    const { error } = await supabase
      .from('site_config')
      .upsert(updates, { onConflict: 'key' });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
