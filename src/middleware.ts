import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PREFIXES = [
  '/dashboard',
  '/profile',
  '/privacy',
  '/track',
  '/meals',
  '/insights',
  '/journey',
  '/skin',
  '/grocery',
  '/library',
  '/admin',
  '/operator',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    prefix => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isProtected) {
    const token = request.cookies.get('shift_session_token')?.value;
    if (!token) {
      const redirectUrl = new URL('/', request.url);
      return NextResponse.redirect(redirectUrl, 307);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/profile',
    '/profile/:path*',
    '/privacy',
    '/privacy/:path*',
    '/track',
    '/track/:path*',
    '/meals',
    '/meals/:path*',
    '/insights',
    '/insights/:path*',
    '/journey',
    '/journey/:path*',
    '/skin',
    '/skin/:path*',
    '/grocery',
    '/grocery/:path*',
    '/library',
    '/library/:path*',
    '/admin',
    '/admin/:path*',
    '/operator',
    '/operator/:path*',
  ],
};
