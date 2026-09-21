import { MainViewFMPropmptOptComponent } from '@/components/microsoft-foundry/propmt-opt/MainViewFMPropmptOptComponent';
import { Suspense } from 'react';

export default function DashboardMicrosoftFoundryPromptOptPage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewFMPropmptOptComponent />
            </Suspense>
        </div>
    )
}