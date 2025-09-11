import { TopDolarTipoCompraComponent } from '@/components/aws/vista-funciones/top-dolares-por-tipo-de-compra/MainViewTopDolarTipoCompraComponent';
import { Suspense } from 'react';

export default function DashboardAwsTopDolaresTipoCompra() {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <TopDolarTipoCompraComponent />
      </Suspense>
    </div>
  )
}