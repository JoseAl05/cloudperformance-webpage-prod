import { MainViewPresupuestoComponent } from '@/components/azure/presupuesto/MainViewPresupuestoComponent';
import { Suspense } from 'react';

export default function DashboardAwsPresupuestoPage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewPresupuestoComponent />
            </Suspense>
        </div>
    )
}