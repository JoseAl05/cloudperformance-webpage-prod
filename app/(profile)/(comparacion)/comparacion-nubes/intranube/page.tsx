import { IntraCloudSelectionComponent } from '@/components/comp-cloud/intracloud/IntraCloudSelectionComponent';
import { Suspense } from 'react';

export default function ComparissonIntraCloudPage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <IntraCloudSelectionComponent />
            </Suspense>
        </div>
    )
}