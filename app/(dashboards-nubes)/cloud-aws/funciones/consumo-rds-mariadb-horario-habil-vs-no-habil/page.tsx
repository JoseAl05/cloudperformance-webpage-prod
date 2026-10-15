import { MainViewConsumoRdsHorario } from '@/components/aws/vista-funciones/consumo-horario-habil-vs-no-habil/consumo-rds-horario-habil-vs-no-habil/MainViewConsumoRdsHorarioComponent';
import { Suspense } from 'react';

export default function ConsumoHorarioInstanciasRdsMariadb() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewConsumoRdsHorario dbType='rds-mariadb'/>
            </Suspense>
        </div>
    )
}