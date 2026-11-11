import { Suspense } from 'react';
import { MainViewTendenciaFacturacionComponent } from '@/components/vcenter/vista-facturacion/tendencia-facturacion/MainViewTendenciaFacturacionComponent';

export default function DashboardTendenciaFacturacionVcenter() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <MainViewTendenciaFacturacionComponent />
        </Suspense>
    );
}
