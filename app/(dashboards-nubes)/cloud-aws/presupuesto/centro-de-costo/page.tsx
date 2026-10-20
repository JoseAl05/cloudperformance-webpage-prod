import { MainViewCentroDeCostoComponent } from '@/components/aws/presupuesto-v2/centro-de-costo/MainViewCentroDeCostoComponent';
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