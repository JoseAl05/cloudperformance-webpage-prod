import { MainViewCloudSqlWorkingNonWorkingHoursComponent } from '@/components/gcp/vista-funciones/consumo-horario-habil-no-habil/cloud-sql/MainViewCloudSqlWorkingNonWorkingHoursComponent';
import { Suspense } from 'react';

export default function DashboardGcpWorkingNonWorkingCloudsqlMysqlPage() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewCloudSqlWorkingNonWorkingHoursComponent db_engine='mysql'/>
            </Suspense>
        </div>
    )
}