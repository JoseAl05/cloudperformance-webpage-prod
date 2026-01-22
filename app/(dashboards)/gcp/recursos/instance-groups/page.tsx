import { MainViewInstanceGroupsComponent } from '@/components/gcp/vista-recursos/instance-groups/MainViewInstanceGroupsComponent';
import { Suspense } from 'react';

export default function DashboardGcpResourceViewInstanceGroups() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewInstanceGroupsComponent />
            </Suspense>
        </div>
    )
}