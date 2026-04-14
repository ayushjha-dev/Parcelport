import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { hashPassword } from '@/lib/auth/password';
import { createSession } from '@/lib/auth/session';
import { registerSchema } from '@/lib/validations/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const supabase = await createClient();

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', data.email.toLowerCase())
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'This email is already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);

    // Generate UUID for new user
    const userId = crypto.randomUUID();

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: data.email.toLowerCase(),
        full_name: data.full_name,
        mobile_number: `+91${data.mobile_number}`,
        role: 'student',
        student_roll_no: data.student_roll_no,
        course_branch: data.course_branch,
        hostel_block: data.hostel_block,
        floor_number: data.floor_number,
        room_number: data.room_number,
        landmark_note: body.landmark_note?.trim() || null,
        password_hash: passwordHash,
        is_active: true,
        mobile_verified: false,
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      return NextResponse.json(
        { error: 'Failed to create account. Please try again.' },
        { status: 500 }
      );
    }

    // Create session
    await createSession(userId);

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email: data.email.toLowerCase(),
        full_name: data.full_name,
        role: 'student',
        mobile_number: `+91${data.mobile_number}`,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
