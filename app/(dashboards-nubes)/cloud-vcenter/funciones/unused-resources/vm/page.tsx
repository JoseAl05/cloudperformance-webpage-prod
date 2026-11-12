import { MainViewUnusedVmComponent } from '@/components/vcenter/vista-funciones/unused-resources/vm/MainViewUnusedVmComponent';
import { Suspense } from 'react';

export default function DashboardVcenterUnusedVm() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewUnusedVmComponent />
            </Suspense>
        </div>
    )
}
