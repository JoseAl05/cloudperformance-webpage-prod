import { Suspense } from 'react';
import { MainViewConsumoVmComponent } from '@/components/vcenter/vista-consumo-vm/MainViewConsumoVmComponent';

export default function ConsumoVmVcenter() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <MainViewConsumoVmComponent />
        </Suspense>
    );
}
