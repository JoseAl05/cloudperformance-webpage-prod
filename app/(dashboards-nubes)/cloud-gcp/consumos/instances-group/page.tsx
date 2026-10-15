import { MainViewInstanceGroupConsumeComponent } from '@/components/gcp/vista-consumos/instance-groups/MainViewInstanceGroupConsumeComponent';
import { Suspense } from 'react';

export default function DashboardGcpConsumeViewInstancesGroup() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewInstanceGroupConsumeComponent />
            </Suspense>
        </div>
    )
}