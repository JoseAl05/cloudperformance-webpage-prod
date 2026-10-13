import { MainViewAnalisisVMsHorarioComponent } from '@/components/azure/vista-funciones/consumo-horario-habil-no-habil/virtual-machines/MainViewAnalisisVMsHorarioComponent';
import { Suspense } from 'react';

export default function AnalisisVMsHorario() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewAnalisisVMsHorarioComponent />
            </Suspense>
        </div>
    )
}