import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCollection } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { rateLimit } from '@/lib/rateLimit';
import { send2FACodeEmail } from '@/lib/email';
// Importamos el tipo de usuario si fuera necesario, pero la consulta findOne devuelve el documento completo

const LoginSchema = z.object({
  emailOrUsername: z.string().min(2),
  password: z.string().min(8),
});

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(req: Request) {
  const ip =
    (req.headers.get('x-forwarded-for') || '').split(',')[0] || 'unknown';
  const rl = rateLimit(`login:${ip}`, 10, 60_000);
  if (!rl.allowed)
    return NextResponse.json(
      { error: 'Demasiados intentos, espera un minuto.' },
      { status: 429 }
    );

  const body = await req.json();
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });

  const { emailOrUsername, password } = parsed.data;
  const users = await getCollection('Users');
  const user = await users.findOne({email: emailOrUsername});
  if (!user)
    return NextResponse.json(
      { error: 'Credenciales inválidas' },
      { status: 401 }
    );

  if (user.is_active === false) {
    return NextResponse.json(
      {
        error:
          'Tu cuenta ha sido bloqueada por un administrador. Contacta al soporte para más detalles.',
      },
      { status: 403 }
    );
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok)
    return NextResponse.json(
      { error: 'Credenciales inválidas' },
      { status: 401 }
    );

  const code = generateCode();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 10 * 60_000);
  const codes = await getCollection('twofactor_codes');
  await codes.insertOne({
    userId: String(user._id),
    code,
    purpose: 'login',
    createdAt: now,
    expiresAt,
  });

  await send2FACodeEmail(user.email, code);

  return NextResponse.json({
    ok: true,
    userId: String(user._id),
    message: 'Código enviado a tu correo',
  });
}
