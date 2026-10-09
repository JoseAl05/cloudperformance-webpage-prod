'use client'

import React from 'react';
import { FileText, Lock } from 'lucide-react';

type Accent = 'amber' | 'blue';

const ACCENT_CLASSES: Record<Accent, { border: string; icon: string; button: string }> = {
    amber: { border: 'border-amber-500', icon: 'text-amber-600', button: 'bg-amber-600 hover:bg-amber-700' },
    blue: { border: 'border-blue-500', icon: 'text-blue-600', button: 'bg-blue-600 hover:bg-blue-700' },
};

export const AccessDeniedComponent = ({ planName, serviceName }: { planName: string; serviceName: string }) => (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-lg p-10 bg-white rounded-xl shadow-2xl border-l-4 border-red-500">
            <div className="flex flex-col items-center text-center">
                <Lock className="h-12 w-12 text-red-600 mb-4" />
                <h2 className="text-2xl font-extrabold text-red-800 mb-2">Acceso Denegado a {serviceName}</h2>
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

export const PdfReportComponent = ({ planName, serviceName, accent = 'amber' }: { planName: string; serviceName: string; accent?: Accent }) => {
    const classes = ACCENT_CLASSES[accent];
    return (
        <div className="min-h-screen p-8 bg-gray-50 flex flex-col items-center">
            <div className={`w-full max-w-2xl p-6 bg-white rounded-xl shadow border-l-4 ${classes.border}`}>
                <FileText className={`h-10 w-10 ${classes.icon} mb-4 mx-auto`} />
                <h2 className="text-xl font-bold text-gray-800 text-center mb-2">Reporte de Uso Básico de {serviceName}</h2>
                <p className="text-gray-600 text-center">
                    Tu plan {planName.toUpperCase()} solo incluye la visualización de este reporte de resumen PDF.
                </p>
                <button className={`mt-4 w-full ${classes.button} text-white py-2 rounded transition`}>
                    Ver / Descargar Reporte PDF
                </button>
            </div>
        </div>
    );
};

interface PlanAccessGateProps {
    /** Nombre visible del servicio (p. ej. "Google Cloud Platform"). */
    serviceName: string
    loading: boolean
    canAccessFullDashboard: boolean
    canAccessPdfReport: boolean
    planName?: string
    /** Si es false, un plan con acceso solo a PDF recibe "Acceso Denegado" (servicios sin reporte PDF). */
    showPdfReport?: boolean
    pdfAccent?: Accent
    pdfFallbackPlanName?: string
    children: React.ReactNode
}

/**
 * Control de acceso por plan para el layout de una nube o servicio:
 * sin acceso → "Acceso Denegado"; acceso completo → `children`; solo PDF → pantalla del reporte PDF.
 */
export const PlanAccessGate = ({
    serviceName,
    loading,
    canAccessFullDashboard,
    canAccessPdfReport,
    planName,
    showPdfReport = true,
    pdfAccent = 'amber',
    pdfFallbackPlanName = 'Starter',
    children,
}: PlanAccessGateProps) => {
    if (loading) {
        return <p className="p-8 text-center text-gray-500">Cargando permisos de licencia...</p>;
    }

    // 1. SIN ACCESO (ni siquiera al PDF)
    if (!canAccessPdfReport) {
        return <AccessDeniedComponent planName={planName || 'PLAN NO DISPONIBLE'} serviceName={serviceName} />;
    }

    // 2. ACCESO COMPLETO
    if (canAccessFullDashboard) {
        return <>{children}</>;
    }

    // 3. ACCESO LIMITADO: solo el reporte PDF
    if (showPdfReport) {
        return <PdfReportComponent planName={planName || pdfFallbackPlanName} serviceName={serviceName} accent={pdfAccent} />;
    }

    // Fallback de seguridad
    return <AccessDeniedComponent planName={planName || 'ERROR'} serviceName={serviceName} />;
};
