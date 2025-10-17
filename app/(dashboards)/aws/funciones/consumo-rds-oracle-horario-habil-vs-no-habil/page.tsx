import { ViewConsumoRdsOracleHorario } from '@/components/aws/vista-funciones/consumo-horario-habil-vs-no-habil/consumo-rds-oracle-horario-habil-vs-no-habil/MainViewConsumoRdsOracleHorarioComponent';
import { Suspense } from 'react';

export default function DashboardAwsRdsOracleHorario() {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <ViewConsumoRdsOracleHorario  />
      </Suspense>
    </div>
  )
}