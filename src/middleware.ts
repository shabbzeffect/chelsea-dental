import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes by role
const protectedRoutes = {
  admin: ['/admin'],
  dentist: ['/dentist'],
  receptionist: ['/receptionist'],
  patient: ['/patient'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get session token from cookie
  const sessionToken = request.cookies.get('session_token')?.value;
  
  // Check if the route is protected
  const isProtectedRoute = Object.values(protectedRoutes).some(routes =>
    routes.some(route => pathname.startsWith(route))
  );
  
  // If accessing protected route without session, redirect to login
  if (isProtectedRoute && !sessionToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // If accessing login/register with session, redirect to dashboard
  if ((pathname === '/login' || pathname === '/register') && sessionToken) {
    // Note: We can't verify the session here without making an API call
    // The actual role-based redirect happens client-side after login
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dentist/:path*',
    '/receptionist/:path*',
    '/patient/:path*',
    '/login',
    '/register',
  ],
};
