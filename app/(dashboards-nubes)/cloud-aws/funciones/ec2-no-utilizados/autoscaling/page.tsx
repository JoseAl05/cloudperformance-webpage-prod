import { MainViewUnusedAutoscalingComponent } from '@/components/aws/vista-funciones/unused-ec2/MainViewUnusedAutoscalingComponent';
import { Suspense } from 'react';

export default function DashboardAwsAutoscalingEc2Unused() {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <MainViewUnusedAutoscalingComponent />
      </Suspense>
    </div>
  )
}