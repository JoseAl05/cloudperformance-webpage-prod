import { Suspense } from 'react';

export default function IncrementoTopRecursosUso() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <></>
            </Suspense>
        </div>
    )
}