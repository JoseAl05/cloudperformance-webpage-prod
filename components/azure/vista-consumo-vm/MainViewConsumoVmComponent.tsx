// components/aws/vista-facturacion/tendencia-facturacion/MainViewTendenciaFacturacionComponent.tsx
import { FiltersComponent } from '@/components/general_azure/filters/FiltersComponent'
import  {AzureVmMetricsComponent}  from './ConsumoVmComponent'
import { ChartLine } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const MainViewConsumoVmComponent = () => {
    return (
        <div className='w-full min-w-0 space-y-4'>
            <div className='mb-8'>
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                    <div>
                        <div className='flex items-center gap-3 mb-2'>
                            <div className='h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                                <ChartLine className='h-6 w-6 text-blue-600' />
                            </div>
                            <div>
                                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                                    Consumo/No Consumo Vms
                                </h1>
                                <p className='text-gray-500 dark:text-gray-400'>
                                    Análisis de Consumo por Máquina Virtual
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full min-w-0'>
                <FiltersComponent
                    Component={AzureVmMetricsComponent}
                    dateFilter
                    regionFilter
                    isRegionMultiSelect
                    subscriptionIdFilter
                    tagsFilter
                    tagsCollection='custom_vm_metrics_logs'
                    tagsColumnName='tags'
                    tagsRegionField = 'location'
                    tagsSubscriptionField = 'vm_id'
                    resourceGroupFilter
                    resourceGroupCollection='custom_vm_metrics_logs'
                    resourceGroupSubscriptionField='vm_id'
                    instancesFilterV2
                    instancesV2Collection="custom_vm_metrics_logs"
                    instancesV2SubscriptionField="vm_id"
                    instancesV2InstanceField="vm_name"
  
                />
            </div>
        </div>
    )
}

