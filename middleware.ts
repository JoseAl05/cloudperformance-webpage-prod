import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getAuthFromRequest } from '@/lib/auth';

// Todo lo que no esté en esta lista exige sesión (las rutas /api validan su propio token).
const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-2fa',
  '/unauthorized',
] as const;

// Prefijo de ruta -> flag del token que habilita esa nube.
const CLOUD_FLAGS = [
  { prefix: '/aws', flag: 'is_aws' },
  { prefix: '/azure', flag: 'is_azure' },
  { prefix: '/gcp', flag: 'is_gcp' },
  { prefix: '/open-ia', flag: 'is_openai' },
  // Los servicios de IA leen los datos de su nube base.
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

  const session = await getAuthFromRequest(req);
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // APLICAR LA EXCEPCIÓN: Si es 'admin_global', NO bloquear por nube.
  const isGlobalAdmin = session.role === 'admin_global';
  if (isGlobalAdmin) return NextResponse.next();

  const cloud = CLOUD_FLAGS.find(({ prefix }) => matchesPath(pathname, prefix));
  if (cloud && !session[cloud.flag]) {
    const url = req.nextUrl.clone();
    url.pathname = '/unauthorized';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Excluye las rutas /api, los assets de Next y cualquier archivo estático de /public.
  matcher: ['/((?!api/|_next/static|_next/image|favicon.ico|.*\\.[^/]+$).*)'],
};
