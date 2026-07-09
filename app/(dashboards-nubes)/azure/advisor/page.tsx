'use client';
import { Suspense } from 'react';
import { MainViewAdvisorComponent } from '@/components/azure/vista-advisor/MainViewAdvisorComponent';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { Lock } from 'lucide-react';

const AccessDeniedComponent = ({ planName }: { planName: string }) => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 bg-gray-50 rounded-xl">
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl border-l-4 border-red-500">
            <Lock className="h-10 w-10 text-red-600 mb-4 mx-auto" />
            <h3 className="text-xl font-bold text-red-700">Función Exclusiva</h3>
            <p className="text-gray-600 mt-2 text-center">
                La Vista Avanzada requiere el plan Business. Tu plan actual ({planName}) no lo incluye.
            </p>
        </div>
    </div>
);


export default function DashboardAzureEventsPage() {
    const {
        loading,
        canAccessVistaAdvisor,
        currentPlanName
    } = useFeatureAccess();

    if (loading) {
        return <div className='p-4 text-center text-gray-500'>Cargando permisos de vista...</div>;
    }

    if (!canAccessVistaAdvisor) {
        return (
            <div className='p-4'>
                <AccessDeniedComponent planName={currentPlanName || 'N/D'} />
            </div>
        );
    }

    // Si tiene el permisos, renderiza la vista.
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewAdvisorComponent />
            </Suspense>
        </div>
    )
}