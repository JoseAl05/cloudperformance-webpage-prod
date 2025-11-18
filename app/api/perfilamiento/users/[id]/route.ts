import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getCollection, getDb } from '@/lib/mongodb';
import { authorizeRequest } from '@/lib/authUtils';
import { User, Empresa } from '@/types/db';
import bcrypt from 'bcryptjs';

// Define el tipo para los parámetros dinámicos de la ruta
interface Params {
  params: { id: string };
}

// =========================================================================
// RUTA: PUT /api/perfilamiento/users/[id] (Edición de Usuario)
// =========================================================================
export async function PUT(req: NextRequest, { params }: Params) {
  const auth = await authorizeRequest(req, ['admin_global', 'admin_empresa']);
  if (!auth.authorized) {
    return NextResponse.json({ message: auth.message }, { status: 403 });
  }

  const userEditing = auth.user;
  const userIdToEdit = params.id;

  if (!userIdToEdit || !ObjectId.isValid(userIdToEdit)) {
    return NextResponse.json(
      { message: 'ID de usuario inválido.' },
      { status: 400 }
    );
  }

  const _id = new ObjectId(userIdToEdit);
  const body = await req.json();
  const updateFields: unknown = {};

  try {
    const usersCollection = await getCollection<User>('Users');
    const userFound = await usersCollection.findOne({ _id });
    if (!userFound) {
      return NextResponse.json(
        { message: 'Usuario no encontrado.' },
        { status: 404 }
      );
    }

    // 1. Comprobaciones de Seguridad de Roles (sin cambios)
    if (userEditing.role === 'admin_empresa') {
      if (userFound.client !== userEditing.client) {
        return NextResponse.json(
          {
            message:
              'No tienes permiso para editar usuarios fuera de tu empresa.',
          },
          { status: 403 }
        );
      }
      if (body.role && body.role === 'admin_global') {
        return NextResponse.json(
          { message: "No puedes asignar el rol 'admin_global'." },
          { status: 403 }
        );
      }
    }

    // 2. Preparar Campos y Ejecutar Actualización

    // Manejar cambio de contraseña
    if (body.password) {
      updateFields.passwordHash = await bcrypt.hash(body.password, 12);
    }

    // CORRECCIÓN CLAVE: Añadir 'is_active' como campo permitido para la actualización
    const allowedFields = [
      'email',
      'username',
      'role',
      'is_aws',
      'is_azure',
      'user_db_aws',
      'user_db_azure',
      'is_active', // <-- AÑADIDO
      'passwordHash', // Para que el campo de la contraseña hasheada sea incluido
    ];

    allowedFields.forEach((key) => {
      if (body[key] !== undefined && body[key] !== null) {
        // Asegurar que is_active solo acepte booleanos
        if (key === 'is_active' && typeof body[key] !== 'boolean') {
          // Ignorar o registrar error
        } else {
          updateFields[key] = body[key];
        }
      }
    });

    // El admin global puede cambiar el campo 'client'
    if (body.client && userEditing.role === 'admin_global') {
      updateFields.client = body.client;
    }

    // Validación: No permitir que el admin se bloquee a sí mismo (solo si el campo está en el body)
    if (body.is_active === false && userEditing.userId === userIdToEdit) {
      return NextResponse.json(
        { message: 'No puedes bloquear tu propia cuenta de administrador.' },
        { status: 403 }
      );
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        { message: 'No se proporcionaron campos válidos para actualizar.' },
        { status: 400 }
      );
    }

    updateFields.updatedAt = new Date();
    const result = await usersCollection.updateOne(
      { _id },
      { $set: updateFields }
    );

    return NextResponse.json(
      { message: `Usuario ${userIdToEdit} actualizado exitosamente.` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor al actualizar usuario.' },
      { status: 500 }
    );
  }
}

// =========================================================================
// RUTA: DELETE /api/perfilamiento/users/[id] (Eliminación de Usuario) - Sin cambios
// =========================================================================
export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = await authorizeRequest(req, ['admin_global', 'admin_empresa']);
  if (!auth.authorized) {
    return NextResponse.json({ message: auth.message }, { status: 403 });
  }

  const userDeleting = auth.user;
  const userIdToDelete = params.id;

  if (!userIdToDelete || !ObjectId.isValid(userIdToDelete)) {
    return NextResponse.json(
      { message: 'ID de usuario inválido.' },
      { status: 400 }
    );
  }

  const _id = new ObjectId(userIdToDelete);

  try {
    const db = await getDb();
    const usersCollection = await getCollection<User>('Users');
    const empresasCollection = await getCollection<Empresa>('Empresas');

    const userFound = await usersCollection.findOne({ _id });
    if (!userFound) {
      return NextResponse.json(
        { message: 'Usuario no encontrado para eliminar.' },
        { status: 404 }
      );
    }

    // 2. Comprobaciones de Seguridad
    if (userDeleting.role === 'admin_empresa') {
      if (userFound.client !== userDeleting.client) {
        return NextResponse.json(
          {
            message:
              'No tienes permiso para eliminar usuarios fuera de tu empresa.',
          },
          { status: 403 }
        );
      }
      if (userDeleting.userId === userIdToDelete) {
        return NextResponse.json(
          {
            message:
              'Un administrador de empresa no puede eliminarse a sí mismo.',
          },
          { status: 403 }
        );
      }
    }

    // 3. Ejecutar ELIMINACIÓN y DECREMENTO
    const deleteResult = await usersCollection.deleteOne({ _id });

    if (deleteResult.deletedCount > 0) {
      await empresasCollection.updateOne(
        { name: userFound.client },
        { $inc: { currentUsers: -1 } }
      );

      return NextResponse.json(
        {
          message: `Usuario ${userFound.email} eliminado y licencia actualizada.`,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: 'Usuario no encontrado o ya eliminado.' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error en la eliminación de usuario:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor durante la eliminación.' },
      { status: 500 }
    );
  }
}
