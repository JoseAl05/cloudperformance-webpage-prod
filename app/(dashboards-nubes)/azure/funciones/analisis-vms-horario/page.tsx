import { MainViewAnalisisVMsHorarioComponent } from '@/components/azure/vista-funciones/analisis-vms-horario/MainViewAnalisisVMsHorarioComponent';
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