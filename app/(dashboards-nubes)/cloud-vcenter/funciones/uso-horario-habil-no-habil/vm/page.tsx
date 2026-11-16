import { MainViewVmWorkingNonWorkingHoursComponent } from '@/components/vcenter/vista-funciones/uso-horario-habil-no-habil/vm/MainViewVmWorkingNonWorkingHoursComponent';
import { Suspense } from 'react';

export default function DashboardVcenterVmWorkingNonWorkingHours() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewVmWorkingNonWorkingHoursComponent />
            </Suspense>
        </div>
    )
}
