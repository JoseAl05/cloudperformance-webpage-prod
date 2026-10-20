import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getCollection } from '@/lib/mongodb';
import { authorizeRequest } from '@/lib/authUtils';
import { PLAN_CONFIG } from '@/lib/plans';
import {
  CLOUD_LABELS,
  CLOUD_PROVIDERS,
  CloudAccountsError,
  normalizeCloudAccounts,
} from '@/lib/cloudAccounts';
import { CloudAccount, Empresa, User } from '@/types/db';

interface Params {
  params: { id: string };
}

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;

  const auth = await authorizeRequest(req, ['admin_global']);
  if (!auth.authorized) {
    return NextResponse.json({ message: auth.message }, { status: 403 });
  }

  try {
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'ID de empresa inválido.' },
        { status: 400 },
      );
    }

    const _id = new ObjectId(id);
    const empresasCollection = await getCollection<Empresa>('Empresas');

    const empresa = await empresasCollection.findOne({ _id });

    if (!empresa) {
      return NextResponse.json(
        { message: 'Licencia no encontrada.' },
        { status: 404 },
      );
    }

    return NextResponse.json(empresa, { status: 200 });
  } catch (error) {
    console.error('Error al obtener licencia:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor al obtener la licencia.' },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;

  const auth = await authorizeRequest(req, ['admin_global']);
  if (!auth.authorized) {
    return NextResponse.json({ message: auth.message }, { status: 403 });
  }

  try {
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'ID de empresa inválido.' },
        { status: 400 },
      );
    }

    const body = await req.json();

    const { planName, userLimit: rawUserLimit } = body;

    const _id = new ObjectId(id);
    const empresasCollection = await getCollection<Empresa>('Empresas');

    const currentEmpresa = await empresasCollection.findOne({ _id });

    if (!currentEmpresa) {
      return NextResponse.json(
        { message: 'Licencia no encontrada.' },
        { status: 404 },
      );
    }

    const setFields: Record<string, unknown> = {};
    const unsetFields: Record<string, ''> = {};

    const userSetFields: Record<string, unknown> = {};
    const userUnsetFields: Record<string, ''> = {};

    let newLimit: number = currentEmpresa.userLimit;

    if (planName && planName !== currentEmpresa.planName) {
      const planConfig = PLAN_CONFIG[planName as keyof typeof PLAN_CONFIG];
      if (!planConfig) {
        return NextResponse.json(
          { message: `Plan de servicio '${planName}' no reconocido.` },
          { status: 400 },
        );
      }
      setFields.planName = planName;
      userSetFields.planName = planName;
      newLimit = planConfig.userLimit;
    }

    if (typeof rawUserLimit === 'number' && rawUserLimit >= 0) {
      newLimit = rawUserLimit;
    }
    if (newLimit < currentEmpresa.currentUsers) {
      return NextResponse.json(
        {
          message: `El nuevo límite (${newLimit}) no puede ser menor a los usuarios activos (${currentEmpresa.currentUsers}).`,
          currentUsers: currentEmpresa.currentUsers,
        },
        { status: 409 },
      );
    }
    setFields.userLimit = newLimit;

    for (const cloud of CLOUD_PROVIDERS) {
      const isEnabled = body[`is_${cloud}`];

      if (typeof isEnabled !== 'boolean') continue;

      const isMultiTenant = body[`is_${cloud}_multi_tenant`] === true;
      const masterDb = body[`user_db_${cloud}`];

      const enabledField = `is_${cloud}`;
      const multiTenantField = `is_${cloud}_multi_tenant`;
      const dbField = `user_db_${cloud}`;
      const accountsField = `${cloud}_accounts`;

      setFields[enabledField] = isEnabled;

      if (isEnabled && isMultiTenant) {
        setFields[multiTenantField] = true;
        setFields[dbField] = null;
        setFields[accountsField] = normalizeCloudAccounts(
          cloud,
          body[accountsField],
          currentEmpresa[accountsField as keyof Empresa] as
            | CloudAccount[]
            | undefined,
        );
      } else {
        if (isEnabled && (typeof masterDb !== 'string' || !masterDb.trim())) {
          return NextResponse.json(
            {
              message: `La cadena de conexión ${CLOUD_LABELS[cloud].label} es requerida si el acceso está habilitado.`,
            },
            { status: 400 },
          );
        }

        setFields[multiTenantField] = false;
        setFields[dbField] = isEnabled ? (masterDb as string).trim() : null;
        unsetFields[accountsField] = '';
      }

      userSetFields[enabledField] = setFields[enabledField];
      userSetFields[multiTenantField] = setFields[multiTenantField];
      userSetFields[dbField] = setFields[dbField];

      if (accountsField in setFields) {
        userSetFields[accountsField] = setFields[accountsField];
      } else {
        userUnsetFields[accountsField] = '';
      }
    }

    setFields.updatedAt = new Date();

    const empresaUpdate: Record<string, unknown> = { $set: setFields };
    if (Object.keys(unsetFields).length > 0) {
      empresaUpdate.$unset = unsetFields;
    }

    await empresasCollection.updateOne({ _id }, empresaUpdate);

    const usersCollection = await getCollection<User>('Users');

    let modifiedUsers = 0;
    const hasUserUnset = Object.keys(userUnsetFields).length > 0;

    if (Object.keys(userSetFields).length > 0 || hasUserUnset) {
      const userUpdate: Record<string, unknown> = {
        $set: { ...userSetFields, updatedAt: new Date() },
      };
      if (hasUserUnset) {
        userUpdate.$unset = userUnsetFields;
      }

      const updateUsersResult = await usersCollection.updateMany(
        { client: currentEmpresa.name },
        userUpdate,
      );
      modifiedUsers = updateUsersResult.modifiedCount;
    }

    return NextResponse.json(
      {
        message: `Licencia de ${currentEmpresa.name} y ${modifiedUsers} usuarios asociados actualizados exitosamente.`,
        updatedFields: setFields,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof CloudAccountsError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    console.error('Error al editar licencia:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor al editar la licencia.' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = await params;

  const auth = await authorizeRequest(req, ['admin_global']);
  if (!auth.authorized) {
    return NextResponse.json({ message: auth.message }, { status: 403 });
  }

  try {
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'ID de empresa inválido.' },
        { status: 400 },
      );
    }

    const _id = new ObjectId(id);
    const empresasCollection = await getCollection<Empresa>('Empresas');
    const usersCollection = await getCollection<User>('Users');

    const empresaToDelete = await empresasCollection.findOne({ _id });

    if (!empresaToDelete) {
      return NextResponse.json(
        { message: 'Licencia no encontrada.' },
        { status: 404 },
      );
    }

    const deleteUsersResult = await usersCollection.deleteMany({
      client: empresaToDelete.name,
    });

    const deleteEmpresaResult = await empresasCollection.deleteOne({ _id });

    if (deleteEmpresaResult.deletedCount === 0) {
      return NextResponse.json(
        { message: 'Licencia no encontrada o no se pudo eliminar.' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: `Licencia de ${empresaToDelete.name} y ${deleteUsersResult.deletedCount} usuarios asociados eliminados exitosamente.`,
        deletedUsers: deleteUsersResult.deletedCount,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error al eliminar licencia:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor al eliminar la licencia.' },
      { status: 500 },
    );
  }
}
