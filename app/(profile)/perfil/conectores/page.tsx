import { ConnectorsManagerComponent } from '@/components/profile/ConnectorsManagerComponent';
import { Suspense } from 'react';

export default function ProfileConnectorsPage() {
    
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <ConnectorsManagerComponent />
            </Suspense>
        </div>
    )
}