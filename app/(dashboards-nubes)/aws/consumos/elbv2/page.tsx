import { MainViewElbV2ConsumeComponent } from '@/components/aws/vista-consumos/elbv2/MainViewElbV2ConsumeComponent';
import { Suspense } from 'react';

export default function DashboardAwsLoadbalancersV2ConsumePage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewElbV2ConsumeComponent />
            </Suspense>
        </div>
    )
}