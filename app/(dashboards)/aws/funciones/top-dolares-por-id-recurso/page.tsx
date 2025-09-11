import { TopDolarRecursoComponent } from '@/components/aws/vista-funciones/top-dolares-por-id-recurso/MainViewTopDolarRecursoComponent';
import { Suspense } from 'react';

export default function DashboardAwsTopDolaresRecurso() {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <TopDolarRecursoComponent />
      </Suspense>
    </div>
  )
}