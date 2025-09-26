import { Verify2FaComponent } from '@/components/auth/Verify2FaComponent';
import { Suspense } from 'react';


export default function Verify2FAPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <Verify2FaComponent />
        </Suspense>
    );
}