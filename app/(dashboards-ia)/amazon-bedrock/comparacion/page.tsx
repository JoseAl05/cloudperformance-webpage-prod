import { MainViewBMComparisonComponent } from '@/components/amazon-bedrock/comparacion/MainViewBMComparisonComponent';
import { Suspense } from 'react';

export default function DashboardAmazonBedrockComparisonPage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewBMComparisonComponent />
            </Suspense>
        </div>
    )
}
