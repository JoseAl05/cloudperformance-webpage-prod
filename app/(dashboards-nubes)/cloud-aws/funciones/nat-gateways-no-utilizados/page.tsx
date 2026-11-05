
import { MainViewUnusedNatGatewaysComponent } from '@/components/aws/vista-funciones/unused-nat-gateways/MainViewUnusedNatGatewaysComponent';
import { Suspense } from 'react';

export default function DashboardAwsNatGatewaysUnused() {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <MainViewUnusedNatGatewaysComponent />
      </Suspense>
    </div>
  )
}