import { MainViewUnusedElbV2Component } from '@/components/aws/vista-funciones/unused-elbv2/MainViewUnusedElbV2Component';
import { Suspense } from 'react';

export default function DashboardAwsElbV2Unused() {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <MainViewUnusedElbV2Component />
      </Suspense>
    </div>
  )
}