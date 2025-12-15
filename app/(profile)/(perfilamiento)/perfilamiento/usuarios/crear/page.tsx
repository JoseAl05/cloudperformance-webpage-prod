'use client'; 

import React from 'react';
import { useSession } from '@/hooks/useSession';
import CreateUserForm from '@/components/perfilamiento/CreateUserForm';

export default function CrearUsuarioPage() {
    const { user, isLoading, refresh } = useSession(); 
    
    if (isLoading) return <p className="m-4">Cargando sesión...</p>;

    // CONTROL DE ACCESO: Admin Global o Admin Empresa
    if (!user || (user.role !== 'admin_global' && user.role !== 'admin_empresa')) {
        return <div className="alert alert-danger p-4 m-4">Acceso denegado.</div>;
    }

    return (
        <div className="container p-4">
            <h1 className="mb-4 display-6 fw-bold text-dark">Crear Nuevo Usuario</h1>
            <p className="text-dark mb-4">
                {user.role === 'admin_global' 
                    ? 'Seleccione la empresa para crear un nuevo usuario o administrador.'
                    : `Creación limitada a su empresa: ${user.client}.`}
            </p>

            <CreateUserForm refreshUserList={refresh} />
        </div>
    );
}