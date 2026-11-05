import { MainViewInstanciasRdsOracleComponent } from '@/components/aws/vista-rds/instancias-rds-oracle/MainViewInstanciasRdsOracleComponent';
import { Suspense } from 'react';

export default function DashboardInstanciasEc2() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewInstanciasRdsOracleComponent />
            </Suspense>
        </div>
    )
}