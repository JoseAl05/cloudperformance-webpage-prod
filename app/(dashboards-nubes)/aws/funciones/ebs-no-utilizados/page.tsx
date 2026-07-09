
import { MainViewUnusedEbsComponent } from '@/components/aws/vista-funciones/unused-ebs/MainViewUnusedEbsComponent';
import { Suspense } from 'react';

export default function DashboardAwsEbsUnused() {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <MainViewUnusedEbsComponent />
      </Suspense>
    </div>
  )
}