import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE } from '@/lib/cookies';

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: AUTH_COOKIE,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0),
  });

  const loginUrl = new URL('/login', req.url);
  loginUrl.searchParams.set('logged_out', '1');

  return NextResponse.redirect(loginUrl, { status: 303 });
}
