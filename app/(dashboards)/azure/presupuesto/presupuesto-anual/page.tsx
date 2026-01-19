import { MainViewPresupuestoAnualComponent } from '@/components/azure/presupuesto/presupuesto-anual/MainViewPresupuestoAnualComponent';
import { Suspense } from 'react';

export default function DashboardPresupuestoPage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewPresupuestoAnualComponent />
            </Suspense>
        </div>
    )
}