import { MainViewConsumeEc2Component } from '@/components/aws/vista-consumos/ec2/MainViewConsumeEc2Component';
import { Suspense } from 'react';

export default function DashboardAwsConsumePage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewConsumeEc2Component />
            </Suspense>
        </div>
    )
}