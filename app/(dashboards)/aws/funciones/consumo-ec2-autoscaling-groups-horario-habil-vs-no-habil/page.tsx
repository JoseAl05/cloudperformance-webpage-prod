import { ViewConsumoEC2AutoscalingGroupsHorario } from '@/components/aws/vista-funciones/consumo-ec2-autoscaling-groups-horario-habil-vs-no-habil/MainViewConsumoEC2AsgHorarioComponent';
import { Suspense } from 'react';

export default function DashboardAwsConsumoEC2AutoscalingGroupsHorario() {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <ViewConsumoEC2AutoscalingGroupsHorario  />
      </Suspense>
    </div>
  )
}