import { MainViewAiFinopsMetricsComponent } from '@/components/ai-finops-metrics/MainViewAiFinopsMetricsComponent';
import { Suspense } from 'react';

export default function DashboardAwsFinopsMetrics() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewAiFinopsMetricsComponent cloud='aws'/>
            </Suspense>
        </div>
    )
}