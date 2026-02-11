import { MainViewCloudSQLComponent } from '@/components/gcp/vista-consumos/cloud-sql/MainViewCloudSQLComponent';
import { Suspense } from 'react';

export default function CloudSQLConsumptionPage() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewCloudSQLComponent />
            </Suspense>
        </div>
    );
}