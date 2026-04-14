import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/session';

export async function PUT(request: NextRequest) {
  try {
    // Require authentication
    const session = await requireAuth();
    
    const body = await request.json();
    const { full_name, mobile_number } = body;

    if (!full_name || !mobile_number) {
      return NextResponse.json(
        { error: 'Full name and mobile number are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    // Update profile
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: full_name.trim(),
        mobile_number: mobile_number.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.id);

    if (error) {
      console.error('Profile update error:', error);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Profile update error:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'An error occurred while updating profile' },
      { status: 500 }
    );
  }
}
