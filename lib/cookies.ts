import { cookies } from 'next/headers';

export const AUTH_COOKIE = 'auth_token';

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: AUTH_COOKIE,
    value: '',
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0)
  });
}