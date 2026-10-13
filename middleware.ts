import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getAuthFromRequest } from '@/lib/auth';

const PROTECTED_PATHS = ['/aws', '/azure', '/perfil'] as const;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // VERIFICAR SI LA RUTA ESTÁ PROTEGIDA
  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // OBTENER LA SESIÓN DEL USUARIO
  const session = await getAuthFromRequest(req);

  // REDIRIGIR AL LOGIN SI NO EXISTE UNA SESIÓN
  if (!session) {
    const url = new URL('/login', req.url);

    // Guardar la ruta original para regresar después del login
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
    pathname === '/aws' || pathname.startsWith('/aws/');

  if (isAwsPath && !isAwsAllowed && !isGlobalAdmin) {
    return NextResponse.redirect(
      new URL('/unauthorized', req.url)
    );
  }

  // VERIFICAR ACCESO A AZURE
  const isAzurePath =
    pathname === '/azure' || pathname.startsWith('/azure/');

  if (isAzurePath && !isAzureAllowed && !isGlobalAdmin) {
    return NextResponse.redirect(
      new URL('/unauthorized', req.url)
    );
  }

  // PERMITIR EL ACCESO
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/aws/:path*',
    '/azure/:path*',
    '/perfil/:path*',
  ],
};