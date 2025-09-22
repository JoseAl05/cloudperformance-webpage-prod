import { ViewConsumoRdsMariaDbHorario } from '@/components/aws/vista-funciones/consumo-rds-mariadb-horario-habil-vs-no-habil/MainViewConsumoRdsMariaDbHorarioComponent';
import { Suspense } from 'react';

export default function DashboardAwsRdsMariaDbHorario() {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <ViewConsumoRdsMariaDbHorario />
      </Suspense>
    </div>
  )
}