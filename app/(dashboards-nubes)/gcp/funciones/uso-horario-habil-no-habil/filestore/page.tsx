import { MainViewFilestoreWorkingHoursComponent } from '@/components/gcp/vista-funciones/consumo-horario-habil-no-habil/filestore/MainViewFilestoreWorkingHoursComponent';
import { Suspense } from 'react';

export default function DashboardGcpWorkingNonWorkingFilestoreConsumePage() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewFilestoreWorkingHoursComponent />
            </Suspense>
        </div>
    )
}