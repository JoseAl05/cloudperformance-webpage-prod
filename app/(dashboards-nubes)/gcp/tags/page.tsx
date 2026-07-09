import { MainViewTagsComponent } from '@/components/gcp/vista-tags/MainViewTaggedResourcesComponent';
import { Suspense } from 'react';

export default function DashboardGcpTaggedResources() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewTagsComponent />
            </Suspense>
        </div>
    )
}