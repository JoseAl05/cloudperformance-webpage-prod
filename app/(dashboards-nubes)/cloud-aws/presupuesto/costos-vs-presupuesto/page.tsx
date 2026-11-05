import { MainViewCostoVsPresupuestoAws } from '@/components/aws/presupuesto-v2/costo-vs-presupuesto/MainViewCostoVsPresupuestoComponent';
import { Suspense } from 'react';

export default function DashboardPresupuestoPage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewCostoVsPresupuestoAws />
            </Suspense>
        </div>
    )
}