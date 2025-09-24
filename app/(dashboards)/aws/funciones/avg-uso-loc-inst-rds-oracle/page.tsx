import { MainViewInstanciasAVGUsoLocInstRdsOracleComponent } from '@/components/aws/vista-prom-loc/avg-uso-loc-inst-rds-oracle/MainViewInstanciasAVGUsoLocInstRdsOracleComponent';
import { Suspense } from 'react';

export default function PromedioUsoLocInstanciasRdsOracle() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewInstanciasAVGUsoLocInstRdsOracleComponent />
            </Suspense>
        </div>
    )
}