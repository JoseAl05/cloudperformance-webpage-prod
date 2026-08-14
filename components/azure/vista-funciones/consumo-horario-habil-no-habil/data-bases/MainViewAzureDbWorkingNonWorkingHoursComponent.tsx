import { FiltersComponent } from '@/components/general_azure/filters/FiltersComponent';
import { Database } from 'lucide-react';
import { AzureDbWorkingNonWorkingHoursComponent } from './AzureDbWorkingNonWorkingHoursComponent';

export const MainViewAzureDbWorkingNonWorkingHoursComponent = () => {
    return (
        <div className='w-full min-w-0 space-y-4'>
            <div className='mb-8'>
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                    <div>
                        <div className='flex items-center gap-3 mb-2'>
                            <div className='h-12 w-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center'>
                                <Database className='h-6 w-6 text-emerald-600 dark:text-emerald-400' />
                            </div>
                            <div>
                                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                                    Análisis uso de Bases de Datos Azure en horario hábil y no hábil
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full min-w-0'>
                <FiltersComponent
                    Component={AzureDbWorkingNonWorkingHoursComponent}
                    dateFilter
                    regionFilter
                    isRegionMultiSelect
                    subscriptionIdFilter
                    tagsFilter
                    tagsCollection="custom_db_metrics_logs"
                    tagsColumnName="tags"
                    tagsRegionField="location"
                    tagsLocalService="Azure Database"
                    tagsSubscriptionField="resource_id"
                    resourceGroupFilter
                    resourceGroupCollection="custom_db_metrics_logs"
                    resourceGroupSubscriptionField="resource_id"
                    instancesFilterV2
                    instancesV2Collection="custom_db_metrics_logs"
                    instancesV2SubscriptionField="resource_id"
                    instancesV2InstanceField="resource_name"
                />
            </div>
        </div>
    )
}