import { MainViewCostOptimizationGcpVertexComponent } from '@/components/google-vertex/costo-optimizacion/MainViewCostOptimizationGcpVertexComponent';
import { Suspense } from 'react';

export default function DashboardGoogleVertexCostAndOptimizationPage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewCostOptimizationGcpVertexComponent />
            </Suspense>
        </div>
    )
}