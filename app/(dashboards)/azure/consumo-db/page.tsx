import { MainViewConsumoDbComponent } from '@/components/azure/vista-consumo-db/MainViewConsumoDbComponent';
import { Hourglass } from 'lucide-react';
import { Suspense } from 'react';

export default function ConsumoDb() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                < MainViewConsumoDbComponent />
            </Suspense>
        </div>
    )
}
