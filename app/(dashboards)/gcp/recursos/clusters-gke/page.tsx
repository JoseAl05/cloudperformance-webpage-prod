import { MainViewGkeComponent } from '@/components/gcp/vista-recursos/clusters-gke/MainViewGkeComponent';
import { Suspense } from 'react';

export default function DashboardGcpResourceViewClustersGke() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewGkeComponent />
            </Suspense>
        </div>
    )
}