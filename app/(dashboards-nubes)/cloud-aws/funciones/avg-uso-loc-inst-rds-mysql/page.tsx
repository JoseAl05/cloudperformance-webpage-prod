import { MainViewInstanciasAVGUsoLocInstRdsMySQLComponent } from '@/components/aws/vista-prom-loc/avg-uso-loc-inst-rds-mysql/MainViewInstanciasAVGUsoLocInstRdsMySQLComponent';
import { Suspense } from 'react';

export default function PromedioUsoLocInstanciasRdsMysql() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewInstanciasAVGUsoLocInstRdsMySQLComponent />
            </Suspense>
        </div>
    )
}