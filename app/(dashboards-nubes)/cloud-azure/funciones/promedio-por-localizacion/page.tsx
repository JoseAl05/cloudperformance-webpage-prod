import { MainViewAverageByLocationComponent } from '@/components/azure/vista-funciones/average-by-location/MainViewAverageByLocationComponent';
import { Suspense } from 'react';

export default function DashboardAverageByLocation() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewAverageByLocationComponent />
            </Suspense>
        </div>
    )
}