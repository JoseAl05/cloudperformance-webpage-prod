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
import { ObjectId } from 'mongodb'; // Necesario para buscar por _id
// Importa los tipos necesarios de tus archivos
import type { User, Empresa, UserRole } from '@/types/db'; 

// Define la estructura de la respuesta para el Front-end (useSession)
type SessionUser = Omit<User, 'passwordHash' | 'user_db'> & { 
    planName?: string;
    userLimit?: number;
    currentUsers?: number;
};

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;
    
    if (!token) return NextResponse.json({ user: null });
    
    // 1. Verificar el token y obtener el payload básico (incluye sub: userId)
    const payload = await verifyAuthToken(token);
    if (!payload) return NextResponse.json({ user: null });

    try {
        const userId = new ObjectId(payload.sub);
        const usersCollection = await getCollection<User>('Users');
        
        // 2. Consultar la BD para obtener el usuario completo (incluyendo 'role')
        const user = await usersCollection.findOne(
            { _id: userId },
            { projection: { passwordHash: 0 } } // Excluir el hash por seguridad
        );

        if (!user) {
            return NextResponse.json({ user: null }, { status: 404 });
        }
        
        const { client } = user;
        let companyData = {};

        // 3. Consultar la BD para obtener la data de Licencia (Empresa)
        if (client) {
            const empresasCollection = await getCollection<Empresa>('Empresas');
            // Nota: Se asume que el nombre del cliente es la clave para buscar la licencia.
            const empresa = await empresasCollection.findOne({ name: client });

            if (empresa) {
                // Datos cruciales para Feature Gates y límites
                companyData = {
                    planName: empresa.planName,
                    userLimit: empresa.userLimit,
                    currentUsers: empresa.currentUsers,
                };
            }
        }
        
        // 4. Construir y retornar la sesión completa
        const sessionUser: SessionUser = {
            _id: user._id.toHexString(), 
            email: user.email,
            username: user.username,
            client: user.client,
            role: user.role, // <-- INCLUIDO DESDE LA BD
            is_aws: user.is_aws,
            is_azure: user.is_azure,
            user_db_aws: user.user_db_aws,
            user_db_azure: user.user_db_azure,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            // Aquí se agregan los datos de la licencia
            ...companyData 
        };

        return NextResponse.json({ user: sessionUser });

    } catch (error) {
        console.error('Error al obtener la sesión de usuario:', error);
        return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
    }
}