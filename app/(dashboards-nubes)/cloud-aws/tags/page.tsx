import { MainViewTagsComponent } from '@/components/aws/vista-tags/MainViewTaggedResourcesComponent';
import { Suspense } from 'react';

export default function DashboardAWSTaggedResources() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewTagsComponent />
            </Suspense>
        </div>
    )
}