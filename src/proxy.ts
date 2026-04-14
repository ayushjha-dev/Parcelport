import { type NextRequest, NextResponse } from 'next/server';

export async function proxy(request: NextRequest) {
  // For now, just pass through all requests.
  // Firebase auth is handled client-side.
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
