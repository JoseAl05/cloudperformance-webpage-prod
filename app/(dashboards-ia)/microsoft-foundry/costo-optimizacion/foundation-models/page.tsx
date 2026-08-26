import { MainViewAzureFoundryComponent } from '@/components/microsoft-foundry/costo-optimizacion/foundation-models/MainViewCOFoundationComponent';
import { Suspense } from 'react';

export default function CostOptimizationCustomModelsPage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewAzureFoundryComponent />
            </Suspense>
        </div>
    )
}