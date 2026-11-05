import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCollection } from '@/lib/mongodb';
import { signAuthToken } from '@/lib/auth';
import { buildLoginPayload } from '@/lib/sessionPayload';
import { ObjectId } from 'mongodb';
import type { Empresa, User } from '@/types/db';

const VerifySchema = z.object({
  userId: z.string().min(1),
  code: z.string().length(6),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = VerifySchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });

  const { userId, code } = parsed.data;

  const users = await getCollection<User>('Users');
  const user = await users.findOne({
    _id: { $eq: new ObjectId(userId) },
  });

  if (!user)
    return NextResponse.json(
      { error: 'Usuario no encontrado' },
      { status: 404 }
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

  const clients = await getCollection<Empresa>('Empresas')
  const clientData = await clients.findOne({ name: user.client });

  if (!clientData) {
    return NextResponse.json(
      {
        error:
          'Tu empresa no tiene una licencia activa. Contacta al soporte para más detalles.',
      },
      { status: 403 }
    );
  }


  const codes = await getCollection<{ userId: string; code: string; purpose: string; expiresAt: Date }>('twofactor_codes');
  const tf = await codes.findOne({ userId, code, purpose: 'login' });
  if (!tf)
    return NextResponse.json({ error: 'Código inválido' }, { status: 401 });

  if (new Date(tf.expiresAt).getTime() < Date.now()) {
    return NextResponse.json({ error: 'Código expirado' }, { status: 401 });
  }

  await codes.deleteMany({ userId, purpose: 'login' });

  await signAuthToken(buildLoginPayload(user, clientData));

  const sessions = await getCollection<{ userId: string; createdAt: Date; expiresAt: Date }>('sessions');
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  await sessions.insertOne({
    userId: String(user._id),
    createdAt: now,
    expiresAt,
  });

  return NextResponse.json({ ok: true });
}