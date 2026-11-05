import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getAuthFromRequest } from '@/lib/auth';

const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-2fa',
  '/unauthorized',
] as const;

const CLOUD_FLAGS = [
  { prefix: '/cloud-aws', flag: 'is_aws' },
  { prefix: '/cloud-azure', flag: 'is_azure' },
  { prefix: '/cloud-gcp', flag: 'is_gcp' },
  { prefix: '/open-ia', flag: 'is_openai' },
  { prefix: '/amazon-bedrock', flag: 'is_aws' },
  { prefix: '/microsoft-foundry', flag: 'is_azure' },
  { prefix: '/google-vertex', flag: 'is_gcp' },
] as const;

const matchesPath = (pathname: string, prefix: string) =>
  pathname === prefix || pathname.startsWith(`${prefix}/`);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublic =
    pathname === '/' || PUBLIC_PATHS.some((p) => matchesPath(pathname, p));
  if (isPublic) return NextResponse.next();

  const publicOrigin =
    process.env.IS_VERCEL === 'true'
      ? process.env.PUBLIC_ORIGIN_VERCEL
      : process.env.PUBLIC_ORIGIN_LOCAL;

  if (!publicOrigin) {
    throw new Error('PUBLIC_ORIGIN no está configurado');
  }

  const session = await getAuthFromRequest(req);

  if (!session) {
    const url = new URL('/login', publicOrigin);
    url.searchParams.set('next', pathname);

    return NextResponse.redirect(url);
  }

  const isGlobalAdmin = session.role === 'admin_global';
  if (isGlobalAdmin) return NextResponse.next();

  const cloud = CLOUD_FLAGS.find(({ prefix }) => matchesPath(pathname, prefix));
  if (cloud && !session[cloud.flag]) {
    return NextResponse.redirect(new URL('/unauthorized', publicOrigin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/|_next/static|_next/image|favicon.ico|.*\\.[^/]+$).*)'],
};
