import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import type { UserRole } from '@/types/database';

export interface SessionUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  mobile_number: string;
  student_roll_no?: string | null;
  course_branch?: string | null;
  hostel_block?: string | null;
  floor_number?: string | null;
  room_number?: string | null;
  landmark_note?: string | null;
}

const SESSION_COOKIE_NAME = 'parcelport_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function createSession(userId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    
    if (!sessionCookie?.value) {
      return null;
    }

    const supabase = await createClient();
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, mobile_number, student_roll_no, course_branch, hostel_block, floor_number, room_number, landmark_note, is_active')
      .eq('id', sessionCookie.value)
      .single();

    if (error || !profile || !profile.is_active) {
      await destroySession();
      return null;
    }

    return {
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      role: profile.role as UserRole,
      mobile_number: profile.mobile_number,
      student_roll_no: profile.student_roll_no,
      course_branch: profile.course_branch,
      hostel_block: profile.hostel_block,
      floor_number: profile.floor_number,
      room_number: profile.room_number,
      landmark_note: profile.landmark_note,
    };
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function requireAuth(allowedRoles?: UserRole[]): Promise<SessionUser> {
  const session = await getSession();
  
  if (!session) {
    throw new Error('Unauthorized');
  }

  if (allowedRoles && !allowedRoles.includes(session.role)) {
    throw new Error('Forbidden');
  }

  return session;
}
