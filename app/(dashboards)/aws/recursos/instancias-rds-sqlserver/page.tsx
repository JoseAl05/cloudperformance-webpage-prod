import { MainViewInstanciasRdsSQLServerComponent } from '@/components/aws/vista-rds/instancias-rds-sqlserver/MainViewInstanciasRdsSQLServerComponent';
import { Suspense } from 'react';

export default function DashboardInstanciasEc2() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewInstanciasRdsSQLServerComponent />
            </Suspense>
        </div>
    )
}