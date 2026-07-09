import { MainViewUnusedVmComponent } from '@/components/azure/vista-funciones/unused-resources/vm/MainViewUnusedVmComponent';
import { Suspense } from 'react';

export default function DashboardUnusedVm() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewUnusedVmComponent />
            </Suspense>
        </div>
    )
}