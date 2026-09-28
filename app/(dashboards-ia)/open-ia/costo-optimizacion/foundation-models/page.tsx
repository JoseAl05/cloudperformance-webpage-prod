import { MainViewOpenAICostOptimizationFoundationModelsComponent } from '@/components/open-ia/costo-optimizacion/foundation-models/MainViewCOOpenAIComponent';
import { Suspense } from 'react';

export default function DashboardOpenIACostAndOptimizationFoundationModelsPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <MainViewOpenAICostOptimizationFoundationModelsComponent />
        </Suspense>
    );
}