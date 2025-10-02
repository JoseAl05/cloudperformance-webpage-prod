import { MainProfileComponent } from '@/components/profile/MainProfileComponent';
import { Suspense } from 'react';

export default function ProfilePage() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainProfileComponent />
            </Suspense>
        </div>
    )
}