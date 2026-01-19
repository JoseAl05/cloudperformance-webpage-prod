import { IntraCloudStorageComponent } from '@/components/comp-cloud/intracloud/storage/IntraCloudStorageComponent';
import { Suspense } from 'react';

export default function ComparisonIntraCloudStoragePage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <IntraCloudStorageComponent />
            </Suspense>
        </div>
    )
}