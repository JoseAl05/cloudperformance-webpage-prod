import { SelectAlertsCloud } from '@/components/alertas/SelectAlertsCloud';
import { Suspense } from 'react';

export const metadata = {
    title: 'Alertas - Cloud Performance',
};

export default function AlertasLandingPage() {
    return (
        <div className="w-full">
            <Suspense fallback={<div className="p-10 text-center text-gray-500">Cargando módulos de alertas...</div>}>
                <SelectAlertsCloud />
            </Suspense>
        </div>
    );
}