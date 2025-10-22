import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getAuthFromRequest } from '@/lib/auth';

const PROTECTED_PATHS = ['/aws', '/azure', '/perfil'] as const;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const session = await getAuthFromRequest(req);
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  const isAwsAllowed = !!(
    session as unknown as { is_aws?: boolean | string | number }
  ).is_aws;
  const isAzureAllowed = !!(
    session as unknown as { is_azure?: boolean | string | number }
  ).is_azure;

  if (pathname.startsWith('/aws') && !isAwsAllowed) {
    const url = req.nextUrl.clone();
    url.pathname = '/unauthorized';
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith('/azure') && !isAzureAllowed) {
    const url = req.nextUrl.clone();
    url.pathname = '/unauthorized';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/aws/:path*', '/azure/:path*', '/perfil'],
};
