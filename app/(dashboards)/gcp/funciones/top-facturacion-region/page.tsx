import { TopFacturacionPorRegionComponent } from '@/components/gcp/vista-funciones/top-facturacion-region/TopFacturacionPorRegionComponent';
import { Suspense } from 'react';

export default function DashboardGCPTopFacturacionRegion() {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <TopFacturacionPorRegionComponent />
      </Suspense>
    </div>
  )
}