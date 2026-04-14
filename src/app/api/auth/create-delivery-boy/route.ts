import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { hashPassword } from '@/lib/auth/password';
import { requireAuth } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    const session = await requireAuth(['admin']);

    const body = await request.json();
    const { fullName, email, phone, password, vehicleNumber, licenseNumber } = body;

    // Validate input
    if (!fullName || !email || !phone || !password) {
      return NextResponse.json(
        { error: 'Full name, email, phone, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'This email is already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create delivery boy profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        email: email.toLowerCase(),
        full_name: fullName,
        mobile_number: phone,
        role: 'delivery',
        password_hash: passwordHash,
        is_active: true,
      })
      .select()
      .single();

    if (profileError) {
      console.error('Database error:', profileError);
      return NextResponse.json(
        { error: 'Failed to create delivery boy account' },
        { status: 500 }
      );
    }

    // Create delivery boy record
    const { error: deliveryBoyError } = await supabase
      .from('delivery_boys')
      .insert({
        profile_id: profile.id,
        name: fullName,
        mobile: phone,
        is_active: true,
      });

    if (deliveryBoyError) {
      console.error('Delivery boy record error:', deliveryBoyError);
      // Rollback profile creation
      await supabase.from('profiles').delete().eq('id', profile.id);
      return NextResponse.json(
        { error: 'Failed to create delivery boy record' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Delivery boy account created successfully',
      user: {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        role: profile.role,
      },
    });
  } catch (error) {
    console.error('Create delivery boy error:', error);
    
    if (error instanceof Error) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ error: 'Please login to continue' }, { status: 401 });
      }
      if (error.message === 'Forbidden') {
        return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
      }
    }
    
    return NextResponse.json(
      { error: 'An error occurred while creating delivery boy account' },
      { status: 500 }
    );
  }
}
