import { ViewConsumoRdsPostgresqlHorario } from '@/components/aws/vista-funciones/consumo-horario-habil-vs-no-habil/consumo-rds-postgresql-horario-habil-vs-no-habil/MainViewConsumoRdsPostgresqlHorarioComponent';
import { Suspense } from 'react';

export default function DashboardAwsRdsPostgresqlHorario() {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <ViewConsumoRdsPostgresqlHorario  />
      </Suspense>
    </div>
  )
}