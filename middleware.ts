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
  { prefix: '/cloud-aws', flag: 'is_aws' },
  { prefix: '/cloud-azure', flag: 'is_azure' },
  { prefix: '/cloud-gcp', flag: 'is_gcp' },
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

  // OBTENER EL DOMINIO PÚBLICO SEGÚN EL ENTORNO
  const publicOrigin =
    process.env.IS_VERCEL === 'true'
      ? process.env.PUBLIC_ORIGIN_VERCEL
      : process.env.PUBLIC_ORIGIN_LOCAL;

  if (!publicOrigin) {
    throw new Error('PUBLIC_ORIGIN no está configurado');
  }

  // OBTENER LA SESIÓN DEL USUARIO
  const session = await getAuthFromRequest(req);

  // REDIRIGIR AL LOGIN SI NO EXISTE UNA SESIÓN
  if (!session) {
    const url = new URL('/login', publicOrigin);
    url.searchParams.set('next', pathname);

    return NextResponse.redirect(url);
  }

  // APLICAR LA EXCEPCIÓN: Si es 'admin_global', NO bloquear por nube.
  const isGlobalAdmin = session.role === 'admin_global';
  if (isGlobalAdmin) return NextResponse.next();

  const cloud = CLOUD_FLAGS.find(({ prefix }) => matchesPath(pathname, prefix));
  if (cloud && !session[cloud.flag]) {
    return NextResponse.redirect(new URL('/unauthorized', publicOrigin));
  }

  // PERMITIR EL ACCESO
  return NextResponse.next();
}

export const config = {
  // Excluye las rutas /api, los assets de Next y cualquier archivo estático de /public.
  matcher: ['/((?!api/|_next/static|_next/image|favicon.ico|.*\\.[^/]+$).*)'],
};
