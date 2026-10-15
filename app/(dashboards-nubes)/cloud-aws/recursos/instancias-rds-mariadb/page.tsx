import { MainViewInstanciasRdsMariaDBComponent } from '@/components/aws/vista-rds/instancias-rds-mariadb/MainViewInstanciasRdsMariaDBComponent';
import { Suspense } from 'react';

export default function DashboardInstanciasEc2() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewInstanciasRdsMariaDBComponent />
            </Suspense>
        </div>
    )
}