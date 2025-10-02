import { SelectCloudComponent } from '@/components/profile/SelectCloudComponent';
import { Suspense } from 'react';

export default function ProfileCloudsPage() {
    
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <SelectCloudComponent />
            </Suspense>
        </div>
    )
}