import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { User } from '@/types/db';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ valid: false, message: "Token no proporcionado." }, { status: 400 });
    }

    const usersCollection = await getCollection<User>('Users');

    const user = await usersCollection.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.json({
        valid: false,
        message: "El enlace es inválido o ha expirado."
      }, { status: 400 });
    }

    return NextResponse.json({ valid: true }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ valid: false, message: "Error interno." }, { status: 500 });
  }
}
