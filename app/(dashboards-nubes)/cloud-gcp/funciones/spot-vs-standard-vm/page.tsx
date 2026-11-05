import { MainViewSpotVsStandardComponent } from '@/components/gcp/vista-funciones/spot-vs-standard/MainViewSpotVsStandardComponent';
import { Suspense } from 'react';

export default function SpotVsStandardPage() {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <MainViewSpotVsStandardComponent />
      </Suspense>
    </div>
  );
}