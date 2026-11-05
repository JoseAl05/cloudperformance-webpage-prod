import { MainViewInstancesEc2Component } from '@/components/aws/vista-ec2/instancias-ec2/MainViewInstancesEc2Component';
import { Suspense } from 'react';

export default function DashboardInstanciasEc2() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewInstancesEc2Component />
            </Suspense>
        </div>
    )
}