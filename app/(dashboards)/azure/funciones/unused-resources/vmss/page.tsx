import { MainViewUnusedVmssComponent } from '@/components/azure/vista-funciones/unused-resources/vmss/MainViewUnusedVmssComponent';
import { Suspense } from 'react';

export default function DashboardUnusedVmss() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewUnusedVmssComponent />
            </Suspense>
        </div>
    )
}