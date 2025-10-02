import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromRequest } from './lib/auth';

const PROTECTED_PATHS = [
  '/aws',
  '/azure'
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PATHS.some(p => pathname.startsWith(p));

  if (!isProtected) return NextResponse.next();

  const session = await getAuthFromRequest(req);
  if (!session) {
    const url = new URL('/login', req.url);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/aws/:path*',
    '/azure/:path*'
  ]
};