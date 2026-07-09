'use client';

import React from 'react';
import { Lock, FileText } from 'lucide-react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';

const GCPPdfReportComponent = ({ planName }: { planName: string }) => (
    <div className="min-h-screen p-8 bg-gray-50 flex flex-col items-center">
        <div className="w-full max-w-2xl p-6 bg-white rounded-xl shadow border-l-4 border-amber-500">
            <FileText className="h-10 w-10 text-amber-600 mb-4 mx-auto" />
            <h2 className="text-xl font-bold text-gray-800 text-center mb-2">Reporte de Uso Básico de AWS</h2>
            <p className="text-gray-600 text-center">
                Tu plan {planName.toUpperCase()} solo incluye la visualización de este reporte de resumen PDF.
            </p>
            <button className="mt-4 w-full bg-amber-600 text-white py-2 rounded hover:bg-amber-700 transition">
                Ver / Descargar Reporte PDF
            </button>
        </div>
    </div>
);


// --- 2. Componente de Denegación de Acceso Total ---
const AccessDeniedComponent = ({ planName }: { planName: string }) => (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-lg p-10 bg-white rounded-xl shadow-2xl border-l-4 border-red-500">
            <div className="flex flex-col items-center text-center">
                <Lock className="h-12 w-12 text-red-600 mb-4" />
                <h2 className="text-2xl font-extrabold text-red-800 mb-2">Acceso Denegado a Amazon Web Services</h2>
                <p className="text-lg text-gray-700 mt-3">
                    Tu plan (**{planName.toUpperCase()}**) no permite ningún tipo de acceso a esta plataforma.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    Contacta a tu Administrador Global para revisar el estado de tu licencia.
                </p>
            </div>
        </div>
    </div>
);

interface GCPLayoutProps {
    children: React.ReactNode;
}

export default function GCPLayout({ children }: GCPLayoutProps) {
    const {
        loading,
        canAccessFullDashboardAws, // Permiso para Dashboard Completo
        canAccessPdfReportAws, // Permiso para Reporte PDF
        currentPlanName
    } = useFeatureAccess();

    if (loading) {
        return <p className="p-8 text-center text-gray-500">Cargando permisos de licencia...</p>;
    }

    // 1. SIN ACCESO (ni siquiera al PDF)
    if (!canAccessPdfReportAws) {
        return <AccessDeniedComponent planName={currentPlanName || 'PLAN NO DISPONIBLE'} />;
    }

    // 2. ACCESO COMPLETO (Pro o Business)
    if (canAccessFullDashboardAws) {
        return <>{children}</>;
    }

    // 3. ACCESO LIMITADO (Starter Freemium o Starter)
    // Mostramos solo el componente de reporte PDF
    if (canAccessPdfReportAws && !canAccessFullDashboardAws) {
        return <GCPPdfReportComponent planName={currentPlanName || 'Starter'} />;
    }

    // Fallback de seguridad
    return <AccessDeniedComponent planName={currentPlanName || 'ERROR'} />;
}