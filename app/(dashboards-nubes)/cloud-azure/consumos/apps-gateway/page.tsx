import { MainViewConsumoAppGwComponent } from '@/components/azure/vista-consumo-apps-gateway/MainViewConsumoAppGwComponent';
import { Suspense } from 'react';

export default function ConsumoVm() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewConsumoAppGwComponent />
            </Suspense>
        </div>
    )
}
