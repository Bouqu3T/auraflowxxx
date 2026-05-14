import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/login'];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  const isPublicRoute = publicRoutes.includes(path);
  const hasToken = request.cookies.get('auth_token');
  
  if (isPublicRoute) {
    if (hasToken) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }
  
  if (!hasToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
