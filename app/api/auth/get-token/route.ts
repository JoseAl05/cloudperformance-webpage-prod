import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { getCollection } from '@/lib/mongodb';
import { signAuthToken } from '@/lib/auth';
import { buildLoginPayload } from '@/lib/sessionPayload';
import { findCompanyByName } from '@/lib/db-utils';
import type { User } from '@/types/db';
import { AUTH_COOKIE } from '@/lib/cookies';

const LoginSchema = z.object({
  emailOrUsername: z.string().min(2),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Este endpoint solo está disponible en modo desarrollo.' },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();

    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    const { emailOrUsername, password } = parsed.data;

    const users = await getCollection<User>('Users');
    const user = await users.findOne({ email: emailOrUsername });

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    if (user.is_active === false) {
      return NextResponse.json(
        { error: 'Usuario bloqueado/inactivo.' },
        { status: 403 }
      );
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    const company = await findCompanyByName(user.client);
    if (!company) {
      return NextResponse.json(
        { error: 'La empresa del usuario no existe.' },
        { status: 403 }
      );
    }

    await signAuthToken(buildLoginPayload(user, company));

    const sessions = await getCollection('sessions');
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    await sessions.insertOne({
      userId: String(user._id),
      createdAt: now,
      expiresAt,
    });

    const cookieStore = await cookies();
    const tokenValue = cookieStore.get(AUTH_COOKIE)?.value;

    return NextResponse.json({
      ok: true,
      message: 'Token generado (Modo Desarrollo)',
      token: tokenValue || 'El token se ha establecido en la cookie HttpOnly',
      user: {
        _id: String(user._id),
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error en getAuthToken:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
