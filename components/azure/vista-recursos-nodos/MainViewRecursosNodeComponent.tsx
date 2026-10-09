import { FiltersComponent } from '@/components/general_azure/filters/FiltersComponent';
import { Server } from 'lucide-react';
import { AzureNodeResourceComponent } from './AzureNodeResourceComponent';

export const MainViewRecursosNodeComponent = () => {
    return (
        <div className='w-full min-w-0 space-y-4'>
            <div className='mb-8'>
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                    <div>
                        <div className='flex items-center gap-3 mb-2'>
                            <div className='h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center'>
                                <Server className='h-6 w-6 text-blue-600 dark:text-blue-400' />
                            </div>
                            <div>
                                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                                    Detalles de Nodos (Azure)
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full min-w-0'>
                <FiltersComponent
                    Component={AzureNodeResourceComponent}
                    dateFilter
                    subscriptionIdFilter
                    regionFilter
                    resourceGroupFilter
                    resourceGroupResourceType="k8s_nodes"
                    instancesFilterV2
                    instancesV2ResourceType="k8s_nodes"
                    isResourceMultiSelect={false}
                />
            </div>
        </div>
    )
}