import { MainViewAzureNodosWorkingNonWorkingHoursComponent } from '@/components/azure/vista-funciones/consumo-horario-habil-no-habil/nodes/MainViewAzureNodosWorkingNonWorkingHoursComponent';
import { Suspense } from 'react';

export default function ConsumoHorarioNodos() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewAzureNodosWorkingNonWorkingHoursComponent />
            </Suspense>
        </div>
    )
    
}