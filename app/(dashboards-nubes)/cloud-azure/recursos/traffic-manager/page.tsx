import { MainViewRecursosTrafficManagerComponent } from '@/components/azure/vista-recursos-tm/MainViewRecursosTrafficManagerComponent';
import { Suspense } from 'react';

export default function TrafficManagerPage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewRecursosTrafficManagerComponent />
            </Suspense>
        </div>
    )
}