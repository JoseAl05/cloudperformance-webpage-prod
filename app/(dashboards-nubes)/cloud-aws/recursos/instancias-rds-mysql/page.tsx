import { MainViewInstanciasRdsMySQLComponent } from '@/components/aws/vista-rds/instancias-rds-mysql/MainViewInstanciasRdsMySQLComponent';
import { Suspense } from 'react';

export default function DashboardInstanciasEc2() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewInstanciasRdsMySQLComponent />
            </Suspense>
        </div>
    )
}