import { MainViewComputeEngineComponent } from '@/components/gcp/vista-recursos/compute-engine/MainViewComputeEngineComponent';
import { Suspense } from 'react';

export default function DashboardGcpResourceViewComputeEngine() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewComputeEngineComponent />
            </Suspense>
        </div>
    )
}