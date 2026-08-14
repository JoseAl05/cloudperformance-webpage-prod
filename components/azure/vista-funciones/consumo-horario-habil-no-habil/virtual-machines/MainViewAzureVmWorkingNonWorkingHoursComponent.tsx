import { FiltersComponent } from '@/components/general_azure/filters/FiltersComponent';
import { PieChart } from 'lucide-react';
import { AzureVmWorkingNonWorkingHoursComponent } from './AzureVmWorkingNonWorkingHoursComponent';

export const MainViewAzureVmWorkingNonWorkingHoursComponent = () => {
    return (
        <div className='w-full min-w-0 space-y-4'>
            <div className='mb-8'>
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                    <div>
                        <div className='flex items-center gap-3 mb-2'>
                            <div className='h-12 w-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center'>
                                <PieChart className='h-6 w-6 text-emerald-600 dark:text-emerald-400' />
                            </div>
                            <div>
                                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                                    Análisis uso de Azure VMs en horario hábil y no hábil
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full min-w-0'>
                <FiltersComponent
                    Component={AzureVmWorkingNonWorkingHoursComponent}
                    dateFilter
                    regionFilter
                    isRegionMultiSelect
                    subscriptionIdFilter
                    tagsFilter
                    tagsCollection="custom_vm_metrics_logs"
                    tagsColumnName="tags"
                    tagsRegionField="location"
                    tagsLocalService="Virtual Machines"
                    tagsSubscriptionField="vm_id"
                    resourceGroupFilter
                    resourceGroupCollection="custom_vm_metrics_logs"
                    resourceGroupSubscriptionField="vm_id"
                    instancesFilterV2
                    instancesV2Collection="custom_vm_metrics_logs"
                    instancesV2SubscriptionField="vm_id"
                    instancesV2InstanceField="vm_name"
                />
            </div>
        </div>
    )
}