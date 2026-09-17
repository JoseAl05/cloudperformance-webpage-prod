import { MainViewGcpVertexComponent } from '@/components/google-vertex/costo-optimizacion/vertex-models/MainViewCOGcpVertexComponent';
import { Suspense } from 'react';

export default function CostOptimizationGcpVertexFoundryPage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewGcpVertexComponent />
            </Suspense>
        </div>
    )
}