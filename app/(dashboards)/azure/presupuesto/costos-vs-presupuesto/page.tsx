import { MainViewCostoVsPresupuestoComponent } from '@/components/presupuesto/costo-vs-presupuesto/MainViewCostoVsPresupuestoComponent';
import { Suspense } from 'react';

export default function DashboardPresupuestoPage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewCostoVsPresupuestoComponent />
            </Suspense>
        </div>
    )
}