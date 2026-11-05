import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { User } from '@/types/db'; 
import crypto from 'crypto'; 
import { sendRecoveryEmail } from '@/lib/email'; 

const TOKEN_EXPIRATION_MS = 3600000;

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ message: 'El correo electrónico es obligatorio.' }, { status: 400 });
        }

        const usersCollection = await getCollection<User>('Users');
        const user = await usersCollection.findOne({ email });

        if (!user || !user.is_active) {
            return NextResponse.json({ message: 'Si el correo existe, se han enviado las instrucciones.' }, { status: 200 });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = new Date(Date.now() + TOKEN_EXPIRATION_MS);

        await usersCollection.updateOne(
            { _id: user._id },
            { 
                $set: { 
                    resetPasswordToken: resetToken, 
                    resetPasswordExpires: resetTokenExpires 
                } 
            }
        );

        await sendRecoveryEmail(user.email, resetToken);
        
        return NextResponse.json({ message: 'Si el correo existe, recibirás las instrucciones.' }, { status: 200 });

    } catch (error) {
        console.error('Error en forgot-password:', error);
        return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
    }
}