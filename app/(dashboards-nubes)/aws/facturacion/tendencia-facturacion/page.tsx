import { MainViewTendenciaFacturacionComponent } from '@/components/aws/vista-facturacion/tendencia-facturacion/MainViewTendenciaFacturacionComponent';
import { Suspense } from 'react';
export default function DashboardTendenciaFacturacion() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewTendenciaFacturacionComponent />
            </Suspense>
        </div>
    )
}