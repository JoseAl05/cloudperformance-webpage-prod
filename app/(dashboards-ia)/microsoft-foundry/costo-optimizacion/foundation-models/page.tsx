import { MainViewAzureFoundryComponent } from '@/components/microsoft-foundry/costo-optimizacion/foundation-models/MainViewCOAzureFoundryComponent';
import { Suspense } from 'react';

export default function CostOptimizationAzureFoundryPage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewAzureFoundryComponent />
            </Suspense>
        </div>
    )
}