import { MainViewAiFinopsMetricsComponent } from '@/components/ai-finops-metrics/MainViewAiFinopsMetricsComponent';
import { Suspense } from 'react';

export default function DashboardGcpFinopsMetrics() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewAiFinopsMetricsComponent cloud='gcp'/>
            </Suspense>
        </div>
    )
}