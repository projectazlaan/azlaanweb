import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    // Fetch activity logs
    const { data: logs, error: logsError } = await supabase
      .from('admin_activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (logsError) throw logsError;

    // Fetch recent orders as "notifications"
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, customer_name, status, created_at')
      .order('created_at', { ascending: false })
      .limit(20);

    if (ordersError) throw ordersError;

    return NextResponse.json({ 
      logs: logs || [], 
      notifications: orders?.map(o => ({
        id: o.id,
        type: 'ORDER',
        title: 'New Order Received',
        message: `Order #${o.id.slice(0, 8)} from ${o.customer_name}`,
        status: o.status,
        time: o.created_at
      })) || []
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
