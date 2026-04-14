import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { hashPassword } from '@/lib/auth/password';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, password } = body;

    // Validate input
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: 'Full name, email, and password are required' },
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

    // Create admin profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .insert({
        email: email.toLowerCase(),
        full_name: fullName,
        role: 'admin',
        password_hash: passwordHash,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create admin account' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Admin account created successfully',
      user: {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        role: profile.role,
      },
    });
  } catch (error) {
    console.error('Create admin error:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating admin account' },
      { status: 500 }
    );
  }
}
