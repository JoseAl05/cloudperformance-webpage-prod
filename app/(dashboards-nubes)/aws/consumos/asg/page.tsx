import { MainViewConsumeAsgComponent } from '@/components/aws/vista-consumos/ec2/asg/MainViewConsumeAsgComponent';
import { Suspense } from 'react';

export default function DashboardAwsAsgEc2ConsumePage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewConsumeAsgComponent />
            </Suspense>
        </div>
    )
}