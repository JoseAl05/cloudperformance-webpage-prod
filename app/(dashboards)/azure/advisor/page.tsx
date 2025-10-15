import { MainViewAdvisorComponent } from '@/components/azure/vista-advisor/MainViewAdvisorComponent';
import { Suspense } from 'react';

export default function DashboardAzureEventsPage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewAdvisorComponent />
            </Suspense>
        </div>
    )
}