import { MainViewHeatmapQuotasComponent } from '@/components/gcp/vista-heatmap-quotas/MainViewHeatmapQuotasComponent';
import { Suspense } from 'react';

export default function DashboardGcpHeatmapQuotas() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewHeatmapQuotasComponent />
            </Suspense>
        </div>
    )
}