import { MainViewRecursosNodeComponent } from '@/components/azure/vista-recursos-nodos/MainViewRecursosNodeComponent';
import { Suspense } from 'react';

export default function DashboardAzureRecursosNode() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewRecursosNodeComponent />
            </Suspense>
        </div>
    )
}