'use client';

import React from 'react';
import { Lock, FileText } from 'lucide-react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';


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

interface AwsLayoutProps {
    children: React.ReactNode;
}

export default function AwsBedrockLayout({ children }: AwsLayoutProps) {
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
    // Fallback de seguridad
    return <AccessDeniedComponent planName={currentPlanName || 'ERROR'} />;
}