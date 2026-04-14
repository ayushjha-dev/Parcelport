import { NextResponse, type NextRequest } from 'next/server';
import { getSession } from '@/lib/auth/session';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Define route patterns
  const protectedRoutes = ['/student', '/admin', '/delivery'];
  const authRoutes = ['/login', '/register', '/register-staff', '/forgot-password', '/create-admin'];
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Get session
  const session = await getSession();

  // Redirect to login if accessing protected route without authentication
  if (isProtectedRoute && !session) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && session) {
    const url = request.nextUrl.clone();
    
    if (session.role === 'admin') {
      url.pathname = '/admin/dashboard';
    } else if (session.role === 'delivery_boy') {
      url.pathname = '/delivery/dashboard';
    } else {
      url.pathname = '/student/dashboard';
    }
    
    return NextResponse.redirect(url);
  }

  // Role-based access control for protected routes
  if (isProtectedRoute && session) {
    const role = session.role;
    
    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    if (pathname.startsWith('/delivery') && role !== 'delivery_boy') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    if (pathname.startsWith('/student') && role !== 'student') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
