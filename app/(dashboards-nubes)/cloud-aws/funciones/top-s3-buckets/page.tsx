import { ViewTopS3Buckets  } from '@/components/aws/vista-funciones/top-s3-buckets/MainViewTopS3BucketsComponent';
import { Suspense } from 'react';

export default function DashboardAwsTopS3Buckets() {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <ViewTopS3Buckets  />
      </Suspense>
    </div>
  )
}