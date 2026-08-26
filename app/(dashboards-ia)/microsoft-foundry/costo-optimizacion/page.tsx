import { MainViewCostOptimizationFoundryComponent } from '@/components/microsoft-foundry/costo-optimizacion/MainViewCostOptimizationComponent';
import { Suspense } from 'react';

export default function DashboardMicrosoftFoundryCostAndOptimizationPage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewCostOptimizationFoundryComponent />
            </Suspense>
        </div>
    )
}