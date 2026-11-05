import { MainViewEventsComponent } from '@/components/aws/vista-eventos/MainViewEventsComponent';
import { Suspense } from 'react';

export default function DashboardAwsEventsPage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewEventsComponent />
            </Suspense>
        </div>
    )
}