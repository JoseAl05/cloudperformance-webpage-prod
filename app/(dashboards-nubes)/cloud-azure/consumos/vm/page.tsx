import { MainViewConsumoVmComponent } from '@/components/azure/vista-consumo-vm/MainViewConsumoVmComponent';
import { Suspense } from 'react';

export default function ConsumoVm() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                < MainViewConsumoVmComponent />
            </Suspense>
        </div>
    )
}
