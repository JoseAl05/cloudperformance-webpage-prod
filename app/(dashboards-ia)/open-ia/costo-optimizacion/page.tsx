import { MainViewCostOptimizationOpenAIComponent } from '@/components/open-ia/costo-optimizacion/MainViewCostOptimizationOpenAIComponent';
import { Suspense } from 'react';

export default function DashboardOpenIACostAndOptimizationPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <MainViewCostOptimizationOpenAIComponent />
        </Suspense>
    );
}