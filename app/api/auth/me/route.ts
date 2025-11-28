// import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';
// import { AUTH_COOKIE } from '@/lib/cookies';
// import { verifyAuthToken } from '@/lib/auth';
// import { getCollection } from '@/lib/mongodb';

// export async function GET() {
//   const cookieStore = await cookies();
//   const token = cookieStore.get(AUTH_COOKIE)?.value;
//   if (!token) return NextResponse.json({ user: null });
//   const payload = await verifyAuthToken(token);
//   if (!payload) return NextResponse.json({ user: null });

//   const users = await getCollection('users');
//   const user = await users.findOne({ _id: { $eq: new (await import('mongodb')).ObjectId(payload.sub) } as unknown }, { projection: { passwordHash: 0 } });
//   return NextResponse.json({ user: user ? { _id: String(user._id), email: user.email, username: user.username, client: user.client, is_aws: user.is_aws, is_azure: user.is_azure } : null });
// }

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE } from '@/lib/cookies';
import { verifyAuthToken } from '@/lib/auth';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb'; 
import type { User, CloudAccount } from '@/types/db'; 

// Definimos la respuesta extendida para el frontend
type SessionUser = Omit<User, 'passwordHash'> & { 
    planName?: string;
    // Aseguramos el tipado de los campos opcionales en el frontend
    is_aws_multi_tenant?: boolean;
    is_azure_multi_tenant?: boolean;
    azure_accounts?: CloudAccount[];
    aws_accounts?: CloudAccount[];
};

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;
    
    if (!token) return NextResponse.json({ user: null });
    
    // 1. Verificar token
    const payload = await verifyAuthToken(token);
    if (!payload) return NextResponse.json({ user: null });

    try {
        const userId = new ObjectId(payload.sub);
        const usersCollection = await getCollection<User>('Users');
        
        // 2. Obtener usuario (ÚNICA CONSULTA A LA DB)
        const user = await usersCollection.findOne(
            { _id: userId },
            { projection: { passwordHash: 0 } } 
        );

        if (!user) {
            return NextResponse.json({ user: null }, { status: 404 });
        }
        
        // 3. Construir la respuesta usando SOLO los datos del usuario
        // Como el usuario ya heredó todo al crearse, no necesitamos consultar la Empresa.
        const sessionUser: SessionUser = {
            _id: user._id, 
            email: user.email,
            username: user.username,
            client: user.client,
            role: user.role,
            planName: user.planName,
            is_active: user.is_active,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            
            // Credenciales de conexión
            is_aws: user.is_aws,
            is_azure: user.is_azure,
            user_db_aws: user.user_db_aws,
            user_db_azure: user.user_db_azure,

            // 🛑 DATOS MULTI-TENANT (Leídos directamente del documento User) 🛑
            is_aws_multi_tenant: (user as any).is_aws_multi_tenant || false,
            is_azure_multi_tenant: (user as any).is_azure_multi_tenant || false,
            azure_accounts: user.azure_accounts || [],
            aws_accounts: user.aws_accounts || [],
        };

        return NextResponse.json({ user: sessionUser });

    } catch (error) {
        console.error('Error al obtener la sesión de usuario:', error);
        return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
    }
}