import { MainViewPresupuestoMensualComponent} from '@/components/azure/presupuesto/presupuesto-mensual/MainViewPresupuestoMensualComponent';
import { Suspense } from 'react';

export default function DashboardPresupuestoPage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewPresupuestoMensualComponent />
            </Suspense>
        </div>
    )
}