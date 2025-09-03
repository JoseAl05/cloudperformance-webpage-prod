import { MainViewInstanciasRdsPgComponent } from '@/components/aws/vista-rds/instancias-rds-pg/MainViewInstanciasRdsPgComponent';
import { Suspense } from 'react';

export default function DashboardInstanciasEc2() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewInstanciasRdsPgComponent />
            </Suspense>
        </div>
    )
}