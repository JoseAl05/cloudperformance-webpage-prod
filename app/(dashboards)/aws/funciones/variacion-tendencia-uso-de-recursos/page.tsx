import { ViewVariacionTendenciaUsoDeRecursos  } from '@/components/aws/vista-funciones/variacion-tendencia-uso-de-recursos/MainViewVariacionTendenciaUsoDeRecursosComponent';
import { Suspense } from 'react';

export default function VariacionTendenciaUsoDeRecursos() {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <ViewVariacionTendenciaUsoDeRecursos  />
      </Suspense>
    </div>
  )
}