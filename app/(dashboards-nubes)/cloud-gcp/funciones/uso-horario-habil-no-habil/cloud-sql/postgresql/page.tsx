import { MainViewCloudSqlWorkingNonWorkingHoursComponent } from '@/components/gcp/vista-funciones/consumo-horario-habil-no-habil/cloud-sql/MainViewCloudSqlWorkingNonWorkingHoursComponent';
import { Suspense } from 'react';

export default function DashboardGcpWorkingNonWorkingCloudsqlPostgresPage() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewCloudSqlWorkingNonWorkingHoursComponent db_engine='postgres'/>
            </Suspense>
        </div>
    )
}