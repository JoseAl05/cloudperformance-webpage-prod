
import { InterCloudSelectionComponent } from '@/components/comp-cloud/intercloud/InterCloudSelectionComponent';
import { Suspense } from 'react';

export default function ComparissonInterCloudPage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <InterCloudSelectionComponent />
            </Suspense>
        </div>
    )
}
