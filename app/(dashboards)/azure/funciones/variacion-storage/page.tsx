import { MainViewStorageVariationComponent } from '@/components/azure/vista-funciones/variacion-storage/MainViewStorageVariationComponent';
import { Suspense } from 'react';
export default function DashboardStorageVariation() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewStorageVariationComponent />
            </Suspense>
        </div>
    )
}