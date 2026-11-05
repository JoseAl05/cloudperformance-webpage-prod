import { MainViewCloudSqlComponent } from '@/components/gcp/vista-recursos/cloudsql/MainViewCloudSqlComponent';
import { Suspense } from 'react';

export default function DashboardGcpResourceViewCloudsqlMysql() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewCloudSqlComponent db_engine='mysql'/>
            </Suspense>
        </div>
    )
}