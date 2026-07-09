import { MainViewReservationsComponent }  from '@/components/gcp/vista-reservas/MainViewReservationsComponent';
import { Suspense } from 'react';

export default function DashboardGcpReservations() {
    return (
        <div>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewReservationsComponent />
            </Suspense>
        </div>
    )
}