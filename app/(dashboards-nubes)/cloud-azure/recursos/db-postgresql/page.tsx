import { MainViewRecursosPostgresComponent } from '@/components/azure/vista-recursos-postgresql/MainViewRecursosDbsComponent';
import { Suspense } from 'react';

export default function DashboardAzureRecursosPostgresql() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewRecursosPostgresComponent />
            </Suspense>
        </div>
    )
}