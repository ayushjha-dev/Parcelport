import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/session';

export async function GET(request: Request) {
  try {
    await requireAuth(['admin']);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const supabase = await createClient();
    let query = supabase
      .from('parcels')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (status && status !== 'all') {
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

    // Apply search filter if needed
    const filtered = search
      ? parcels.filter(p => 
          p.drid?.toLowerCase().includes(search.toLowerCase()) ||
          p.student_name?.toLowerCase().includes(search.toLowerCase()) ||
          p.student_roll_no?.toLowerCase().includes(search.toLowerCase())
        )
      : parcels;

    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    console.error('Error fetching parcels:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch parcels' },
      { status: 500 }
    );
  }
}
