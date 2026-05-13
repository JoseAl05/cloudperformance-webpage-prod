
import { MainViewMultiTenantComponent  } from '@/components/comp-cloud/multicloud/MainViewMultiCloudComponent';
import { Suspense } from 'react';

export default function ComparissonMultiCloudPage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                < MainViewMultiTenantComponent />
            </Suspense>
        </div>
    )
}
