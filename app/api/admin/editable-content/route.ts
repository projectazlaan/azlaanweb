import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page');

  let query = supabase.from('editable_content').select('*');
  if (page) query = query.eq('page', page);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  // Transform to a flat object for easy access in frontend
  const contentMap = data?.reduce((acc, curr) => {
    const key = `${curr.section}_${curr.element_key}`;
    acc[key] = {
      en: curr.value_en,
      bn: curr.value_bn,
      metadata: curr.metadata
    };
    return acc;
  }, {} as any) || {};

  return NextResponse.json(contentMap);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Upsert editable content
    const { data, error } = await supabase
      .from('editable_content')
      .upsert({
        page: body.page,
        section: body.section,
        element_key: body.key,
        content_type: body.type,
        value_en: body.content,
        value_bn: body.contentBn,
        metadata: body.styles || {}
      }, { onConflict: 'page,section,element_key' })
      .select()
      .single();

    if (error) throw error;
    
    // Log activity for audit trail
    await supabase.from('admin_activity_logs').insert({
      action: 'UPDATE_CONTENT',
      entity_type: 'editable_content',
      entity_id: data.id,
      new_value: data
    });

    return NextResponse.json({ content: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
