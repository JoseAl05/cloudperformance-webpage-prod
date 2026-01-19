import { MainViewIntraCloudBillingComponent } from '@/components/comp-cloud/intracloud/billing/MainViewIntraCloudBillingComponent';
import { Suspense } from 'react';

export default function ComparisonIntraCloudBillingPage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewIntraCloudBillingComponent />
            </Suspense>
        </div>
    )
}