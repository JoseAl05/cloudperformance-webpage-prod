import { MainViewInstanciasAVGUsoLocInstEC2Component } from '@/components/aws/vista-prom-loc/avg-uso-loc-inst-ec2/MainViewInstanciasAVGUsoLocInstEC2Component';
import { Suspense } from 'react';

export default function PromedioUsoLocInstanciasEc2() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewInstanciasAVGUsoLocInstEC2Component />
            </Suspense>
        </div>
    )
}