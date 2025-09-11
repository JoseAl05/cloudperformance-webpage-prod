import { TopDolarInstanciasComponent } from '@/components/aws/vista-funciones/top-dolares-por-tipo-de-instancia/TopDolarInstanciasComponent';
import { Suspense } from 'react';

export default function DashboardAwsTopDolaresInstancias() {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <TopDolarInstanciasComponent />
      </Suspense>
    </div>
  )
}