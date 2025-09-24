import { MainViewInstanciasAVGUsoLocInstRdsSQLServerComponent } from '@/components/aws/vista-prom-loc/avg-uso-loc-inst-rds-sqlserver/MainViewInstanciasAVGUsoLocInstRdsSQLServerComponent';
import { Suspense } from 'react';

export default function PromedioUsoLocInstanciasRdsSqlServer() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewInstanciasAVGUsoLocInstRdsSQLServerComponent />
            </Suspense>
        </div>
    )
}