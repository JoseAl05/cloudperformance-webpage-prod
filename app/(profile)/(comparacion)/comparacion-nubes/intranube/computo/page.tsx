import { IntraCloudComputeComponent } from '@/components/comp-cloud/intracloud/compute/IntraCloudComputeComponent';
import { Suspense } from 'react';

export default function ComparisonIntraCloudComputePage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <IntraCloudComputeComponent />
            </Suspense>
        </div>
    )
}