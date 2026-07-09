import { MainViewTopStorageBucketsComponent } from '@/components/gcp/vista-funciones/top-storage-buckets/MainViewTopStorageBucketsComponent';
import { Suspense } from 'react';

export default function TopStorageBucketsPage() {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <MainViewTopStorageBucketsComponent />
      </Suspense>
    </div>
  );
}