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

  // OBTENER EL ROL DEL USUARIO
  const userRole = (
    session as unknown as { role?: string }
  ).role;

  const isAwsAllowed = !!(
    session as unknown as { is_aws?: boolean | string | number }
  ).is_aws;
  const isAzureAllowed = !!(
    session as unknown as { is_azure?: boolean | string | number }
  ).is_azure;

  // APLICAR LA EXCEPCIÓN: Si es 'admin_global', NO bloquear.
  const isGlobalAdmin = userRole === 'admin_global';

  // Bloquear AWS si: NO tiene permiso AWS Y NO es Admin Global
  if (pathname.startsWith('/aws') && !isAwsAllowed && !isGlobalAdmin) {
    const url = req.nextUrl.clone();
    url.pathname = '/unauthorized';
    return NextResponse.redirect(url);
  }

  // Bloquear Azure si: NO tiene permiso Azure Y NO es Admin Global
  if (pathname.startsWith('/azure') && !isAzureAllowed && !isGlobalAdmin) {
    const url = req.nextUrl.clone();
    url.pathname = '/unauthorized';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/aws/:path*', '/azure/:path*', '/perfil'],
};