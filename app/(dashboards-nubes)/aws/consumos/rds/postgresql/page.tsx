import { MainViewConsumeRdsComponent } from '@/components/aws/vista-consumos/rds/MainViewConsumeRdsComponent';
import { Suspense } from 'react';

export default function DashboardAwsRdsPgConsumePage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewConsumeRdsComponent
                    rdsType='postgresql'
                />
            </Suspense>
        </div>
    )
}