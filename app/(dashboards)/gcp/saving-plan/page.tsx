import { MainViewSavingPlansComponent }  from '@/components/gcp/vista-saving-plan/MainViewSavingPlansComponent';
import { Suspense } from 'react';

export default function DashboardGcpSavingPlan() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewSavingPlansComponent />
            </Suspense>
        </div>
    )
}