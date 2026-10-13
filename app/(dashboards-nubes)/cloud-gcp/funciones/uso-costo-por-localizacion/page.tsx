import { MainViewUsedCostLocationComponent } from '@/components/gcp/vista-funciones/uso-costo-por-localizacion/MainViewUsedCostLocationComponent';
import { Suspense } from 'react';

export default function UsoCostoPorLocalizacionPage() {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <MainViewUsedCostLocationComponent />
      </Suspense>
    </div>
  );
}