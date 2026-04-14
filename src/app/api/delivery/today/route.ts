import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/session';

export async function GET(request: Request) {
  try {
    const session = await requireAuth(['delivery_boy']);

    const supabase = await createClient();

    // Get delivery boy record
    const { data: deliveryBoy, error: dbError } = await supabase
      .from('delivery_boys')
      .select('id')
      .eq('profile_id', session.id)
      .single();

    if (dbError || !deliveryBoy) {
      return NextResponse.json(
        { error: 'Delivery boy profile not found' },
        { status: 404 }
      );
    }

    // Get today's assignments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data: assignments, error } = await supabase
      .from('delivery_assignments')
      .select(`
        *,
        parcels (*)
      `)
      .eq('delivery_boy_id', deliveryBoy.id)
      .gte('created_at', today.toISOString())
      .lt('created_at', tomorrow.toISOString())
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching assignments:', error);
      return NextResponse.json(
        { error: 'Failed to fetch assignments' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: assignments });
  } catch (error) {
    console.error('Error fetching today parcels:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch parcels' },
      { status: 500 }
    );
  }
}
