import { Suspense } from 'react';
import { MainViewUnusedVmExtensionsComponent } from '@/components/azure/vista-funciones/unused-resources/extensions/MainViewUnusedVmExtensionsComponent';

export default function DashboardUnusedVmExtensions() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewUnusedVmExtensionsComponent />
            </Suspense>
        </div>
    )
}