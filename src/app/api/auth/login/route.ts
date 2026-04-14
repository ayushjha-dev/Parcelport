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
      .select('id, email, full_name, role, mobile_number, password_hash, is_active, student_roll_no, course_branch, hostel_block, floor_number, room_number, landmark_note')
      .eq('email', email.toLowerCase())
      .single();

    if (error) {
      console.error('Database error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      // Check if it's an RLS policy error
      if (error.code === 'PGRST116' || error.message?.includes('row-level security')) {
        return NextResponse.json(
          { error: 'Database access denied. Please run the fix-database-complete.sql script in Supabase.' },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: 'Database error. Please check your Supabase configuration.' },
        { status: 500 }
      );
    }

    if (!profile) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (!profile.password_hash) {
      return NextResponse.json(
        { error: 'Account not properly configured. Please contact support.' },
        { status: 500 }
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
        student_roll_no: profile.student_roll_no,
        course_branch: profile.course_branch,
        hostel_block: profile.hostel_block,
        floor_number: profile.floor_number,
        room_number: profile.room_number,
        landmark_note: profile.landmark_note,
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
