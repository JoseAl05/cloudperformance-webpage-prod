import { MainViewCostoVsPresupuestoGCP } from '@/components/gcp/presupuesto/costo-vs-presupuesto/MainViewCostoVsPresupuestoComponent';
import { Suspense } from 'react';

export default function DashboardPresupuestoPage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewCostoVsPresupuestoGCP />
            </Suspense>
        </div>
    )
}