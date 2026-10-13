import { MainViewAiFinopsMetricsComponent } from '@/components/ai-finops-metrics/MainViewAiFinopsMetricsComponent';
import { Suspense } from 'react';

export default function DashboardAzureFinopsMetrics() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewAiFinopsMetricsComponent cloud='azure'/>
            </Suspense>
        </div>
    )
}