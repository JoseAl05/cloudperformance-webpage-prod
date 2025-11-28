import { NextRequest, NextResponse } from 'next/server';
import { getCollection, getDb } from '@/lib/mongodb';
import { authorizeRequest } from '@/lib/authUtils';
import { Empresa, User } from '@/types/db'; 
import bcrypt from 'bcryptjs';
import { Filter } from 'mongodb'; 

// =========================================================================
// RUTA: GET /api/perfilamiento/users (Listado de Usuarios) - FUNCIONANDO
// =========================================================================

export async function GET(req: NextRequest) {
  // 1. Autorización: Permitir solo a admin_global y admin_empresa
  const auth = await authorizeRequest(req, ['admin_global', 'admin_empresa']);
  if (!auth.authorized) {
    return NextResponse.json(
      { message: auth.message },
      { status: auth.status }
    );
  }

  const userLoggedIn = auth.user;
  
  // --- CORRECCIÓN: Tipar explícitamente el filtro de MongoDB ---
  let query: Filter<User> = {};

  // 2. Aplicar Filtro de Empresa si el rol es admin_empresa
  if (userLoggedIn.role === 'admin_empresa') {
    query = { client: userLoggedIn.client };
  }

  try {
    const usersCollection = await getCollection<User>('Users');

    // 3. Ejecutar la consulta con el filtro
    const users = await usersCollection
      .find(query)
      .project({ passwordHash: 0 })
      .toArray();

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Error al listar usuarios:', error);
    return NextResponse.json(
      {
        message: 'Error interno del servidor al obtener la lista de usuarios.',
      },
      { status: 500 }
    );
  }
}

// =========================================================================
// RUTA: POST /api/perfilamiento/users (Creación de Usuarios)
// =========================================================================

export async function POST(req: NextRequest) {
  const auth = await authorizeRequest(req, ['admin_global', 'admin_empresa']);
  if (!auth.authorized) {
    return NextResponse.json({ message: auth.message }, { status: 403 });
  }

  const userCreating = auth.user;
  const body = await req.json();

  // 1. Extraer datos 
  const { email, password, username, client, role = 'usuario' } = body;

  // Validación básica
  if (!email || !password || !client) {
    return NextResponse.json(
      { message: 'Faltan campos esenciales (email, password, client).' },
      { status: 400 }
    );
  }

  try {
    const db = await getDb();
    const usersCollection = db.collection<User>('Users');
    const empresasCollection = db.collection<Empresa>('Empresas');

    if (await usersCollection.findOne({ email })) {
      return NextResponse.json(
        { message: 'El correo electrónico ya está en uso.' },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12); 

    // 2. Buscar la empresa
    const empresa = await empresasCollection.findOne({ name: client });

    if (!empresa) {
      return NextResponse.json(
        {
          message: `La empresa '${client}' no existe. Debe crear la licencia primero.`,
        },
        { status: 400 }
      );
    }

    // --- CORRECCIÓN: Definir tipo extendido para evitar 'as any' ---
    // Esto asegura que TS reconozca las propiedades multi-tenant si no están en la interfaz base
    type EmpresaWithTenancy = Empresa & { 
        is_aws_multi_tenant?: boolean; 
        is_azure_multi_tenant?: boolean; 
    };
    const empresaTyped = empresa as EmpresaWithTenancy;

    // 3. HERENCIA DE CONEXIONES Y PERMISOS MULTI-TENANT
    const inherited_aws_db = empresa.user_db_aws || null;
    const inherited_azure_db = empresa.user_db_azure || null;

    const inherited_is_aws = empresa.is_aws || inherited_aws_db !== null;
    const inherited_is_azure = empresa.is_azure || inherited_azure_db !== null;

    // 💡 NUEVA HERENCIA MULTI-TENANT (Ahora sin 'any')
    const inherited_is_aws_multi_tenant = empresaTyped.is_aws_multi_tenant || false;
    const inherited_is_azure_multi_tenant = empresaTyped.is_azure_multi_tenant || false;
    const inherited_aws_accounts = empresa.aws_accounts || [];
    const inherited_azure_accounts = empresa.azure_accounts || [];

    // 4. Verificación de Límites
    if (userCreating.role === 'admin_empresa') {
      if (client !== userCreating.client) {
        return NextResponse.json(
          { message: 'No puedes crear usuarios fuera de tu empresa.' },
          { status: 403 }
        );
      }
      if (empresa.currentUsers >= empresa.userLimit) {
        throw new Error(`Límite de ${empresa.userLimit} usuarios alcanzado.`);
      }
    }

    // 5. Construir el nuevo usuario
    const newUser: Omit<User, '_id'> = {
      email,
      username: username || email,
      client,
      role,
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
      is_active: true,

      // ASIGNACIÓN DE VALORES HEREDADOS
      is_aws: inherited_is_aws,
      user_db_aws: inherited_aws_db,

      is_azure: inherited_is_azure,
      user_db_azure: inherited_azure_db,
    
      is_aws_multi_tenant: inherited_is_aws_multi_tenant,
      is_azure_multi_tenant: inherited_is_azure_multi_tenant,
      aws_accounts: inherited_aws_accounts,
      azure_accounts: inherited_azure_accounts,
    };

    // 6. Insertar y Actualizar
    await usersCollection.insertOne(newUser);

    await empresasCollection.updateOne(
      { _id: empresa._id },
      { $inc: { currentUsers: 1 } }
    );

    return NextResponse.json(
      { message: 'Usuario creado y licencia actualizada.' },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error en la creación de usuario:', error);
    
    let errorMessage = 'Error interno del servidor.';
    let status = 500;

    if (error instanceof Error) {
        errorMessage = error.message;
        if (errorMessage.includes('Límite')) {
            status = 400;
        }
    }

    return NextResponse.json(
      { message: errorMessage },
      { status: status }
    );
  }
}