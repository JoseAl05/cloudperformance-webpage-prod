import { MainViewUnusedLoadbalancers } from '@/components/azure/vista-funciones/unused-loadbalancers/MainViewUnusedLoadbalancers';
import { Suspense } from 'react';

export default function LoadbalancersUnused() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewUnusedLoadbalancers />
            </Suspense>
        </div>
    )
}