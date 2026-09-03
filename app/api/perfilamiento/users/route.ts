import { NextRequest, NextResponse } from 'next/server';
import { getCollection, getDb } from '@/lib/mongodb';
import { authorizeRequest } from '@/lib/authUtils';
import { CLOUD_PROVIDERS, cloneAccountsForUser } from '@/lib/cloudAccounts';
import { CloudAccount, Empresa, User } from '@/types/db';
import bcrypt from 'bcryptjs';
import { Filter } from 'mongodb';

// =========================================================================
// RUTA: GET /api/perfilamiento/users (Listado de Usuarios) 
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

    // 3. Verificación de Límites
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

    // 4. Construir el nuevo usuario
    const newUser: Omit<User, '_id'> = {
      email,
      username: username || email,
      client,
      role,
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
      is_active: true,

      is_aws: false,
      user_db_aws: null,
      is_aws_multi_tenant: false,

      is_azure: false,
      user_db_azure: null,
      is_azure_multi_tenant: false,

      is_gcp: false,
      user_db_gcp: null,
      is_gcp_multi_tenant: false,

      planName: empresa.planName || null,
    };

    // 5. HERENCIA DESDE LA EMPRESA
    //    El usuario es un espejo de su empresa: en multi-tenant hereda
    //    `<cloud>_accounts` con los MISMOS IDs `clp-<id>`; en single-tenant
    //    no se crea el array y se hereda `user_db_<cloud>`.
    const inheritedFields = newUser as unknown as Record<string, unknown>;

    for (const cloud of CLOUD_PROVIDERS) {
      const masterDb = empresa[`user_db_${cloud}`] ?? null;
      const isMultiTenant = empresa[`is_${cloud}_multi_tenant`] === true;
      const isEnabled = empresa[`is_${cloud}`] === true || masterDb !== null;

      inheritedFields[`is_${cloud}`] = isEnabled;

      if (!isEnabled) continue;

      const accounts = isMultiTenant
        ? cloneAccountsForUser(
            empresa[`${cloud}_accounts`] as CloudAccount[] | undefined
          )
        : undefined;

      if (accounts) {
        inheritedFields[`is_${cloud}_multi_tenant`] = true;
        inheritedFields[`${cloud}_accounts`] = accounts;
        continue;
      }

      if (isMultiTenant) {
        // Empresa marcada multi-tenant pero sin cuentas: dato heredado
        // inconsistente. Se degrada a single-tenant en vez de copiar un
        // array vacío que dejaría al usuario sin conexión utilizable.
        console.warn(
          `Empresa '${client}' es multi-tenant en ${cloud} pero no tiene ${cloud}_accounts.`
        );
      }

      inheritedFields[`user_db_${cloud}`] = masterDb;
    }

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

    return NextResponse.json({ message: errorMessage }, { status: status });
  }
}
