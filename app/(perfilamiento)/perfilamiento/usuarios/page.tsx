'use client'; 

import React from 'react';
import { useSession } from '@/hooks/useSession';
import UserTable from '@/components/perfilamiento/UserTable'; 


export default function ListadoUsuariosPage() {
    const { user, isLoading, refresh } = useSession(); 
    
    if (isLoading) return <p className="m-4">Cargando sesión...</p>;

    // CONTROL DE ACCESO: Admin Global o Admin Empresa
    if (!user || (user.role !== 'admin_global' && user.role !== 'admin_empresa')) {
        return <div className="alert alert-danger p-4 m-4">Acceso denegado.</div>;
    }

    return (
        <div className="container p-4">
            <h1 className="mb-4 display-6 fw-bold text-dark">Listado de Usuarios Registrados</h1>
            <p className="text-dark mb-4">
                {user.role === 'admin_empresa' 
                    ? `Visualización limitada a su empresa (${user.client}).`
                    : 'Visualización global de todos los usuarios.'}
            </p>
            
            <UserTable />
        </div>
    );
}