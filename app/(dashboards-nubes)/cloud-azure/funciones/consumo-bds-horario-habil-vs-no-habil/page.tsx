import { MainViewAzureDbWorkingNonWorkingHoursComponent } from '@/components/azure/vista-funciones/consumo-horario-habil-no-habil/data-bases/MainViewAzureDbWorkingNonWorkingHoursComponent';
import { Suspense } from 'react';

export default function ConsumoHorarioInstanciasDbs() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewAzureDbWorkingNonWorkingHoursComponent />
            </Suspense>
        </div>
    )
    
}