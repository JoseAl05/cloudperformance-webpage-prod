
import { MainViewUnusedRoute53Component } from '@/components/aws/vista-funciones/unused-r53/MainViewUnusedRoute53Component';
import { Suspense } from 'react';

export default function DashboardAwsRoutes53Unused() {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <MainViewUnusedRoute53Component />
      </Suspense>
    </div>
  )
}