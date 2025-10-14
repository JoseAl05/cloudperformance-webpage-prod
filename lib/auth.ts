import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';
import { AUTH_COOKIE } from './cookies';
import type { JWTPayload } from '../types';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'dev-secret-change-me'
);

export async function signAuthToken(
  payload: JWTPayload,
  ttlSeconds = 60 * 60 * 24
) {
  const cookieStore = await cookies();
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime(`${ttlSeconds}s`)
    .sign(secret);

  // Detecta si la conexión es HTTPS (soporta proxies)
  // Nota: en rutas de servidor puedes leer cabeceras, aquí suele bastar con NODE_ENV
  const isProd = process.env.NODE_ENV === 'production';
  // Si corres en prod pero en HTTP (localhost), puedes forzar via ENV:
  const forceInsecureLocal = process.env.FORCE_INSECURE_COOKIES === '1';

  cookieStore.set({
    name: AUTH_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: isProd && !forceInsecureLocal, // evita secure en localhost http
    // opcionalmente: expires: new Date(Date.now() + ttlSeconds*1000)
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
