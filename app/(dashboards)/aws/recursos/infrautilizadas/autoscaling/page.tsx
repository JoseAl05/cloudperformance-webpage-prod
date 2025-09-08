import { MainViewInfrautilizadasComponent } from '@/components/aws/vista-recursos/infrautilizadas/autoscaling/MainViewInfrautilizadasComponent';
import { Suspense } from 'react';

export default function DashboardInstanciasEc2() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewInfrautilizadasComponent />
            </Suspense>
        </div>
    )
}