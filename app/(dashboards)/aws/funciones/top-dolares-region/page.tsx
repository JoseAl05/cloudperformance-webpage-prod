import { MainViewTopDolaresRegionComponent } from '@/components/aws/vista-funciones/top-dolares-region/MainViewTopDolaresRegionComponent';
import { Suspense } from 'react';

export default function DashboardAwsTopDolaresRegion() {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <MainViewTopDolaresRegionComponent />
      </Suspense>
    </div>
  )
}