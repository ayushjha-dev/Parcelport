import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/session';

export async function POST(request: Request) {
  try {
    const session = await requireAuth(['delivery_boy']);
    const body = await request.json();
    const { parcel_id, failure_type, failure_note, failure_photo_url } = body;

    if (!parcel_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = await createClient();

    // Get delivery boy ID
    const { data: deliveryBoy } = await supabase
      .from('delivery_boys')
      .select('id')
      .eq('profile_id', session.id)
      .single();

    if (!deliveryBoy) {
      return NextResponse.json({ error: 'Delivery boy not found' }, { status: 404 });
    }

    // Update delivery assignment with failure info
    const { data: assignment, error: assignError } = await supabase
      .from('delivery_assignments')
      .update({
        failed_at: new Date().toISOString(),
        failure_type,
        failure_note,
        failure_photo_url,
      })
      .eq('parcel_id', parcel_id)
      .eq('delivery_boy_id', deliveryBoy.id)
      .select()
      .single();

    if (assignError) {
      console.error('Error updating assignment:', assignError);
      return NextResponse.json({ error: 'Failed to report issue' }, { status: 500 });
    }

    // Update parcel status
    await supabase
      .from('parcels')
      .update({ status: 'failed_delivery' })
      .eq('id', parcel_id);

    return NextResponse.json({ success: true, data: assignment });
  } catch (error) {
    console.error('Error reporting delivery issue:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to report issue' },
      { status: 500 }
    );
  }
}
