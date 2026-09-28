import { MainViewFMPromptOptComponent } from '@/components/microsoft-foundry/prompt-opt/MainViewFMPromptOptComponent';
import { Suspense } from 'react';

export default function DashboardMicrosoftFoundryPromptOptPage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewFMPromptOptComponent />
            </Suspense>
        </div>
    )
}