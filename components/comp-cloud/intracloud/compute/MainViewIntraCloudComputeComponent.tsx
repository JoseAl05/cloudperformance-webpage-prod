// 'use client'

// import { PieChart, Loader2, AlertCircle } from 'lucide-react'
// import useSWR from 'swr';
// import { ReqPayload } from '../IntraCloudConfigComponent';
// import { IntraCloudBillingComponent } from '@/components/comp-cloud/intracloud/billing/IntraCloudBillingComponent';
// import { useCallback } from 'react';
// import { FiltersComponent } from '@/components/general_comp_cloud/filters/FilterComponent';


// interface MainViewIntraCloudComputeComponentProps {
//     payload: ReqPayload;
// }

// export const MainViewIntraCloudComputeComponent = ({ payload }: MainViewIntraCloudComputeComponentProps) => {

//     return (
//         <div className='w-full min-w-0 space-y-4 animate-in slide-in-from-bottom-4 duration-700'>
//             <div className='mb-8'>
//                 <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
//                     <div>
//                         <div className='flex items-center gap-3 mb-2'>
//                             <div className='h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center'>
//                                 <PieChart className='h-6 w-6 text-emerald-600' />
//                             </div>
//                             <div>
//                                 <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
//                                     Reporte de {payload.service_type === 'billing' ? 'Facturación' : payload.service_type}
//                                 </h1>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div className='w-full min-w-0 space-y-6'>
//                 <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
//                     <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Comparación {payload.cloud_provider} - {payload.service_type}</h3>
//                 </div>
//                 <FiltersComponent
//                     Component={IntraCloudBillingComponent}
//                     regionFilter
//                     isRegionMultiSelect
//                     subscriptionIdFilter
//                     tagsFilter
//                     resourceGroupFilter
//                     payload={payload}
//                 />
//             </div>

//         </div>
//     )
// }
'use client'

import { PieChart } from 'lucide-react'
import { ReqPayload } from '../IntraCloudConfigComponent';
import { IntraCloudBillingComponent } from '@/components/comp-cloud/intracloud/billing/IntraCloudBillingComponent';
import { FiltersComponent } from '@/components/general_comp_cloud/filters/FilterComponent';
import { IntraCloudComputeComponent } from '@/components/comp-cloud/intracloud/compute/IntraCloudComputeComponent';

interface MainViewIntraCloudComputeComponentProps {
    payload: ReqPayload;
}

export const MainViewIntraCloudComputeComponent = ({ payload }: MainViewIntraCloudComputeComponentProps) => {

    const tenantCount = payload.tenants ? payload.tenants.length : 0;
    let title = '';

    switch (payload.service_type) {
        case 'billing':
            title = 'Reporte de Facturación'
            break;
        case 'compute':
            title = 'Reporte de Cómputo'
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
                    payload.cloud_provider === 'Azure' ? (
                        <FiltersComponent
                            Component={IntraCloudComputeComponent}
                            regionFilter
                            isRegionMultiSelect
                            subscriptionIdFilter
                            tagsFilter
                            resourceGroupFilter
                            serviceFilter
                            serviceType='compute'
                            resourceFilter
                            payload={payload}
                        />
                    ) : (
                        <FiltersComponent
                            Component={IntraCloudComputeComponent}
                            regionFilter
                            isRegionMultiSelect
                            serviceFilter
                            serviceType='compute'
                            resourceFilter
                            payload={payload}
                        />
                    )
                }
            </div>
        </div>
    )
}