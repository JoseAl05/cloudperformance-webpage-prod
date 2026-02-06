import { MainViewWorkingNonWorkingHoursComponent } from '@/components/gcp/vista-funciones/consumo-horario-habil-no-habil/MainViewWorkingNonWorkingHoursComponent';
import { Suspense } from 'react';

export default function DashboardGcpWorkingNonWorkingComputeEnginesConsumePage() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewWorkingNonWorkingHoursComponent />
            </Suspense>
        </div>
    )
}