import { MainViewDeploymentsComponent } from '@/components/azure/vista-deployments/MainViewDeploymentsComponent';
import { Suspense } from 'react';

export default function Deployments() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                < MainViewDeploymentsComponent />
            </Suspense>
        </div>
    )
}
