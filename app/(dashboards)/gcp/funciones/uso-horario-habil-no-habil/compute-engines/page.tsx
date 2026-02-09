import { MainViewCeWorkingNonWorkingHoursComponent } from '@/components/gcp/vista-funciones/consumo-horario-habil-no-habil/compute-engine/MainViewCeWorkingNonWorkingHoursComponent';
import { Suspense } from 'react';

export default function DashboardGcpWorkingNonWorkingComputeEnginesConsumePage() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewCeWorkingNonWorkingHoursComponent />
            </Suspense>
        </div>
    )
}