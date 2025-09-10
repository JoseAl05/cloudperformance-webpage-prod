import { MainViewConsumeEksComponent } from '@/components/aws/vista-consumos/ec2/eks/MainViewConsumeEksComponent';
import { Suspense } from 'react';

export default function DashboardAwsEc2ConsumePage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewConsumeEksComponent />
            </Suspense>
        </div>
    )
}