import { MainViewConsume } from '@/components/aws/vista-consumos/MainViewConsume';
import { Suspense } from 'react';

export default function DashboardAwsConsumePage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewConsume />
            </Suspense>
        </div>
    )
}