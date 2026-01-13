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
        
        // CAMPOS DE LICENCIA Y CONEXIÓN (AMPLIADOS)
        const { 
            planName, 
            userLimit: rawUserLimit, 
            is_aws, 
            user_db_aws, 
            is_azure, 
            user_db_azure,
            is_aws_multi_tenant,
            is_azure_multi_tenant,
            aws_accounts,
            azure_accounts,

            is_gcp,                 
            user_db_gcp,
            is_gcp_multi_tenant,
            gcp_accounts,
        } = body; 
        
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


        // 3. LÓGICA AMPLIADA: CONFIGURACIÓN AWS
        if (typeof is_aws === 'boolean') {
            updateFields.is_aws = is_aws;
            
            if (is_aws) {
                // Verificar si es multi-tenant
                if (is_aws_multi_tenant === true) {
                    updateFields.is_aws_multi_tenant = true;
                    updateFields.user_db_aws = null; // No usa DB maestra
                    
                    // Validar que hay cuentas
                    if (!aws_accounts || !Array.isArray(aws_accounts) || aws_accounts.length === 0) {
                        return NextResponse.json({ 
                            message: 'Debe proporcionar al menos una cuenta AWS en modo multi-tenant.' 
                        }, { status: 400 });
                    }
                    
                    // Validar estructura de cuentas
                    for (const acc of aws_accounts) {
                        if (!acc.id || !acc.alias || !acc.db) {
                            return NextResponse.json({ 
                                message: 'Todas las cuentas AWS deben tener id, alias y db.' 
                            }, { status: 400 });
                        }
                    }
                    
                    updateFields.aws_accounts = aws_accounts;
                } else {
                    // Modo single-tenant tradicional
                    updateFields.is_aws_multi_tenant = false;
                    updateFields.aws_accounts = undefined; // Limpiar array
                    updateFields.user_db_aws = user_db_aws;
                    
                    if (!user_db_aws || user_db_aws.trim() === '') {
                        return NextResponse.json({ 
                            message: 'La cadena de conexión AWS es requerida si el acceso está habilitado.' 
                        }, { status: 400 });
                    }
                }
            } else {
                // AWS desactivado - limpiar todo
                updateFields.user_db_aws = null;
                updateFields.is_aws_multi_tenant = false;
                updateFields.aws_accounts = undefined;
            }
        }
        
        // 4. LÓGICA AMPLIADA: CONFIGURACIÓN AZURE
        if (typeof is_azure === 'boolean') {
            updateFields.is_azure = is_azure;
            
            if (is_azure) {
                // Verificar si es multi-tenant
                if (is_azure_multi_tenant === true) {
                    updateFields.is_azure_multi_tenant = true;
                    updateFields.user_db_azure = null; // No usa DB maestra
                    
                    // Validar que hay cuentas
                    if (!azure_accounts || !Array.isArray(azure_accounts) || azure_accounts.length === 0) {
                        return NextResponse.json({ 
                            message: 'Debe proporcionar al menos una cuenta Azure en modo multi-tenant.' 
                        }, { status: 400 });
                    }
                    
                    // Validar estructura de cuentas
                    for (const acc of azure_accounts) {
                        if (!acc.id || !acc.alias || !acc.db) {
                            return NextResponse.json({ 
                                message: 'Todas las cuentas Azure deben tener id, alias y db.' 
                            }, { status: 400 });
                        }
                    }
                    
                    updateFields.azure_accounts = azure_accounts;
                } else {
                    // Modo single-tenant tradicional
                    updateFields.is_azure_multi_tenant = false;
                    updateFields.azure_accounts = undefined; // Limpiar array
                    updateFields.user_db_azure = user_db_azure;
                    
                    if (!user_db_azure || user_db_azure.trim() === '') {
                        return NextResponse.json({ 
                            message: 'La cadena de conexión Azure es requerida si el acceso está habilitado.' 
                        }, { status: 400 });
                    }
                }
            } else {
                // Azure desactivado - limpiar todo
                updateFields.user_db_azure = null;
                updateFields.is_azure_multi_tenant = false;
                updateFields.azure_accounts = undefined;
            }
        }

        // 5. LÓGICA AMPLIADA: CONFIGURACIÓN GCP
        if (typeof is_gcp === 'boolean') {
            updateFields.is_gcp = is_gcp;

            if (is_gcp) {
                if (is_gcp_multi_tenant === true) {
                    updateFields.is_gcp_multi_tenant = true;
                    updateFields.user_db_gcp = null;

                    if (!gcp_accounts || !Array.isArray(gcp_accounts) || gcp_accounts.length === 0) {
                        return NextResponse.json({
                            message: 'Debe proporcionar al menos un proyecto GCP en modo multi-tenant.'
                        }, { status: 400 });
                    }

                    for (const acc of gcp_accounts) {
                        if (!acc.id || !acc.alias || !acc.db) {
                            return NextResponse.json({
                                message: 'Todos los proyectos GCP deben tener id, alias y db.'
                            }, { status: 400 });
                        }
                    }

                    updateFields.gcp_accounts = gcp_accounts;
                } else {
                    updateFields.is_gcp_multi_tenant = false;
                    updateFields.gcp_accounts = undefined;
                    updateFields.user_db_gcp = user_db_gcp;

                    if (!user_db_gcp || user_db_gcp.trim() === '') {
                        return NextResponse.json({
                            message: 'La cadena de conexión GCP es requerida si el acceso está habilitado.'
                        }, { status: 400 });
                    }
                }
            } else {
                updateFields.user_db_gcp = null;
                updateFields.is_gcp_multi_tenant = false;
                updateFields.gcp_accounts = undefined;
            }
        }
        
        // Agregar la fecha de actualización de la licencia
        updateFields.updatedAt = new Date();


        // 5. Ejecutar la actualización de la LICENCIA MAESTRA
        if (Object.keys(updateFields).length === 0) {
            return NextResponse.json({ message: 'No se proporcionaron campos válidos para actualizar.' }, { status: 200 });
        }

        const result = await empresasCollection.updateOne(
            { _id },
            { $set: updateFields }
        );
        
        // 6. PROPAGACIÓN DE CAMBIOS A USUARIOS ASOCIADOS
        const usersCollection = await getCollection<User>('Users'); 
        

        const fieldsToPropagate: Partial<User> = {
            is_aws: updateFields.is_aws,
            is_azure: updateFields.is_azure,
            is_gcp: updateFields.is_gcp, 
            is_aws_multi_tenant: updateFields.is_aws_multi_tenant,
            is_azure_multi_tenant: updateFields.is_azure_multi_tenant,
            is_gcp_multi_tenant: updateFields.is_gcp_multi_tenant
        };

        if (updateFields.planName !== undefined) {
            fieldsToPropagate.planName = updateFields.planName;
}
        // Propagar según el modo
        if (updateFields.is_aws_multi_tenant) {
            fieldsToPropagate.user_db_aws = null; // Usuarios en multi-tenant no usan DB maestra
            fieldsToPropagate.aws_accounts = updateFields.aws_accounts;
        } else if (updateFields.is_aws) {
            fieldsToPropagate.user_db_aws = updateFields.user_db_aws;
            fieldsToPropagate.aws_accounts = undefined;
        }

        if (updateFields.is_azure_multi_tenant) {
            fieldsToPropagate.user_db_azure = null; // Usuarios en multi-tenant no usan DB maestra
            fieldsToPropagate.azure_accounts = updateFields.azure_accounts;
        } else if (updateFields.is_azure) {
            fieldsToPropagate.user_db_azure = updateFields.user_db_azure;
            fieldsToPropagate.azure_accounts = undefined;
        }
        if (updateFields.is_gcp_multi_tenant) {
            fieldsToPropagate.user_db_gcp = null;
            fieldsToPropagate.gcp_accounts = updateFields.gcp_accounts;
        } else if (updateFields.is_gcp) {
            fieldsToPropagate.user_db_gcp = updateFields.user_db_gcp;
            fieldsToPropagate.gcp_accounts = undefined;
        }

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
        const usersCollection = await getCollection<User>('Users'); 

        // 2. Buscar la empresa antes de eliminar (necesitamos el nombre para eliminar usuarios)
        const empresaToDelete = await empresasCollection.findOne({ _id });

        if (!empresaToDelete) {
            return NextResponse.json({ message: 'Licencia no encontrada.' }, { status: 404 });
        }
        
        // 3. Eliminar todos los usuarios asociados a esa empresa/cliente
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