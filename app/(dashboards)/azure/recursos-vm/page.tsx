import { MainViewRecursosVmComponent } from '@/components/azure/vista-recursos-vm/MainViewRecursosVmComponent';
import { Suspense } from 'react';

export default function DashboardAzureRecursosVm() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewRecursosVmComponent />
            </Suspense>
        </div>
    )
}