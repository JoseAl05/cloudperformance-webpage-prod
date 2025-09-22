import { ViewConsumoRdsMysqlHorario } from '@/components/aws/vista-funciones/consumo-rds-mysql-horario-habil-vs-no-habil/MainViewConsumoRdsMysqlHorarioComponent';
import { Suspense } from 'react';

export default function DashboardAwsRdsMysqlHorario() {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <ViewConsumoRdsMysqlHorario  />
      </Suspense>
    </div>
  )
}