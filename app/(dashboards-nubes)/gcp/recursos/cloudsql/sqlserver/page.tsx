import { MainViewCloudSqlComponent } from '@/components/gcp/vista-recursos/cloudsql/MainViewCloudSqlComponent';
import { Suspense } from 'react';

export default function DashboardGcpResourceViewCloudsqlSqlServer() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewCloudSqlComponent db_engine='sqlserver'/>
            </Suspense>
        </div>
    )
}