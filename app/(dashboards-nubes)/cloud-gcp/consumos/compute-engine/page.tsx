import { MainViewComputeEngineConsumeComponent } from '@/components/gcp/vista-consumos/compute-engine/MainViewComputeEngineConsumeComponent';
import { Suspense } from 'react';

export default function DashboardGcpConsumeViewComputeEngine() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewComputeEngineConsumeComponent />
            </Suspense>
        </div>
    )
}