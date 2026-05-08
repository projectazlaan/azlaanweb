import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Get total sales from orders table
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('total, status');

    if (ordersError) throw ordersError;

    const totalSales = orders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;
    const totalOrders = orders?.length || 0;
    const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;

    // Get total customers (unique phones)
    const uniqueCustomers = new Set(orders?.map(o => o.phone)).size;

    // Get total products
    const { count: totalProducts, error: productsError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (productsError) throw productsError;

    // Mock changes for now (could be calculated with date filtering)
    const salesChange = 12.5;
    const ordersChange = 8.2;
    const customersChange = 5.4;
    const productsChange = 2.1;

    return NextResponse.json({
      totalSales,
      totalOrders,
      totalCustomers: uniqueCustomers,
      totalProducts: totalProducts || 0,
      salesChange,
      ordersChange,
      customersChange,
      productsChange,
      pendingOrders
    });
  } catch (error: any) {
    console.error('Stats API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
