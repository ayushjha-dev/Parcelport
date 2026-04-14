import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/session';

export async function POST(request: Request) {
  try {
    await requireAuth(['admin']);
    const { parcel_id, delivery_boy_id } = await request.json();

    if (!parcel_id || !delivery_boy_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Generate OTP for delivery
    const { data: otpData, error: otpError } = await supabase.rpc('generate_otp');
    if (otpError) {
      console.error('Error generating OTP:', otpError);
      return NextResponse.json({ error: 'Failed to generate OTP' }, { status: 500 });
    }

    // Create delivery assignment
    const { data: assignment, error: assignError } = await supabase
      .from('delivery_assignments')
      .insert({
        parcel_id,
        delivery_boy_id,
        assigned_by: (await requireAuth(['admin'])).id,
        otp_code: otpData,
        otp_generated_at: new Date().toISOString(),
        otp_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single();

    if (assignError) {
      console.error('Error creating assignment:', assignError);
      return NextResponse.json({ error: 'Failed to create assignment' }, { status: 500 });
    }

    // Update parcel status
    const { error: updateError } = await supabase
      .from('parcels')
      .update({
        status: 'assigned',
        assigned_at: new Date().toISOString(),
      })
      .eq('id', parcel_id);

    if (updateError) {
      console.error('Error updating parcel:', updateError);
      return NextResponse.json({ error: 'Failed to update parcel' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Parcel assigned successfully',
      data: assignment
    });
  } catch (error) {
    console.error('Error assigning parcel:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to assign parcel' },
      { status: 500 }
    );
  }
}
