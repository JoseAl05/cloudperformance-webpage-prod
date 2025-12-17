import { CloudSelectionComponent } from '@/components/comp-cloud/CloudSelectionComponent';
import { Suspense } from 'react';

export default function ComparissonIntraCloudPage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <CloudSelectionComponent />
            </Suspense>
        </div>
    )
}