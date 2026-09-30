import { MainViewVXPromptOptComponent } from '@/components/google-vertex/prompt-opt/MainViewVXPromptOptComponent';
import { Suspense } from 'react';

export default function DashboardGoogleVertexAIPromptOptPage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewVXPromptOptComponent />
            </Suspense>
        </div>
    )
}