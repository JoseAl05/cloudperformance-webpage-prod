import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { User } from '@/types/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json(); 

        if (!token || !password) {
            return NextResponse.json({ message: 'Faltan datos (token o contraseña).' }, { status: 400 });
        }
        
        if (password.length < 8) {
             return NextResponse.json({ message: 'La contraseña debe tener al menos 8 caracteres.' }, { status: 400 });
        }

        const usersCollection = await getCollection<User>('Users');

        // Buscar usuario y validar expiración
        const user = await usersCollection.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() } 
        });

        if (!user) {
            return NextResponse.json({ message: 'El enlace es inválido o ha expirado.' }, { status: 400 });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        await usersCollection.updateOne(
            { _id: user._id },
            { 
                $set: { passwordHash },
                $unset: { resetPasswordToken: "", resetPasswordExpires: "" }
            }
        );

        return NextResponse.json({ message: 'Contraseña actualizada correctamente.' }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
    }
}