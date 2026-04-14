import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/session';

export async function GET() {
  try {
    await requireAuth(['admin']);
    const supabase = await createClient();

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's parcels count
    const { count: todayParcels } = await supabase
      .from('parcels')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString())
      .lt('created_at', tomorrow.toISOString());

    // Get pending verification count
    const { count: pendingVerification } = await supabase
      .from('parcels')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'payment_pending');

    // Get out for delivery count
    const { count: outForDelivery } = await supabase
      .from('parcels')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'out_for_delivery');

    // Get delivered today count
    const { count: deliveredToday } = await supabase
      .from('parcels')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'delivered')
      .gte('delivered_at', today.toISOString())
      .lt('delivered_at', tomorrow.toISOString());

    // Get today's revenue (verified payments)
    const { data: revenueData } = await supabase
      .from('payments')
      .select('delivery_fee_amount')
      .eq('delivery_fee_status', 'verified')
      .gte('delivery_fee_verified_at', today.toISOString())
      .lt('delivery_fee_verified_at', tomorrow.toISOString());

    const revenueToday = revenueData?.reduce((sum, p) => sum + Number(p.delivery_fee_amount || 0), 0) || 0;

    return NextResponse.json({
      success: true,
      data: {
        todayParcels: todayParcels || 0,
        pendingVerification: pendingVerification || 0,
        outForDelivery: outForDelivery || 0,
        deliveredToday: deliveredToday || 0,
        revenueToday: revenueToday,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
