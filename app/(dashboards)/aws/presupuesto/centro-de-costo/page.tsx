// import { MainViewCentroDeCostoComponent } from '@/components/presupuesto/centro-de-costo/MainViewCentroDeCostoComponent';
import { MainViewCentroDeCostoComponent } from '@/components/aws/presupuesto/centro-de-costo/MainViewCentroDeCostoComponent';
import { Suspense } from 'react';

export default function DashboardPresupuestoCentroDeCostoPage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewCentroDeCostoComponent />
            </Suspense>
        </div>
    )
}