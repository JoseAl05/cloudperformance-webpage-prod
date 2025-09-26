import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';
import { AUTH_COOKIE } from './cookies';
import type { JWTPayload } from '../types';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-me');

export async function signAuthToken(payload: JWTPayload, ttlSeconds = 60 * 60 * 24) {
  const cookieStore = await cookies();
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime(`${ttlSeconds}s`)
    .sign(secret);

  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ttlSeconds
  });

  return token;
}

export async function verifyAuthToken(token: string) {
  try {
    const { payload } = await jwtVerify<JWTPayload>(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function getAuthFromRequest(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  return verifyAuthToken(token);
}