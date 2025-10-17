import { MainViewPresupuestoComponent } from '@/components/presupuesto/MainViewPresupuestoComponent';
import { Suspense } from 'react';

export default function DashboardAwsEventsPage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewPresupuestoComponent />
            </Suspense>
        </div>
    )
}