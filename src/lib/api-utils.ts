/**
 * Common API utilities for Supabase-based endpoints
 * Provides database query helpers and Supabase integration
 * 
 * NOTE: This file also exports Firebase utilities for legacy routes
 * that are still using Firebase. These should be gradually migrated to Supabase.
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, Timestamp } from 'firebase/firestore';
import type { Database } from '@/types/database';

// Initialize Firebase for legacy routes
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(firebaseApp);

// Export Firebase Timestamp for legacy routes
export { Timestamp };

// Initialize Supabase client for server-side operations
export function getSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Helper to create error responses
 */
export function errorResponse(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Helper to create success responses
 */
export function successResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

/**
 * Parse request body safely
 */
export async function parseBody(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new Error('Invalid request body');
  }
}

/**
 * Get authenticated user from request
 */
export async function getAuthUser(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return null;
  }

  const token = authHeader.replace('Bearer ', '');
  const supabase = getSupabaseClient();
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Verify user has required role
 */
export async function verifyRole(userId: string, allowedRoles: string[]) {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return false;
  }

  return allowedRoles.includes((data as any).role);
}
