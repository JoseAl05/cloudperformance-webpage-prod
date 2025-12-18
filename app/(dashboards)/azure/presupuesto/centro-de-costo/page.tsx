// import { MainViewCentroDeCostoComponent } from '@/components/presupuesto/centro-de-costo/MainViewCentroDeCostoComponent';
import { MainViewCentroDeCostoComponent } from '@/components/azure/presupuesto/centro-de-costo/MainViewCentroDeCostoComponent';
import { Suspense } from 'react';

export default function DashboardPresupuestoPage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewCentroDeCostoComponent />
            </Suspense>
        </div>
    )
}