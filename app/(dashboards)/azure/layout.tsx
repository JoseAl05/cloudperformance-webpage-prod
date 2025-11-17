'use client'; 

import React from 'react';
import { Lock, FileText } from 'lucide-react'; 
import { useFeatureAccess } from '@/hooks/useFeatureAccess'; 

// Componente Placeholder para el Reporte PDF (deberías crear el tuyo)
const AzurePdfReportComponent = ({ planName }: { planName: string }) => (
    <div className="min-h-screen p-8 bg-gray-50 flex flex-col items-center">
        <div className="w-full max-w-2xl p-6 bg-white rounded-xl shadow border-l-4 border-blue-500">
            <FileText className="h-10 w-10 text-blue-600 mb-4 mx-auto" />
            <h2 className="text-xl font-bold text-gray-800 text-center mb-2">Reporte de Uso Básico de Azure</h2>
            <p className="text-gray-600 text-center">
                Tu plan {planName.toUpperCase()} solo incluye la visualización de este reporte de resumen PDF.
            </p>
            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Ver / Descargar Reporte PDF
            </button>
        </div>
    </div>
);


const AccessDeniedComponent = ({ planName }: { planName: string }) => (
    // ... (El componente de denegación sin acceso total es el mismo)
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-lg p-10 bg-white rounded-xl shadow-2xl border-l-4 border-red-500">
            <div className="flex flex-col items-center text-center">
                <Lock className="h-12 w-12 text-red-600 mb-4" />
                <h2 className="text-2xl font-extrabold text-red-800 mb-2">Acceso Denegado</h2>
                <p className="text-lg text-gray-700 mt-3">
                    Tu plan (**{planName.toUpperCase()}**) no permite ningún tipo de acceso a esta plataforma.
                </p>
            </div>
        </div>
    </div>
);

interface AzureLayoutProps {
    children: React.ReactNode;
}

export default function AzureLayout({ children }: AzureLayoutProps) {
    const { 
        loading, 
        canAccessFullDashboardAzure, 
        canAccessPdfReportAzure, // Usamos el permiso del PDF
        currentPlanName 
    } = useFeatureAccess();

    if (loading) {
        return <p className="p-8 text-center text-gray-500">Cargando permisos de licencia...</p>;
    }

    // 1. SIN ACCESO (ni siquiera al PDF)
    if (!canAccessPdfReportAzure) {
        return <AccessDeniedComponent planName={currentPlanName || 'PLAN NO DISPONIBLE'} />;
    }

    // 2. ACCESO COMPLETO (Pro o Business)
    if (canAccessFullDashboardAzure) {
        return <>{children}</>;
    }

    // 3. ACCESO LIMITADO (Starter Freemium o Starter)
    // Mostramos solo el componente de reporte PDF
    if (canAccessPdfReportAzure && !canAccessFullDashboardAzure) {
        return <AzurePdfReportComponent planName={currentPlanName || 'Starter (Freemium)'} />;
    }
    
    // Fallback de seguridad (nunca debería llegar aquí)
    return <AccessDeniedComponent planName={currentPlanName || 'ERROR'} />;
}