import { MainViewUnusedEc2Component } from '@/components/aws/vista-funciones/unused-ec2/MainViewUnusedEc2Component';
import { Suspense } from 'react';

export default function DashboardAwsEc2Unused() {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <MainViewUnusedEc2Component />
      </Suspense>
    </div>
  )
}