import { MainViewConsumoNodosComponent } from '@/components/azure/vista-consumo-nodos/MainViewConsumoNodosComponent';
import { Hourglass } from 'lucide-react';
import { Suspense } from 'react';

export default function ConsumoNodos() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                < MainViewConsumoNodosComponent />
            </Suspense>
        </div>
    )
}
