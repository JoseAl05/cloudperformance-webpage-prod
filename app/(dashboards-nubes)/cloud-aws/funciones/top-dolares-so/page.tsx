import { TopDolarSOComponent } from '@/components/aws/vista-funciones/top-facturaciones/top-dolares-so/TopDolarSOComponent';
import { Suspense } from 'react';

export default function DashboardAwsTopDolaresSO() {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <TopDolarSOComponent />
      </Suspense>
    </div>
  )
}
