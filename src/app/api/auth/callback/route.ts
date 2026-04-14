import { NextResponse } from 'next/server';

// Firebase auth doesn't require server-side callback handling
// OAuth flow is managed client-side
// This route is kept for legacy compatibility

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;
  
  // Redirect authenticated users to login
  return NextResponse.redirect(`${origin}/login`);
}
