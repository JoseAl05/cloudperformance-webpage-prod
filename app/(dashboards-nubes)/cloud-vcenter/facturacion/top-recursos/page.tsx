import { Suspense } from 'react';
import { MainViewTopFacturacionRecursosComponent } from '@/components/vcenter/vista-facturacion/top-recursos/MainViewTopFacturacionRecursosComponent';

export default function TopFacturacionRecursosVcenterPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <MainViewTopFacturacionRecursosComponent />
        </Suspense>
    );
}
