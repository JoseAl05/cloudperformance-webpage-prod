import { SelectAIServiceComponent } from '@/components/profile/SelectAIServiceComponent';
import { Suspense } from 'react';

export default function ProfileAIServicesPage() {
    
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <SelectAIServiceComponent />
            </Suspense>
        </div>
    )
}