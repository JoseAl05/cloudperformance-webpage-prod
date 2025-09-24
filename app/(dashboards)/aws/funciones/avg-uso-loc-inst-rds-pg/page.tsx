import { MainViewInstanciasAVGUsoLocInstRdsPgComponent } from '@/components/aws/vista-prom-loc/avg-uso-loc-inst-rds-pg/MainViewInstanciasAVGUsoLocInstRdsPgComponent';
import { Suspense } from 'react';

export default function PromedioUsoLocInstanciasRdsPostgresql() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewInstanciasAVGUsoLocInstRdsPgComponent />
            </Suspense>
        </div>
    )
}