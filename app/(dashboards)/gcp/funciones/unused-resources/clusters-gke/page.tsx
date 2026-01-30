import { MainViewUnusedGkeComponent } from '@/components/gcp/vista-recursos/sin-uso/clusters-gke/MainViewUnusedGkeComponent';
import { Suspense } from 'react';

export default function DashboardGcpUnusedClustersGke() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewUnusedGkeComponent />
            </Suspense>
        </div>
    )
}