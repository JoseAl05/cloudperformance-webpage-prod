import { MainViewSpotVsRegularVmComponent } from '@/components/azure/vista-funciones/spot-vs-regular-vm/MainViewSpotVsRegularVmComponent';
import { Suspense } from 'react';
export default function DashboardSpotVsRegularVm() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewSpotVsRegularVmComponent />
            </Suspense>
        </div>
    )
}