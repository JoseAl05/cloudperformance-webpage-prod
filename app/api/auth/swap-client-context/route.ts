import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE } from '@/lib/cookies';
import { verifyAuthToken, signAuthToken } from '@/lib/auth';
import { findCompanyByName } from '@/lib/db-utils';
import type { AuthUserPayload } from '@/types/db';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ message: 'No autenticado.' }, { status: 401 });
  }

  let originalPayload: unknown = null;

  try {
    originalPayload = await verifyAuthToken(token);

    if (!originalPayload || originalPayload.role !== 'admin_global') {
      return NextResponse.json(
        {
          message:
            'Permiso denegado. Solo Admin Global puede cambiar contexto.',
        },
        { status: 403 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      { message: 'Token inválido o expirado.' },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { clientName } = body;

  if (!clientName) {
    return NextResponse.json(
      { message: 'Falta el campo clientName.' },
      { status: 400 }
    );
  }

  const targetCompany = await findCompanyByName(clientName);

  if (!targetCompany) {
    return NextResponse.json(
      { message: `Empresa '${clientName}' no encontrada.` },
      { status: 404 }
    );
  }

  const newPayload = {
    ...originalPayload,

    client: targetCompany.name,
    role: 'admin_global',
    is_aws: targetCompany.is_aws,
    is_azure: targetCompany.is_azure,
    user_db_aws: targetCompany.user_db_aws,
    user_db_azure: targetCompany.user_db_azure,
    planName: targetCompany.planName,
  } as AuthUserPayload;

  await signAuthToken(newPayload);

  return NextResponse.json(
    {
      message: `Contexto cambiado exitosamente a ${targetCompany.name}`,
      client: targetCompany.name,
    },
    { status: 200 }
  );
}
