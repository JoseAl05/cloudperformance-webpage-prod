import { MainViewBlobVsStorageComponent } from '@/components/azure/vista-funciones/blob-vs-storage-general/MainViewBlobVsStorageComponent';
import { Suspense } from 'react';
export default function DashboardBlobVsStorage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewBlobVsStorageComponent />
            </Suspense>
        </div>
    )
}