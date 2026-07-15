import { MainViewCOFoundationComponent } from '@/components/amazon-bedrock/costo-optimizacion/foundation-models/MainViewCOFoundationComponent';
import { Suspense } from 'react';

export default function CostOptimizationCustomModelsPage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewCOFoundationComponent />
            </Suspense>
        </div>
    )
}