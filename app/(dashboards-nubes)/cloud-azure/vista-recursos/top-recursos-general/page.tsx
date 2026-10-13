import { MainViewTopRecursosGeneralComponent } from '@/components/azure/vista-recursos/top-recursos-general/MainViewTopRecursosGeneralComponent';
import { Suspense } from 'react';

export default function TopRecursosGeneral() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewTopRecursosGeneralComponent />
            </Suspense>
        </div>
    )
}

