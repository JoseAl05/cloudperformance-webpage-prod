import { MainViewHeatmapQuotasComponent } from '@/components/azure/vista-heatmap-quotas/MainViewHeatmapQuotasComponent';
import { Suspense } from 'react';

export default function DashboardAzureHeatmapQuotas() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewHeatmapQuotasComponent />
            </Suspense>
        </div>
    )
}