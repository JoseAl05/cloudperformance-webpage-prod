import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE } from '@/lib/cookies';
import { verifyAuthToken } from '@/lib/auth';
import { getCollection } from '@/lib/mongodb';
import { findCompanyConnectors } from '@/lib/connectors';
import { ObjectId } from 'mongodb';
import type { CloudAccount, User } from '@/types/db';

type SessionUser = Omit<User, 'passwordHash'>;

const dbOf = (value: unknown): string | null => (typeof value === 'string' && value ? value : null);

const accountsOf = (value: unknown): CloudAccount[] =>
  Array.isArray(value)
    ? value.filter((acc): acc is CloudAccount =>
        typeof acc === 'object' && acc !== null && typeof (acc as CloudAccount).id === 'string')
    : [];

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  if (!token) return NextResponse.json({ user: null });

  const payload = await verifyAuthToken(token);
  if (!payload) return NextResponse.json({ user: null });

  try {
    const userId = new ObjectId(payload.sub);
    const usersCollection = await getCollection<User>('Users');

    const user = await usersCollection.findOne(
      { _id: userId },
      { projection: { passwordHash: 0 } }
    );

    if (!user) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    const connector = await findCompanyConnectors(payload.client);


    const sessionUser: SessionUser = {
      _id: user._id,
      email: user.email,
      username: user.username,
      client: user.client,
      active_client: typeof payload.client === 'string' ? payload.client : user.client,
      role: user.role,
      planName: typeof payload.planName === 'string' ? payload.planName : user.planName,
      is_active: user.is_active,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,

      is_aws: payload.is_aws === true,
      is_azure: payload.is_azure === true,
      is_gcp: payload.is_gcp === true,
      is_openai: payload.is_openai === true,

      user_db_aws: dbOf(payload.user_db_aws),
      user_db_azure: dbOf(payload.user_db_azure),
      user_db_gcp: dbOf(payload.user_db_gcp),
      user_db_openai: dbOf(payload.user_db_openai),

      is_aws_multi_tenant: payload.is_aws_multi_tenant === true,
      is_azure_multi_tenant: payload.is_azure_multi_tenant === true,
      is_gcp_multi_tenant: payload.is_gcp_multi_tenant === true,
      is_openai_multi_tenant: payload.is_openai_multi_tenant === true,

      azure_accounts: accountsOf(payload.azure_accounts),
      aws_accounts: accountsOf(payload.aws_accounts),
      gcp_accounts: accountsOf(payload.gcp_accounts),
      openai_accounts: accountsOf(payload.openai_accounts),

      connectors: connector || []
    };

    return NextResponse.json({ user: sessionUser });
  } catch (error) {
    console.error('Error al obtener la sesión de usuario:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}
