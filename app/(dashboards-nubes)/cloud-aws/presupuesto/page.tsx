import { MainViewPresupuestoComponent } from '@/components/aws/presupuesto-v2/MainViewPresupuestoComponent';
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