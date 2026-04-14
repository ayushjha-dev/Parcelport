import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/session';

export async function GET() {
  try {
    await requireAuth(['admin']);
    const supabase = await createClient();
    
    const { data: deliveryBoys, error } = await supabase
      .from('delivery_boys')
      .select('*, profiles!delivery_boys_profile_id_fkey(id, full_name, email, mobile_number, created_at)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching delivery boys:', error);
      return NextResponse.json({ error: 'Failed to fetch delivery boys' }, { status: 500 });
    }

    // Transform data to match frontend expectations
    const transformedData = deliveryBoys?.map((boy: any) => ({
      id: boy.id,
      full_name: boy.profiles?.full_name || boy.name,
      email: boy.profiles?.email || '',
      mobile_number: boy.profiles?.mobile_number || boy.mobile,
      role: 'delivery',
      created_at: boy.profiles?.created_at || boy.created_at,
    })) || [];

    return NextResponse.json({ success: true, deliveryBoys: transformedData });
  } catch (error) {
    console.error('Error fetching delivery boys:', error);
    
    if (error instanceof Error) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ error: 'Please login to continue' }, { status: 401 });
      }
      if (error.message === 'Forbidden') {
        return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
      }
    }
    
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
