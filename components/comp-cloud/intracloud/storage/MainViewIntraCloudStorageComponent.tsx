'use client'

import { PieChart } from 'lucide-react'
import { ReqPayload } from '../IntraCloudConfigComponent';
import { FiltersComponent } from '@/components/general_comp_cloud/filters/FilterComponent';
import { IntraCloudStorageComponent } from '@/components/comp-cloud/intracloud/storage/IntraCloudStorageComponent';

interface MainViewIntraCloudStorageComponentProps {
    payload: ReqPayload;
}

export const MainViewIntraCloudStorageComponent = ({ payload }: MainViewIntraCloudStorageComponentProps) => {

    const tenantCount = payload.tenants ? payload.tenants.length : 0;
    let title = '';

    switch (payload.service_type) {
        case 'billing':
            title = 'Reporte de Facturación';
            break;
        case 'compute':
            title = 'Reporte de Cómputo';
            break;
        case 'storage':
            title = 'Reporte de Storage y Discos';
            break;
        default:
            title = '';
            break;
    }

    return (
        <div className='w-full min-w-0 space-y-4 animate-in slide-in-from-bottom-4 duration-700'>
            <div className='mb-8'>
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                    <div>
                        <div className='flex items-center gap-3 mb-2'>
                            <div className='h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center'>
                                <PieChart className='h-6 w-6 text-emerald-600' />
                            </div>
                            <div>
                                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                                    {title}
                                </h1>
                                <p className="text-sm text-gray-500">
                                    Comparando {tenantCount} entornos en {payload.cloud_provider}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full min-w-0 space-y-6'>
                {
                    payload.cloud_provider === 'Azure' && (
                        <FiltersComponent
                            Component={IntraCloudStorageComponent}
                            regionFilter
                            isRegionMultiSelect
                            subscriptionIdFilter
                            tagsFilter
                            resourceGroupFilter
                            serviceFilter
                            serviceType='storage'
                            resourceFilter
                            payload={payload}
                        />
                    )
                }
                {
                    payload.cloud_provider === 'AWS' && (
                        <FiltersComponent
                            Component={IntraCloudStorageComponent}
                            regionFilter
                            isRegionMultiSelect
                            serviceFilter
                            serviceType='storage'
                            resourceFilter
                            payload={payload}
                        />
                    )
                }
                {
                    payload.cloud_provider === 'GCP' && (
                        <FiltersComponent
                            Component={IntraCloudStorageComponent}
                            regionFilter
                            isRegionMultiSelect
                            serviceFilter
                            serviceType='storage'
                            resourceFilter
                            payload={payload}
                        />
                    )
                }
            </div>
        </div>
    )
}