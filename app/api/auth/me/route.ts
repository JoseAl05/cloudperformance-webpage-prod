import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE } from '@/lib/cookies';
import { verifyAuthToken } from '@/lib/auth';
import { getCollection } from '@/lib/mongodb';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!token) return NextResponse.json({ user: null });
  const payload = await verifyAuthToken(token);
  if (!payload) return NextResponse.json({ user: null });

  const users = await getCollection('users');
  const user = await users.findOne({ _id: { $eq: new (await import('mongodb')).ObjectId(payload.sub) } as unknown }, { projection: { passwordHash: 0 } });
  return NextResponse.json({ user: user ? { _id: String(user._id), email: user.email, username: user.username, client: user.client, is_aws: user.is_aws, is_azure: user.is_azure } : null });
}