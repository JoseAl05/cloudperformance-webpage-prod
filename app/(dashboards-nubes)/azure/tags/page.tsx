import { MainViewTagsComponent } from '@/components/azure/vista-tags/MainViewTaggedResourcesComponent';
import { Suspense } from 'react';

export default function DashboardAzureTaggedResources() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewTagsComponent />
            </Suspense>
        </div>
    )
}