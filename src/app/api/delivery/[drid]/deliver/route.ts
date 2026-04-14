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
    const { otp, delivery_photo_url } = await request.json();

    if (!drid || !otp) {
      return NextResponse.json({ error: 'Missing DRID or OTP' }, { status: 400 });
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

    // Get assignment and verify OTP
    const { data: assignment, error: assignError } = await supabase
      .from('delivery_assignments')
      .select('otp_code')
      .eq('parcel_id', parcel.id)
      .eq('delivery_boy_id', deliveryBoy.id)
      .single();

    if (assignError || !assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    // Verify OTP
    if (assignment.otp_code !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    // Update delivery assignment
    await supabase
      .from('delivery_assignments')
      .update({
        delivered_at: new Date().toISOString(),
        otp_verified_at: new Date().toISOString(),
        delivery_photo_url,
      })
      .eq('parcel_id', parcel.id)
      .eq('delivery_boy_id', deliveryBoy.id);

    // Update parcel status
    await supabase
      .from('parcels')
      .update({ status: 'delivered', delivered_at: new Date().toISOString() })
      .eq('id', parcel.id);

    return NextResponse.json({ 
      success: true, 
      message: 'Parcel delivered successfully',
      drid 
    });
  } catch (error) {
    console.error('Error marking delivery:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to mark delivery' },
      { status: 500 }
    );
  }
}
