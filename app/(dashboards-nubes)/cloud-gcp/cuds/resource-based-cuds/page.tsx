import { MainViewSavingPlansComponent }  from '@/components/gcp/vista-cuds/resource-based-cuds/MainViewSavingPlansComponent';
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