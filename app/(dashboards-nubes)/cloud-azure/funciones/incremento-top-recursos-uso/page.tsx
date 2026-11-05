import { MainViewIncrementoTopRecursosUsoComponent } from '@/components/azure/vista-funciones/incremento-top-recursos-uso/MainViewIncrementoTopRecursosUsoComponent';
import { Suspense } from 'react';

export default function IncrementoTopRecursosUso() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewIncrementoTopRecursosUsoComponent />
            </Suspense>
        </div>
    )
}