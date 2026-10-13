import { ViewConsumoEC2NodesEKSHorario } from '@/components/aws/vista-funciones/consumo-horario-habil-vs-no-habil/consumo-ec2-nodos-eks-horario-habil-vs-no-habil/MainViewConsumoEC2NodosEKSHorarioComponent';
import { Suspense } from 'react';

export default function DashboardAwsConsumoEC2NodesEKSHorario() {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <ViewConsumoEC2NodesEKSHorario  />
      </Suspense>
    </div>
  )
}