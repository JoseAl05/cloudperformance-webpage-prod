import { MainViewGkeWorkingNonWorkingHoursComponent } from '@/components/gcp/vista-funciones/consumo-horario-habil-no-habil/cluster-gke/MainViewGkeWorkingNonWorkingHoursComponent';
import { Suspense } from 'react';

export default function DashboardGcpWorkingNonWorkingClustersGkeConsumePage() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewGkeWorkingNonWorkingHoursComponent />
            </Suspense>
        </div>
    )
}