import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET — fetch all sections for a page
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || 'home';

  const { data: sections, error } = await supabase
    .from('page_sections')
    .select('*')
    .eq('page_name', page)
    .order('section_order', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ sections });
}

// POST — create a new section
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  const { data: section, error } = await supabase
    .from('page_sections')
    .insert({
      page_name: body.page,
      section_type: body.type,
      title: body.title,
      is_active: body.isActive ?? true,
      section_order: body.order ?? 0,
      content: body.data ?? {}
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ section });
}

// PATCH — update section status or data
export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, ...updates } = body;

  const updateData: any = {};
  if (updates.isActive !== undefined) updateData.is_active = updates.isActive;
  if (updates.data) updateData.content = updates.data;
  if (updates.title) updateData.title = updates.title;
  updateData.updated_at = new Date().toISOString();

  const { data: section, error } = await supabase
    .from('page_sections')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ section });
}

// DELETE — remove a section
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const { error } = await supabase
    .from('page_sections')
    .delete()
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
