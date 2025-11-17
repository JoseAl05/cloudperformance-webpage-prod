import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb'; 
import { getCollection } from '@/lib/mongodb'; 
import { authorizeRequest } from '@/lib/authUtils'; 
import { PLAN_CONFIG } from '@/lib/plans'; 
import { Empresa, User } from '@/types/db'; 

// Define el tipo para los parámetros dinámicos de la ruta
interface Params {
    params: { id: string };
}

// =========================================================================
// RUTA: GET /api/perfilamiento/empresas/[id] (Obtener datos de una sola Licencia)
// =========================================================================

export async function GET(req: NextRequest, { params }: Params) {
    // CORRECCIÓN: Desestructuración para acceso directo
    const { id } = await params;
    
    // 1. Autorización: Exclusivo para admin_global
    const auth = await authorizeRequest(req, ['admin_global']);
    if (!auth.authorized) {
        return NextResponse.json({ message: auth.message }, { status: 403 });
    }

    try {
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ message: 'ID de empresa inválido.' }, { status: 400 });
        }
        
        const _id = new ObjectId(id);
        const empresasCollection = await getCollection<Empresa>('Empresas');
        
        // Buscar la empresa por ID
        const empresa = await empresasCollection.findOne({ _id });

        if (!empresa) {
            return NextResponse.json({ message: 'Licencia no encontrada.' }, { status: 404 });
        }

        return NextResponse.json(empresa, { status: 200 });

    } catch (error) {
        console.error('Error al obtener licencia:', error);
        return NextResponse.json({ message: 'Error interno del servidor al obtener la licencia.' }, { status: 500 });
    }
}


// =========================================================================
// RUTA: PUT /api/perfilamiento/empresas/[id] (Edición de Licencia y Conexiones DB)
// =========================================================================

export async function PUT(req: NextRequest, { params }: Params) {
    // 🔥 CORRECCIÓN CLAVE: Desestructurar 'id' para evitar la advertencia
    const { id } = await params;
    
    // 1. Autorización: Exclusivo para admin_global
    const auth = await authorizeRequest(req, ['admin_global']);
    if (!auth.authorized) {
        return NextResponse.json({ message: auth.message }, { status: 403 });
    }

    try {
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ message: 'ID de empresa inválido.' }, { status: 400 });
        }

        const body = await req.json();
        
        // CAMPOS DE LICENCIA Y CONEXIÓN
        const { planName, userLimit: rawUserLimit, is_aws, user_db_aws, is_azure, user_db_azure } = body; 
        
        const _id = new ObjectId(id);
        const empresasCollection = await getCollection<Empresa>('Empresas');

        const currentEmpresa = await empresasCollection.findOne({ _id });

        if (!currentEmpresa) {
            return NextResponse.json({ message: 'Licencia no encontrada.' }, { status: 404 });
        }
        
        const updateFields: Partial<Empresa> = {};
        let newLimit: number = currentEmpresa.userLimit;

        // 2. VALIDACIÓN Y ASIGNACIÓN DE PLAN/LÍMITE
        if (planName && planName !== currentEmpresa.planName) {
            const planConfig = PLAN_CONFIG[planName as keyof typeof PLAN_CONFIG];
            if (!planConfig) {
                return NextResponse.json({ message: `Plan de servicio '${planName}' no reconocido.` }, { status: 400 });
            }
            updateFields.planName = planName;
            newLimit = planConfig.userLimit; 
        }

        // ... (Lógica de Límite y validación de usuarios activos - sin cambios) ...
        if (typeof rawUserLimit === 'number' && rawUserLimit >= 0) {
            newLimit = rawUserLimit;
        }
        if (newLimit < currentEmpresa.currentUsers) {
             return NextResponse.json({ 
                message: `El nuevo límite (${newLimit}) no puede ser menor a los usuarios activos (${currentEmpresa.currentUsers}).`,
                currentUsers: currentEmpresa.currentUsers 
            }, { status: 409 });
        }
        updateFields.userLimit = newLimit;


        // 3. LÓGICA CLAVE: ASIGNACIÓN DE CADENAS DE CONEXIÓN
        // AWS
        if (typeof is_aws === 'boolean') {
            updateFields.is_aws = is_aws;
            updateFields.user_db_aws = is_aws ? user_db_aws : null;
            if (is_aws && (!user_db_aws || user_db_aws.trim() === '')) {
                return NextResponse.json({ message: 'La cadena de conexión AWS es requerida si el acceso está habilitado.' }, { status: 400 });
            }
        }
        
        // AZURE
        if (typeof is_azure === 'boolean') {
            updateFields.is_azure = is_azure;
            updateFields.user_db_azure = is_azure ? user_db_azure : null;
            if (is_azure && (!user_db_azure || user_db_azure.trim() === '')) {
                return NextResponse.json({ message: 'La cadena de conexión Azure es requerida si el acceso está habilitado.' }, { status: 400 });
            }
        }
        
        // Agregar la fecha de actualización de la licencia
        updateFields.updatedAt = new Date();


        // 4. Ejecutar la actualización de la LICENCIA MAESTRA
        if (Object.keys(updateFields).length === 0) {
            return NextResponse.json({ message: 'No se proporcionaron campos válidos para actualizar.' }, { status: 200 });
        }

        const result = await empresasCollection.updateOne(
            { _id },
            { $set: updateFields }
        );
        
        // 5. PROPAGACIÓN DE CAMBIOS A USUARIOS ASOCIADOS (HERENCIA INMEDIATA)
        const usersCollection = await getCollection<User>('Users'); 
        
        const fieldsToPropagate = {
            is_aws: updateFields.is_aws,
            user_db_aws: updateFields.user_db_aws,
            is_azure: updateFields.is_azure,
            user_db_azure: updateFields.user_db_azure,
        };

        const updateUsersResult = await usersCollection.updateMany(
            { client: currentEmpresa.name }, 
            { $set: fieldsToPropagate } 
        );
        

        return NextResponse.json({ 
            message: `Licencia de ${currentEmpresa.name} y ${updateUsersResult.modifiedCount} usuarios asociados actualizados exitosamente.`, 
            updatedFields: updateFields 
        }, { status: 200 });

    } catch (error) {
        console.error('Error al editar licencia:', error);
        return NextResponse.json({ message: 'Error interno del servidor al editar la licencia.' }, { status: 500 });
    }
}


// =========================================================================
// RUTA: DELETE /api/perfilamiento/empresas/[id] (Eliminación de Licencia y Usuarios)
// =========================================================================

export async function DELETE(req: NextRequest, { params }: Params) {
    // 🔥 CORRECCIÓN CLAVE: Desestructurar 'id' para evitar la advertencia
    const { id } = await params;
    
    // 1. Autorización: Exclusivo para admin_global
    const auth = await authorizeRequest(req, ['admin_global']);
    if (!auth.authorized) {
        return NextResponse.json({ message: auth.message }, { status: 403 });
    }

    try {
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ message: 'ID de empresa inválido.' }, { status: 400 });
        }
        
        const _id = new ObjectId(id);
        const empresasCollection = await getCollection<Empresa>('Empresas');
        // CORRECCIÓN: Usar la interfaz 'User' para la colección de usuarios
        const usersCollection = await getCollection<User>('Users'); 

        // 2. Buscar la empresa antes de eliminar (necesitamos el nombre para eliminar usuarios)
        const empresaToDelete = await empresasCollection.findOne({ _id });

        if (!empresaToDelete) {
            return NextResponse.json({ message: 'Licencia no encontrada.' }, { status: 404 });
        }
        
        // 3. Eliminar todos los usuarios asociados a esa empresa/cliente
        // Los usuarios se eliminan con la clave 'client'
        const deleteUsersResult = await usersCollection.deleteMany({ client: empresaToDelete.name });

        // 4. Eliminar la licencia (empresa)
        const deleteEmpresaResult = await empresasCollection.deleteOne({ _id });

        if (deleteEmpresaResult.deletedCount === 0) {
            return NextResponse.json({ message: 'Licencia no encontrada o no se pudo eliminar.' }, { status: 404 });
        }
        
        return NextResponse.json({ 
            message: `Licencia de ${empresaToDelete.name} y ${deleteUsersResult.deletedCount} usuarios asociados eliminados exitosamente.`,
            deletedUsers: deleteUsersResult.deletedCount 
        }, { status: 200 });

    } catch (error) {
        console.error('Error al eliminar licencia:', error);
        return NextResponse.json({ message: 'Error interno del servidor al eliminar la licencia.' }, { status: 500 });
    }
}