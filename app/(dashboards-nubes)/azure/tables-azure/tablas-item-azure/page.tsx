import { MainViewTablasItemAzureComponent } from '@/components/azure/tables-azure/tablas-item-azure/MainViewTablasItemAzureComponent';
import { Suspense } from 'react';

export default function TablasItemAzure() {
    return (
        <div className=''>
            <Suspense fallback={<div>Cargando...</div>}>
                <MainViewTablasItemAzureComponent />
            </Suspense>
        </div>
    )
}