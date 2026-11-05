import { ViewSpotVsVm  } from '@/components/aws/vista-funciones/spot-vs-vm/MainViewSpotVsVmComponent';
import { Suspense } from 'react';

export default function DashboardAwsSpotVsVm() {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <ViewSpotVsVm  />
      </Suspense>
    </div>
  )
}