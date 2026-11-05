import { MainViewPresupuestoComponent } from '@/components/azure/presupuesto-v2/MainViewPresupuestoComponent';
import { Suspense } from 'react';

export default function DashboardAzureEventsPage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewPresupuestoComponent />
            </Suspense>
        </div>
    )
}