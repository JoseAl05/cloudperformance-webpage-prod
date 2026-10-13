import { MainViewNatGatewaysConsumeComponent } from '@/components/aws/vista-consumos/nat-gateways/MainViewNatGatewaysConsumeComponent';
import { Suspense } from 'react';

export default function DashboardAwsNatGatewaysConsumePage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewNatGatewaysConsumeComponent />
            </Suspense>
        </div>
    )
}