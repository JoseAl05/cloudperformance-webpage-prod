import { MainViewBMPromptOptComponent } from '@/components/amazon-bedrock/prompt-opt/MainViewBMPromptOptComponent';
import { Suspense } from 'react';

export default function DashboardAmazonBedrockPromptOptPage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewBMPromptOptComponent />
            </Suspense>
        </div>
    )
}