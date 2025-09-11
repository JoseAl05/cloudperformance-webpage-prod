import { TopDolarFamiliaComponent } from '@/components/aws/vista-funciones/top-dolares-por-famila-de-instancias/MainViewTopDolarFamiliaComponent';
import { Suspense } from 'react';

export default function DashboardAwsTopDolaresFamilia() {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        < TopDolarFamiliaComponent />
      </Suspense>
    </div>
  )
}