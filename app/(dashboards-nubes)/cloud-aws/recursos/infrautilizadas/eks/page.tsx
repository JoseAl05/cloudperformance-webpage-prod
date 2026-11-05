import { MainViewInfrautilizadasEksComponent } from '@/components/aws/vista-recursos/infrautilizadas/eks/MainViewInfrautilizadasEksComponent';
import { Suspense } from 'react';

export default function DashboardInstanciasEc2() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewInfrautilizadasEksComponent />
            </Suspense>
        </div>
    )
}