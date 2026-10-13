import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getAuthFromRequest } from '@/lib/auth';

const PROTECTED_PATHS = ['/cloud-aws', '/cloud-azure','/cloud-gcp', '/perfil'] as const;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // VERIFICAR SI LA RUTA ESTÁ PROTEGIDA
  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

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

  // OBTENER EL ROL Y LOS PERMISOS DEL USUARIO
  const userRole = (
    session as { role?: string }
  ).role;

  const isAwsAllowed = Boolean(
    (session as { is_aws?: boolean | string | number }).is_aws
  );

  const isAzureAllowed = Boolean(
    (session as { is_azure?: boolean | string | number }).is_azure
  );

  // LOS ADMINISTRADORES GLOBALES TIENEN ACCESO A TODO
  const isGlobalAdmin = userRole === 'admin_global';

  // VERIFICAR ACCESO A AWS
  const isAwsPath =
    pathname === '/cloud-aws' || pathname.startsWith('/cloud-aws/');

  if (isAwsPath && !isAwsAllowed && !isGlobalAdmin) {
    return NextResponse.redirect(
      new URL('/unauthorized', publicOrigin)
    );
  }

  // VERIFICAR ACCESO A AZURE
  const isAzurePath =
    pathname === '/cloud-azure' || pathname.startsWith('/cloud-azure/');

  if (isAzurePath && !isAzureAllowed && !isGlobalAdmin) {
    return NextResponse.redirect(
      new URL('/unauthorized', publicOrigin)
    );
  }

  // VERIFICAR ACCESO A GCP
  const isGcpPath =
    pathname === '/cloud-gcp' || pathname.startsWith('/cloud-gcp/');

  if (isGcpPath && !isGlobalAdmin) {
    return NextResponse.redirect(
      new URL('/unauthorized', publicOrigin)
    );
  }

  // PERMITIR EL ACCESO
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/cloud-aws/:path*',
    '/cloud-azure/:path*',
    '/cloud-gcp/:path*',
    '/perfil/:path*',
  ],
};
