import { MainViewDiscosPersistentesComponent } from '@/components/gcp/vista-recursos/sin-uso/discos-persistentes/MainViewDiscosPersistentesComponent';
import { Suspense } from 'react';

export default function PersistentDisksPage() {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <MainViewDiscosPersistentesComponent />
      </Suspense>
    </div>
  );
}