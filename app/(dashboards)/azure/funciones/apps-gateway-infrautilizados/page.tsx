import { MainViewUnusedAppsGw } from '@/components/azure/vista-funciones/unused-apps-gateway/MainViewUnusedAppsGw';
import { Suspense } from 'react';

export default function IncrementoTopRecursosUso() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewUnusedAppsGw />
            </Suspense>
        </div>
    )
}