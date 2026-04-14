import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ drid: string }> }
) {
  try {
    const { drid } = await params;

    if (!drid) {
      return NextResponse.json({ error: 'Missing DRID' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: parcel, error } = await supabase
      .from('parcels')
      .select('*')
      .eq('drid', drid)
      .single();

    if (error || !parcel) {
      return NextResponse.json({ error: 'Parcel not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: parcel });
  } catch (error) {
    console.error('Error fetching parcel:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch parcel' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ drid: string }> }
) {
  try {
    const { drid } = await params;
    const body = await request.json();

    if (!drid) {
      return NextResponse.json({ error: 'Missing DRID' }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from('parcels')
      .update(body)
      .eq('drid', drid);

    if (error) {
      console.error('Error updating parcel:', error);
      return NextResponse.json({ error: 'Failed to update parcel' }, { status: 500 });
    }

    return NextResponse.json({ success: true, drid });
  } catch (error) {
    console.error('Error updating parcel:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update parcel' },
      { status: 500 }
    );
  }
}
