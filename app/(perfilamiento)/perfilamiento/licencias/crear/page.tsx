'use client'; 

import React from 'react';
import { useSession } from '@/hooks/useSession';
import LicenseCreationForm from '@/components/perfilamiento/LicenseCreationForm'; 

export default function CrearLicenciaPage() {
    const { user, isLoading, refresh } = useSession(); 
    
    if (isLoading) return <p className="m-4">Cargando sesión...</p>;

    //CONTROL DE ACCESO ESTRICTO: Solo Admin Global
    if (!user || user.role !== 'admin_global') {
        return (
            <div className="alert alert-danger p-4 m-4">
                Acceso denegado. Esta función es exclusiva para el Administrador Global.
            </div>
        );
    }

    return (
        <div className="container p-4">
            <h1 className="mb-4 display-6 fw-bold text-dark">Crear Nueva Licencia de Empresa</h1>
            <p className="text--dark mb-4">
                Utilice esta vista para dar de alta a un nuevo cliente y asignar su plan de servicio inicial.
            </p>

            <div className="card shadow-lg border-0">
                <div className="card-body">
                    <LicenseCreationForm refreshLicenseStatus={refresh} /> 
                </div>
            </div>
        </div>
    );
}