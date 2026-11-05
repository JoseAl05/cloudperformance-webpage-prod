import { MainViewInstanciasAutoscalingGroupsComponent } from '@/components/aws/vista-autoscaling/autoscaling-groups/MainViewInstanciasAutoscalingGroupsComponent';
import { Suspense } from 'react';

export default function DashboardInstanciasEc2() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewInstanciasAutoscalingGroupsComponent />
            </Suspense>
        </div>
    )
}
