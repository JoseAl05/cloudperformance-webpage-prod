import { Suspense } from 'react';
import { MainViewTagsComponent } from '@/components/vcenter/vista-tags/MainViewTaggedResourcesComponent';

export default function DashboardVCenterTaggedResources() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <MainViewTagsComponent />
        </Suspense>
    );
}
