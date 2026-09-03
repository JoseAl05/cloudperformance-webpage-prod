import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { authorizeRequest } from '@/lib/authUtils';
import { PLAN_CONFIG } from '@/lib/plans';
import {
  CLOUD_LABELS,
  CLOUD_PROVIDERS,
  CloudAccountsError,
  normalizeCloudAccounts,
} from '@/lib/cloudAccounts';
import { Empresa } from '@/types/db';

// =========================================================================
// RUTA: GET /api/perfilamiento/empresas (Listado de Nombres y Datos de Licencia)
// =========================================================================

export async function GET(req: NextRequest) {
  // 1. Autorización: Exclusivo para admin_global
  const auth = await authorizeRequest(req, ['admin_global']);
  if (!auth.authorized) {
    return NextResponse.json(
      { message: auth.message },
      { status: auth.status }
    );
  }

  try {
    const empresasCollection = await getCollection<Empresa>('Empresas');

    const empresas = await empresasCollection
      .find({})
      .project({
        name: 1,
        userLimit: 1,
        currentUsers: 1,
        planName: 1,
        is_aws: 1,
        is_azure: 1,
        user_db_aws: 1,
        user_db_azure: 1,
        is_aws_multi_tenant: 1,
        is_azure_multi_tenant: 1,
        azure_accounts: 1,
        aws_accounts: 1,

        is_gcp: 1,                 
        user_db_gcp: 1,            
        is_gcp_multi_tenant: 1,   
        gcp_accounts: 1,

        _id: 1,
      })
      .toArray();

    return NextResponse.json(empresas, { status: 200 });
  } catch (error) {
    console.error('Error al listar empresas:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor al listar empresas.' },
      { status: 500 }
    );
  }
}

// =========================================================================
// RUTA: POST /api/perfilamiento/empresas (Creación de Licencia)
// =========================================================================

export async function POST(req: NextRequest) {
  const auth = await authorizeRequest(req, ['admin_global']);
  if (!auth.authorized) {
    return NextResponse.json(
      { message: auth.message },
      { status: auth.status }
    );
  }

  const body = await req.json();
  const { name, planName, userLimit } = body;

  if (!name || !planName) {
    return NextResponse.json(
      { message: 'Faltan campos esenciales: name y planName.' },
      { status: 400 }
    );
  }

  // 1. Validar Plan
  const planConfig = PLAN_CONFIG[planName as keyof typeof PLAN_CONFIG];
  if (!planConfig) {
    return NextResponse.json(
      { message: `Plan de servicio '${planName}' no reconocido.` },
      { status: 400 }
    );
  }

  try {
    const empresasCollection = await getCollection<Empresa>('Empresas');

    if (await empresasCollection.findOne({ name })) {
      return NextResponse.json(
        { message: `La empresa '${name}' ya tiene una licencia activa.` },
        { status: 409 }
      );
    }

    // 2. Construir el objeto final para la DB
    const newEmpresa: Omit<Empresa, '_id'> = {
      name,
      planName,
      userLimit: userLimit || planConfig.userLimit,
      currentUsers: 0,

      is_aws: false,
      user_db_aws: null,
      is_aws_multi_tenant: false,

      is_azure: false,
      user_db_azure: null,
      is_azure_multi_tenant: false,

      is_gcp: false,
      user_db_gcp: null,
      is_gcp_multi_tenant: false,

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 3. Configuración por nube.
    //    Multi-tenant  -> se persiste `<cloud>_accounts` (IDs generados aquí).
    //    Single-tenant -> se persiste `user_db_<cloud>` y NO se crea el array.
    const cloudFields = newEmpresa as unknown as Record<string, unknown>;

    for (const cloud of CLOUD_PROVIDERS) {
      const isEnabled = body[`is_${cloud}`] === true;
      const isMultiTenant = body[`is_${cloud}_multi_tenant`] === true;
      const masterDb = body[`user_db_${cloud}`];

      cloudFields[`is_${cloud}`] = isEnabled;

      if (!isEnabled) continue;

      if (isMultiTenant) {
        cloudFields[`is_${cloud}_multi_tenant`] = true;
        cloudFields[`${cloud}_accounts`] = normalizeCloudAccounts(
          cloud,
          body[`${cloud}_accounts`]
        );
        continue;
      }

      if (typeof masterDb !== 'string' || masterDb.trim() === '') {
        return NextResponse.json(
          {
            message: `El campo Nombre DB ${CLOUD_LABELS[cloud].label} Maestra es requerido.`,
          },
          { status: 400 }
        );
      }

      cloudFields[`user_db_${cloud}`] = masterDb.trim();
    }

    const result = await empresasCollection.insertOne(newEmpresa);

    return NextResponse.json(
      {
        message:
          'Licencia de empresa creada y conexiones maestras registradas.',
        empresaId: result.insertedId,
        userLimit: newEmpresa.userLimit,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof CloudAccountsError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    console.error('Error al crear empresa:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor al crear empresa.' },
      { status: 500 }
    );
  }
}
