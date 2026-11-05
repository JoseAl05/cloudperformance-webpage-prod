import { MainViewRecursosMysqlComponent } from '@/components/azure/vista-recursos-mysql/MainViewRecursosDbsComponent';
import { Suspense } from 'react';

export default function DashboardAzureRecursosMysql() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewRecursosMysqlComponent />
            </Suspense>
        </div>
    )
}