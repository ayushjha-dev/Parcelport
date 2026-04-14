import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/session';

export async function GET() {
  try {
    await requireAuth(['admin']);
    const supabase = await createClient();
    
    const { data: deliveryBoys, error } = await supabase
      .from('delivery_boys')
      .select('*, profiles!delivery_boys_profile_id_fkey(full_name, email, mobile_number)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching delivery boys:', error);
      return NextResponse.json({ error: 'Failed to fetch delivery boys' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: deliveryBoys });
  } catch (error) {
    console.error('Error fetching delivery boys:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch delivery boys' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth(['admin']);
    const body = await request.json();
    const supabase = await createClient();

    const { data: deliveryBoy, error } = await supabase
      .from('delivery_boys')
      .insert({
        profile_id: body.profile_id,
        name: body.name,
        mobile: body.mobile,
        campus_zone: body.campus_zone,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating delivery boy:', error);
      return NextResponse.json({ error: 'Failed to create delivery boy' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: deliveryBoy });
  } catch (error) {
    console.error('Error creating delivery boy:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create delivery boy' },
      { status: 500 }
    );
  }
}
