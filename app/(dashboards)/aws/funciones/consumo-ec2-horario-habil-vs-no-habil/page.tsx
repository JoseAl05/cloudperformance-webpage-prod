import { ViewConsumoEC2Horario } from '@/components/aws/vista-funciones/consumo-ec2-horario-habil-vs-no-habil/MainViewConsumoEC2HorarioComponent';
import { Suspense } from 'react';

export default function DashboardAwsConsumoEC2Horario() {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <ViewConsumoEC2Horario  />
      </Suspense>
    </div>
  )
}