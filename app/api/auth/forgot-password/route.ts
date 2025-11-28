import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { User } from '@/types/db'; 
import crypto from 'crypto'; 
import { sendRecoveryEmail } from '@/lib/email'; 

const TOKEN_EXPIRATION_MS = 3600000; // 1 hora

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ message: 'El correo electrónico es obligatorio.' }, { status: 400 });
        }

        //Buscar usuario
        const usersCollection = await getCollection<User>('Users');
        const user = await usersCollection.findOne({ email });

        // Seguridad: Responder OK para prevenir ataques de enumeración de usuarios
        if (!user || !user.is_active) {
            return NextResponse.json({ message: 'Si el correo existe, se han enviado las instrucciones.' }, { status: 200 });
        }

        // Generar Token y Expiración
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = new Date(Date.now() + TOKEN_EXPIRATION_MS);

        // Guardar el token en la base de datos
        await usersCollection.updateOne(
            { _id: user._id },
            { 
                $set: { 
                    resetPasswordToken: resetToken, 
                    resetPasswordExpires: resetTokenExpires 
                } 
            }
        );

        //Enviar Correo
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
        
        await sendRecoveryEmail(user.email, resetToken);
        
        return NextResponse.json({ message: 'Si el correo existe, recibirás las instrucciones.' }, { status: 200 });

    } catch (error) {
        console.error('Error en forgot-password:', error);
        return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
    }
}