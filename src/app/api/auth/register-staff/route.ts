import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { hashPassword } from '@/lib/auth/password';
import { createSession } from '@/lib/auth/session';
import { z } from 'zod';

const staffRegisterSchema = z.object({
  full_name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  mobile_number: z.string().regex(/^[6-9]\d{9}$/, 'Invalid mobile number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const parsed = staffRegisterSchema.safeParse(body);
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
        role: 'delivery_boy',
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

    // Create delivery_boy record
    const { error: deliveryBoyError } = await supabase
      .from('delivery_boys')
      .insert({
        profile_id: userId,
        name: data.full_name,
        mobile: `+91${data.mobile_number}`,
        is_active: true,
      });

    if (deliveryBoyError) {
      console.error('Delivery boy creation error:', deliveryBoyError);
      // Continue anyway, admin can fix this later
    }

    // Create session
    await createSession(userId);

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email: data.email.toLowerCase(),
        full_name: data.full_name,
        role: 'delivery_boy',
        mobile_number: `+91${data.mobile_number}`,
      },
    });
  } catch (error) {
    console.error('Staff registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
