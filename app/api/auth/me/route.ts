import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE } from '@/lib/cookies';
import { verifyAuthToken } from '@/lib/auth';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import type { User, CloudAccount } from '@/types/db';

type SessionUser = Omit<User, 'passwordHash'> & {
  planName?: string;
  is_aws_multi_tenant?: boolean;
  is_azure_multi_tenant?: boolean;
  is_gcp_multi_tenant?: boolean;
  azure_accounts?: CloudAccount[];
  aws_accounts?: CloudAccount[];
  gcp_accounts?: CloudAccount[];
};

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

    type UserWithTenancy = User & {
      is_aws_multi_tenant?: boolean;
      is_azure_multi_tenant?: boolean;
      is_gcp_multi_tenant?: boolean;
    };

    const userTyped = user as UserWithTenancy;

    const sessionUser: SessionUser = {
      _id: user._id,
      email: user.email,
      username: user.username,
      client: user.client,
      role: user.role,
      planName: user.planName,
      is_active: user.is_active,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,

      is_aws: user.is_aws,
      is_azure: user.is_azure,
      is_gcp: user.is_gcp,

      user_db_aws: user.user_db_aws,
      user_db_azure: user.user_db_azure,
      user_db_gcp: user.user_db_gcp,

      is_aws_multi_tenant: userTyped.is_aws_multi_tenant || false,
      is_azure_multi_tenant: userTyped.is_azure_multi_tenant || false,
      is_gcp_multi_tenant: userTyped.is_gcp_multi_tenant || false,

      azure_accounts: user.azure_accounts || [],
      aws_accounts: user.aws_accounts || [],
      gcp_accounts: user.gcp_accounts || [],
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
