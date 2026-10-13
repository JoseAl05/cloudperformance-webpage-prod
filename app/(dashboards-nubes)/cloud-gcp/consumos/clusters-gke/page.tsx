import { MainViewClusterGkeConsumeComponent } from '@/components/gcp/vista-consumos/clusters-gke/MainViewClusterGkeConsumeComponent';
import { Suspense } from 'react';

export default function DashboardGcpConsumeViewClustersGke() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewClusterGkeConsumeComponent />
            </Suspense>
        </div>
    )
}