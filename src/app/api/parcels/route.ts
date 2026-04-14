import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/session';

export async function GET(request: Request) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const supabase = await createClient();
    let query = supabase
      .from('parcels')
      .select('*')
      .order('created_at', { ascending: false });

    // Students can only see their own parcels
    if (session.role === 'student') {
      query = query.eq('student_id', session.id);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: parcels, error } = await query;

    if (error) {
      console.error('Error fetching parcels:', error);
      return NextResponse.json(
        { error: 'Failed to fetch parcels' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: parcels });
  } catch (error) {
    console.error('Error fetching parcels:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch parcels' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAuth(['student']);
    const body = await request.json();

    const supabase = await createClient();

    // Generate DRID using database function
    const { data: dridData, error: dridError } = await supabase
      .rpc('generate_drid');

    if (dridError) {
      console.error('Error generating DRID:', dridError);
      return NextResponse.json(
        { error: 'Failed to generate tracking ID' },
        { status: 500 }
      );
    }

    // Create parcel
    const { data: parcel, error: parcelError } = await supabase
      .from('parcels')
      .insert({
        drid: dridData,
        student_id: session.id,
        student_name: session.full_name,
        student_roll_no: session.student_roll_no,
        student_mobile: session.mobile_number,
        student_email: session.email,
        hostel_block: body.hostel_block || session.hostel_block,
        floor_number: body.floor_number || session.floor_number,
        room_number: body.room_number || session.room_number,
        landmark_note: body.landmark || body.landmark_note || session.landmark_note,
        parcel_awb: body.tracking_id || body.parcel_awb,
        courier_company: body.courier_company,
        parcel_description: body.description || body.parcel_description,
        weight_range: body.weight_range,
        expected_date: body.expected_date,
        preferred_time_slot: body.preferred_time_slot,
        is_fragile: body.is_fragile || false,
        status: body.payment_method ? 'payment_pending' : 'submitted',
      })
      .select()
      .single();

    if (parcelError) {
      console.error('Error creating parcel:', parcelError);
      return NextResponse.json(
        { error: 'Failed to create parcel' },
        { status: 500 }
      );
    }

    // Create payment record if payment data provided
    if (body.payment_method && body.transaction_id) {
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          parcel_id: parcel.id,
          delivery_fee_amount: body.payment_amount || 10,
          delivery_fee_method: body.payment_method,
          delivery_fee_transaction_id: body.transaction_id,
          delivery_fee_payment_date: body.payment_date,
          delivery_fee_screenshot_url: body.payment_screenshot_url,
          delivery_fee_status: 'pending',
        });

      if (paymentError) {
        console.error('Error creating payment record:', paymentError);
        // Don't fail the entire request, just log the error
      }
    }

    return NextResponse.json({ success: true, data: parcel });
  } catch (error) {
    console.error('Error creating parcel:', error);
    
    if (error instanceof Error) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ error: 'Please login to continue' }, { status: 401 });
      }
      if (error.message === 'Forbidden') {
        return NextResponse.json({ error: 'Student access required' }, { status: 403 });
      }
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create parcel' },
      { status: 500 }
    );
  }
}
