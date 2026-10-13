import { MainViewUnusedIgComponent } from '@/components/gcp/vista-recursos/sin-uso/instance-groups/MainViewUnusedIgComponent';
import { Suspense } from 'react';

export default function DashboardGcpUnusedInstanceGroups() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewUnusedIgComponent />
            </Suspense>
        </div>
    )
}