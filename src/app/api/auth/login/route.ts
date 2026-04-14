import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyPassword } from '@/lib/auth/password';
import { createSession } from '@/lib/auth/session';
import { loginSchema } from '@/lib/validations/auth';
import type { UserRole } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const role = body.role as UserRole;

    // Get user from database
    const supabase = await createClient();
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, mobile_number, password_hash, is_active')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !profile) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if account is active
    if (!profile.is_active) {
      return NextResponse.json(
        { error: 'Account is inactive. Please contact support.' },
        { status: 403 }
      );
    }

    // Verify role matches
    if (role && profile.role !== role) {
      return NextResponse.json(
        { error: `This account is not registered as ${role}. Please select the correct role.` },
        { status: 403 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, profile.password_hash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create session
    await createSession(profile.id);

    return NextResponse.json({
      success: true,
      user: {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        role: profile.role,
        mobile_number: profile.mobile_number,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
