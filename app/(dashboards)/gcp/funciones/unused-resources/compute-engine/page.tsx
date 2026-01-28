import { MainViewUnusedCeComponent } from '@/components/gcp/vista-recursos/sin-uso/compute-engine/MainViewUnusedCeComponent';
import { Suspense } from 'react';

export default function DashboardGcpUnusedComputeEngine() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewUnusedCeComponent />
            </Suspense>
        </div>
    )
}