import { NextResponse } from 'next/server';

export function middleware(req) {
  const token = req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname === '/login' || pathname === '/signup';

  // If no token and not on login/signup, redirect to login
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // If token exists and user tries to access login/signup, redirect to dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/login', '/signup'], // match these paths
};
