import { MainViewCOCustomModelsComponent } from '@/components/amazon-bedrock/costo-optimizacion/custom-models/MainViewCOCustomModelsComponent';
import { Suspense } from 'react';

export default function CostOptimizationCustomModelsPage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewCOCustomModelsComponent />
            </Suspense>
        </div>
    )
}