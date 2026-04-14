import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/session';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ drid: string }> }
) {
  try {
    const session = await requireAuth(['delivery_boy']);
    const { drid } = await params;

    if (!drid) {
      return NextResponse.json({ error: 'Missing DRID' }, { status: 400 });
    }

    const supabase = await createClient();

    // Get parcel
    const { data: parcel, error: parcelError } = await supabase
      .from('parcels')
      .select('id')
      .eq('drid', drid)
      .single();

    if (parcelError || !parcel) {
      return NextResponse.json({ error: 'Parcel not found' }, { status: 404 });
    }

    // Get delivery boy ID
    const { data: deliveryBoy } = await supabase
      .from('delivery_boys')
      .select('id')
      .eq('profile_id', session.id)
      .single();

    if (!deliveryBoy) {
      return NextResponse.json({ error: 'Delivery boy not found' }, { status: 404 });
    }

    // Update delivery assignment
    await supabase
      .from('delivery_assignments')
      .update({ picked_from_gate_at: new Date().toISOString() })
      .eq('parcel_id', parcel.id)
      .eq('delivery_boy_id', deliveryBoy.id);

    // Update parcel status
    await supabase
      .from('parcels')
      .update({ status: 'out_for_delivery', out_for_delivery_at: new Date().toISOString() })
      .eq('id', parcel.id);

    return NextResponse.json({ 
      success: true, 
      message: 'Parcel picked up successfully',
      drid 
    });
  } catch (error) {
    console.error('Error updating pickup status:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update status' },
      { status: 500 }
    );
  }
}
