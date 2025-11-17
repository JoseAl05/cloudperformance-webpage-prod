'use client'; 

import React from 'react';
import { useSession } from '@/hooks/useSession';
import Link from 'next/link';
import LicenseTable from '@/components/perfilamiento/LicenseTable'; 

export default function ListadoLicenciasPage() {
    const { user, isLoading } = useSession(); 
    
    if (isLoading) return <div className="text-center p-6 text-gray-500">Cargando datos de sesión...</div>;

    // 1. CONTROL DE ACCESO ESTRICTO: Solo Admin Global
    if (!user || user.role !== 'admin_global') {
        return (
            <div className="alert alert-danger p-4 m-4">
                Acceso denegado. Esta función de gestión de licencias es exclusiva para el Administrador Global.
            </div>
        );
    }

    return (
        <div className="container p-4 p-md-5">
            <h1 className="mb-4 display-6 fw-bold text-dark">Auditoría y Gestión de Licencias</h1>
            <p className="text--dark mb-4">
                Vista global de todos los clientes, sus planes y el estado de uso de usuarios.
            </p>

            {/* CORRECCIÓN: Link moderno sin <a> ni props legacyBehavior/passHref */}
            <Link 
                href="/perfilamiento/licencias/crear" 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm mb-5"
            >
                + Crear Nueva Licencia/Empresa
            </Link>

            {/* 2. TABLA DE LICENCIAS */}
            <LicenseTable />
        </div>
    );
}