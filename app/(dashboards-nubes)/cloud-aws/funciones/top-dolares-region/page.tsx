import { TopDolarRegionComponent } from '@/components/aws/vista-funciones/top-facturaciones/top-dolares-region/TopDolarRegionComponent';
import { Suspense } from 'react';

export default function DashboardAwsTopDolaresRegion() {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <TopDolarRegionComponent />
      </Suspense>
    </div>
  )
}