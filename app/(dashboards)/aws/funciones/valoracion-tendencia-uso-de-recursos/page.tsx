import { ViewValoracionTendenciaUsoDeRecursos  } from '@/components/aws/vista-funciones/valoracion-tendencia-uso-de-recursos/MainViewValoracionTendenciaUsoDeRecursosComponent';
import { Suspense } from 'react';

export default function DashboardAwsTopS3Buckets() {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <ViewValoracionTendenciaUsoDeRecursos  />
      </Suspense>
    </div>
  )
}