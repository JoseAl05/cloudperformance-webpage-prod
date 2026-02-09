import { MainViewCloudSqlWorkingNonWorkingHoursComponent } from '@/components/gcp/vista-funciones/consumo-horario-habil-no-habil/cloud-sql/MainViewCloudSqlWorkingNonWorkingHoursComponent';
import { Suspense } from 'react';

export default function DashboardGcpWorkingNonWorkingCloudsqlSqlServerPage() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewCloudSqlWorkingNonWorkingHoursComponent db_engine='sqlserver'/>
            </Suspense>
        </div>
    )
}