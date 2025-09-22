import { ViewConsumoRdsSqlHorario } from '@/components/aws/vista-funciones/consumo-rds-sql-horario-habil-vs-no-habil/MainViewConsumoRdsSqlHorarioComponent';
import { Suspense } from 'react';

export default function DashboardAwsRdsSqlHorario() {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <ViewConsumoRdsSqlHorario />
      </Suspense>
    </div>
  )
}