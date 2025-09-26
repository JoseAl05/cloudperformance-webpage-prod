import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCollection } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

const RegisterSchema = z.object({
  email: z.email(),
  username: z.string().min(2),
  client: z.string().min(1),
  password: z.string().min(8),
  user_db: z.string().max(50)
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = RegisterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  }

  const { email, username, client, password, user_db } = parsed.data;
  const users = await getCollection('users');

  const existing = await users.findOne({ $or: [{ email }, { username }] });
  if (existing)
    return NextResponse.json({ error: 'Usuario ya existe' }, { status: 409 });

  const passwordHash = await bcrypt.hash(password, 12);
  const now = new Date();
  const res = await users.insertOne({
    email,
    username,
    client,
    passwordHash,
    user_db,
    createdAt: now,
    updatedAt: now,
  });

  return NextResponse.json({ ok: true, userId: String(res.insertedId) });
}
