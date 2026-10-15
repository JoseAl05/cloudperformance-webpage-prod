import { MainViewUnusedTrafficManagerComponent } from '@/components/azure/vista-funciones/unused-traffic-managers/MainViewUnusedTrafficManagerComponent';
import { Suspense } from 'react';

export default function TrafficManagerUnused() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewUnusedTrafficManagerComponent />
            </Suspense>
        </div>
    )
}