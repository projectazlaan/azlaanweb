import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET — list all products
export async function GET() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST — create new product
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, price, category, stock_count, in_stock, description, image_url, tag, sizes } = body;

  if (!name || !price) {
    return NextResponse.json({ error: 'Name and price are required.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('products')
    .insert([{ name, price, category, stock_count, in_stock: in_stock ?? true, description, image_url, tag, sizes }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
