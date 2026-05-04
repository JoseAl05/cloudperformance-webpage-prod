import { InterCloudReqEntry, InterCloudReqPayload } from '@/components/comp-cloud/intercloud/InterCloudConfigComponent';
import { InterCloudVmComponent } from '@/components/comp-cloud/intercloud/virtual_machines/InterCloudVmComponent';
import { FiltersComponent } from '@/components/general_comp_cloud/filters/FilterComponent';
import { PieChart } from 'lucide-react';

interface MainViewInterCloudVmComponentProps {
    payload: InterCloudReqPayload;
}

export const MainViewInterCloudVmComponent = ({ payload }: MainViewInterCloudVmComponentProps) => {
    let title = '';

    switch (payload.service_type) {
        case 'vms':
            title = 'Reporte de Maquinas Virtuales'
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
                                    Comparando tenant de {payload.cloud_provider}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full min-w-0 space-y-6'>
                {
                    payload.cloud_provider === 'Azure' &&
                    (
                        <FiltersComponent
                            Component={InterCloudVmComponent}
                            dateFilter={false}
                            regionFilter
                            isRegionMultiSelect
                            payload={payload}
                        />
                    )
                }
                {
                    payload.cloud_provider === 'AWS' &&
                    (
                        <FiltersComponent
                            Component={InterCloudVmComponent}
                            dateFilter={false}
                            regionFilter
                            isRegionMultiSelect
                            payload={payload}
                        />
                    )
                }
                {
                    payload.cloud_provider === 'GCP' &&
                    (
                        <FiltersComponent
                            Component={InterCloudVmComponent}
                            dateFilter={false}
                            regionFilter
                            isRegionMultiSelect
                            payload={payload}
                        />
                    )
                }
            </div>
        </div>
    )
}