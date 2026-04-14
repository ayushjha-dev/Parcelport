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
    const { data: parcel, error } = await supabase
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
        landmark_note: body.landmark_note || session.landmark_note,
        parcel_awb: body.parcel_awb,
        courier_company: body.courier_company,
        parcel_description: body.parcel_description,
        weight_range: body.weight_range,
        expected_date: body.expected_date,
        preferred_time_slot: body.preferred_time_slot,
        is_fragile: body.is_fragile || false,
        status: 'submitted',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating parcel:', error);
      return NextResponse.json(
        { error: 'Failed to create parcel' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: parcel });
  } catch (error) {
    console.error('Error creating parcel:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create parcel' },
      { status: 500 }
    );
  }
}
