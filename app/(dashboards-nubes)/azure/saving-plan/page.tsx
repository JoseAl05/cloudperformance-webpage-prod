import { MainViewSavingPlanComponent } from '@/components/azure/vista-savings-plan/MainViewSavingsPlanComponent';
import { Suspense } from 'react';

export default function DashboardAzureSavingPlan() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewSavingPlanComponent />
            </Suspense>
        </div>
    )
}