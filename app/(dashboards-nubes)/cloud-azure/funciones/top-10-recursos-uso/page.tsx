import { MainViewTop10RecursosUsoComponent } from '@/components/azure/vista-funciones/top-10-recursos-uso/MainViewTop10RecursosUsoComponent';
import { Suspense } from 'react';

export default function IncrementoTopRecursosUso() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewTop10RecursosUsoComponent />
            </Suspense>
        </div>
    )
}