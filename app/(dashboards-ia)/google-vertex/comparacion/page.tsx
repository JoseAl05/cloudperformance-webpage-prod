import { MainViewGcpVertexComparisonComponent } from '@/components/google-vertex/comparacion/MainViewGcpVertexComparisonComponent';
import { Suspense } from 'react';

export default function DashboardGoogleVertexComparisonPage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewGcpVertexComparisonComponent />
            </Suspense>
        </div>
    )
}