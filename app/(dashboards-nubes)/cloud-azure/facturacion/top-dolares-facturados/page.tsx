import { MainViewTopDolaresFacturadosComponent } from '@/components/azure/vista-facturacion/top-dolares-facturados/MainViewTopDolaresFacturadosComponent';
import { Suspense } from 'react';

export default function TopDolaresFacturados() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewTopDolaresFacturadosComponent />
            </Suspense>
        </div>
    )
}