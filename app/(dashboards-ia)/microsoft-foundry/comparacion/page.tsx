import { MainViewComparisonComponent } from '@/components/microsoft-foundry/comparacion/MainViewAFComparisonComponent';
import { Suspense } from 'react';

export default function DashboardMicrosoftFoundryComparisonPage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewComparisonComponent />
            </Suspense>
        </div>
    )
}