import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE } from '@/lib/cookies';
import { verifyAuthToken, signAuthToken } from '@/lib/auth';
import { findCompanyByName } from '@/lib/db-utils';
import type { AuthUserPayload } from '@/types/db';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ message: 'No autenticado.' }, { status: 401 });
  }

    let originalPayload: any = null; 
    
    try {
        originalPayload = await verifyAuthToken(token);
        if (!originalPayload) throw new Error('Token inválido');
    } catch (err) {
        return NextResponse.json({ message: 'Token inválido o expirado.' }, { status: 401 });
    }

    // 1. LEER DATOS DE LA PETICIÓN (ANTES DE VALIDAR PERMISOS)
    const body = await request.json();
    const { 
        clientName, 
        user_db_azure: explicitAzureDb, 
        user_db_aws: explicitAwsDb,     
    } = body; 

  if (!clientName) {
    return NextResponse.json(
      { message: 'Falta el campo clientName.' },
      { status: 400 }
    );
  }

    // 🛑 2. VALIDACIÓN DE PERMISOS CORREGIDA 🛑
    // - Si es Admin Global: Pasa siempre.
    // - Si NO es Admin Global: Solo pasa si la empresa objetivo es SU MISMA empresa.
    const isGlobalAdmin = originalPayload.role === 'admin_global';
    const isSameCompany = originalPayload.client === clientName;

    if (!isGlobalAdmin && !isSameCompany) {
        return NextResponse.json({ message: 'Permiso denegado. No puedes cambiar el contexto a otra empresa.' }, { status: 403 });
    }

    // 3. Buscamos la empresa en la DB
    const targetCompany = await findCompanyByName(clientName);

    if (!targetCompany) {
        return NextResponse.json({ message: `Empresa '${clientName}' no encontrada.` }, { status: 404 });
    }

    // 4. CONSTRUCCIÓN DEL PAYLOAD
    
    // Priorizamos el valor explícito enviado por el frontend (selección multi-tenant)
    const finalAzureDb = explicitAzureDb || targetCompany.user_db_azure || null;
    const finalAwsDb = explicitAwsDb || targetCompany.user_db_aws || null;

    const newPayload = {
        ...originalPayload, // Mantiene sub, username, email...
        
        // Actualizamos contexto
        client: targetCompany.name,
        role: originalPayload.role, // Mantiene su rol original (admin_empresa o usuario)
        planName: targetCompany.planName,
        
        // 🛑 ASIGNACIÓN DE DB ACTIVA 🛑
        user_db_azure: finalAzureDb, 
        user_db_aws: finalAwsDb,
        
        // Incluir arrays actualizados
        is_aws: targetCompany.is_aws,
        is_azure: targetCompany.is_azure,
        azure_accounts: targetCompany.azure_accounts || [],
        aws_accounts: targetCompany.aws_accounts || [],

        // Timestamps
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
    } as AuthUserPayload; 
    
    await signAuthToken(newPayload);
    
    return NextResponse.json({ 
        message: `Contexto actualizado correctamente.`,
        client: targetCompany.name 
    }, { status: 200 });
}
