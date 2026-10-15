import { MainViewHeatmapQuotasComponent } from '@/components/aws/vista-heatmap-quotas/MainViewHeatmapQuotasComponent';
import { Suspense } from 'react';

export default function DashboardAwsHeatmapQuotas() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewHeatmapQuotasComponent />
            </Suspense>
        </div>
    )
}