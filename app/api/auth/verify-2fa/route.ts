import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCollection } from '@/lib/mongodb';
import { signAuthToken } from '@/lib/auth';
import { get } from 'http';

const VerifySchema = z.object({
  userId: z.string().min(1),
  code: z.string().length(6),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = VerifySchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });

  const { userId, code } = parsed.data;

  const users = await getCollection('Users');
  const user = await users.findOne({
    _id: { $eq: new (await import('mongodb')).ObjectId(userId) } as unknown,
  });

  if (!user)
    return NextResponse.json(
      { error: 'Usuario no encontrado' },
      { status: 404 }
    );

  // =======================================================
  //  NUEVA LÓGICA DE VERIFICACIÓN DE ESTADO ACTIVO
  // =======================================================
  // Si el campo is_active es explícitamente `false`, denegar el acceso.
  if (user.is_active === false) {
    return NextResponse.json(
      {
        error:
          'Tu cuenta ha sido bloqueada por un administrador. Contacta al soporte para más detalles.',
      },
      { status: 403 } // 403 Forbidden
    );
  }
  // =======================================================

  // Obtener datos de cliente asociado a usuario
  const clients = await getCollection('Empresas')
  const clientData = await clients.findOne({ name: user.client });

  if (!clientData) {
    return NextResponse.json(
      {
        error:
          'Tu empresa no tiene una licencia activa. Contacta al soporte para más detalles.',
      },
      { status: 403 }
    );
  }

  // Obtener datos de conectores asociados al cliente
  const connectors = await getCollection('cloudperformance_external_connectors');
  const connectorData = await connectors
    .find({ "created_by.email": user.email, "created_by.username": user.username })
    .project({ _id: 0, connector_type: 1, created_by: 1, config: 1, created_at: 1, updated_at: 1, status: 1, encrypted_credentials: 1 })
    .toArray();


  const codes = await getCollection('twofactor_codes');
  const tf = await codes.findOne({ userId, code, purpose: 'login' });
  if (!tf)
    return NextResponse.json({ error: 'Código inválido' }, { status: 401 });

  if (new Date(tf.expiresAt).getTime() < Date.now()) {
    return NextResponse.json({ error: 'Código expirado' }, { status: 401 });
  }

  await codes.deleteMany({ userId, purpose: 'login' });

  await signAuthToken({
    sub: String(user._id),
    username: user.username,
    email: user.email,
    client: user.client,
    role: user.role,
    user_db_aws: user.user_db_aws,
    user_db_azure: user.user_db_azure,
    user_db_gcp: user.user_db_gcp,
    is_aws: user.is_aws,
    is_azure: user.is_azure,
    is_gcp: user.is_gcp,
    is_aws_multi_tenant: clientData.is_aws_multi_tenant === true,
    is_azure_multi_tenant: clientData.is_azure_multi_tenant === true,
    is_gcp_multi_tenant: clientData.is_gcp_multi_tenant === true,
    // Sólo hay cuentas en multi-tenant; en single-tenant manda `user_db_<cloud>`.
    aws_accounts:
      clientData.is_aws_multi_tenant === true
        ? clientData.aws_accounts || []
        : [],
    azure_accounts:
      clientData.is_azure_multi_tenant === true
        ? clientData.azure_accounts || []
        : [],
    gcp_accounts:
      clientData.is_gcp_multi_tenant === true
        ? clientData.gcp_accounts || []
        : [],
    planName: user.planName,
    connectors: connectorData || []
  });

  const sessions = await getCollection('sessions');
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  await sessions.insertOne({
    userId: String(user._id),
    createdAt: now,
    expiresAt,
  });

  return NextResponse.json({ ok: true });
}
