import { TopRecursosComponent } from '@/components/aws/vista-funciones/top-facturaciones/top-recursos/MainViewTopRecursosComponent';
import { Suspense } from 'react';

export default function DashboardAwsTopRecursos() {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <TopRecursosComponent />
      </Suspense>
    </div>
  )
}