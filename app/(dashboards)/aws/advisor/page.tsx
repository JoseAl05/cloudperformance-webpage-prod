import { MainViewAdvisorComponent } from '@/components/aws/vista-advisor/MainViewAdvisorComponent';
import { Suspense } from 'react';

export default function DashboardAwsEventsPage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewAdvisorComponent />
            </Suspense>
        </div>
    )
}