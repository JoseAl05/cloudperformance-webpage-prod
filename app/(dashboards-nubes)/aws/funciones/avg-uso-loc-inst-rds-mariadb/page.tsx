import { MainViewInstanciasAVGUsoLocInstRdsMariaDBComponent } from '@/components/aws/vista-prom-loc/avg-uso-loc-inst-rds-mariadb/MainViewInstanciasAVGUsoLocInstRdsMariaDBComponent';
import { Suspense } from 'react';

export default function PromedioUsoLocInstanciasRdsMariaDb() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewInstanciasAVGUsoLocInstRdsMariaDBComponent />
            </Suspense>
        </div>
    )
}