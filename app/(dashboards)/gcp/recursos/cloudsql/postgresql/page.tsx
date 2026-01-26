import { MainViewCloudSqlComponent } from '@/components/gcp/vista-recursos/cloudsql/MainViewCloudSqlComponent';
import { Suspense } from 'react';

export default function DashboardGcpResourceViewCloudsqlPostgres() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewCloudSqlComponent db_engine='postgres'/>
            </Suspense>
        </div>
    )
}