import { MainViewSavingPlansComponent }  from '@/components/gcp/vista-cuds/spend-based-cuds/MainViewSpendBasedCudsComponent';
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