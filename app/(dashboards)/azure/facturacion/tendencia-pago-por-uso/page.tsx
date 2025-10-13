import { MainViewTendenciaPagoPorUsoComponent } from '@/components/azure/vista-facturacion/tendencia-pago-por-uso/MainViewTendenciaPagoPorUsoComponent';
import { Hourglass } from 'lucide-react';
import { Suspense } from 'react';

export default function TendenciaPagoPorUso() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewTendenciaPagoPorUsoComponent />
            </Suspense>
        </div>
    )
}
