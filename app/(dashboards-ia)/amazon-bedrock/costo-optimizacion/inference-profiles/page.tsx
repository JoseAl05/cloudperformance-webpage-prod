import { MainViewCOInferenceProfilesComponent } from '@/components/amazon-bedrock/costo-optimizacion/inference-profiles/MainViewCOInferenceProfilesComponent';
import { Suspense } from 'react';

export default function CostOptimizationInferenceProfilesPage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewCOInferenceProfilesComponent />
            </Suspense>
        </div>
    )
}