import { MainViewIgWorkingNonWorkingHoursComponent } from '@/components/gcp/vista-funciones/consumo-horario-habil-no-habil/instance-group/MainViewIgWorkingNonWorkingHoursComponent';
import { Suspense } from 'react';

export default function DashboardGcpWorkingNonWorkingInstancesGroupConsumePage() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewIgWorkingNonWorkingHoursComponent />
            </Suspense>
        </div>
    )
}