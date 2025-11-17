'use client';

import React from 'react';
import { Lock} from 'lucide-react'; 
import { useFeatureAccess } from '@/hooks/useFeatureAccess'; 

const AccessDeniedComponent = ({ planName }: { planName: string }) => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 bg-gray-50 rounded-xl">
        <div className="w-full max-w-lg p-10 bg-white rounded-xl shadow-2xl border-l-4 border-red-500">
            <div className="flex flex-col items-center text-center">
                <Lock className="h-12 w-12 text-red-600 mb-4" />
                <h2 className="text-2xl font-extrabold text-red-800 mb-2">Acceso Denegado al Módulo Presupuesto</h2>
                <p className="text-lg text-gray-700 mt-3">
                    Tu plan actual {planName.toUpperCase()} no incluye las herramientas de presupuesto.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    Esta función es exclusiva para el plan "Business". Considera actualizar tu suscripción para acceder a todas las funcionalidades.
                </p>
            </div>
        </div>
    </div>
);

interface PresupuestoClientLayoutProps {
    children: React.ReactNode;
}

export function PresupuestoClientLayout({ children }: PresupuestoClientLayoutProps) {
    const { 
        loading, 
        canAccessPresupuesto, 
        currentPlanName
    } = useFeatureAccess();

    if (loading) {
        return <p className="text-center text-gray-500">Verificando permisos de presupuesto...</p>;
    }

    if (!canAccessPresupuesto) {
        return <AccessDeniedComponent planName={currentPlanName || 'SIN PLAN DEFINIDO'} />;
    }

    return <>{children}</>;
}