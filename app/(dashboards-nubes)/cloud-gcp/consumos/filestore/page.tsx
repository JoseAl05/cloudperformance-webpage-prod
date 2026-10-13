import { MainViewFilestoreConsumeComponent } from '@/components/gcp/vista-consumos/filestore/MainViewFilestoreConsumeComponent';
import { Suspense } from 'react';

export default function DashboardGcpConsumeViewFilestore() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewFilestoreConsumeComponent />
            </Suspense>
        </div>
    )
}