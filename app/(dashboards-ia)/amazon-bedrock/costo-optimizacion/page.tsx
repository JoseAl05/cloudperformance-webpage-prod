import { MainViewCostOptimizationComponent } from '@/components/amazon-bedrock/costo-optimizacion/MainViewCostOptimizationComponent';
import { Suspense } from 'react';

export default function DashboardAmazonBedrockCostAndOptimizationPage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewCostOptimizationComponent />
            </Suspense>
        </div>
    )
}