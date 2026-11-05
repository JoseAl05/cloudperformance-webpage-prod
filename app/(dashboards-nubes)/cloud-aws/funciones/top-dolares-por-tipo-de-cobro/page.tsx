import { TopDolarTipoCobroComponent } from '@/components/aws/vista-funciones/top-facturaciones/top-dolares-por-tipo-de-cobro/MainViewTopDolarTipoCobroComponent';
import { Suspense } from 'react';

export default function DashboardAwsTopDolaresTipoCobro() {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <TopDolarTipoCobroComponent />
      </Suspense>
    </div>
  )
}