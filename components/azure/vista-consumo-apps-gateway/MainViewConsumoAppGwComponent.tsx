// components/aws/vista-facturacion/tendencia-facturacion/MainViewTendenciaFacturacionComponent.tsx
import { FiltersComponent } from '@/components/general_azure/filters/FiltersComponent'
import { AzureVmMetricsComponent } from '@/components/azure/vista-consumo-vm/ConsumoVmComponent'
import { ChartLine } from 'lucide-react'
import { ConsumoAppGwComponent } from '@/components/azure/vista-consumo-apps-gateway/ConsumoAppGwComponent'
export const MainViewConsumoAppGwComponent = () => {
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
                                    Consumo/No Consumo Applications Gateway
                                </h1>
                                <p className='text-gray-500 dark:text-gray-400'>
                                    Análisis de Consumo por Application Gateway
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full min-w-0'>
                <FiltersComponent
                    Component={ConsumoAppGwComponent}
                    dateFilter
                    regionFilter
                    isRegionMultiSelect
                    subscriptionIdFilter
                    tagsFilter
                    tagsCollection='azure_app_gateways'
                    tagsColumnName='tags'
                    tagsRegionField='location'
                    tagsSubscriptionField='subscription_id'
                    resourceGroupFilter
                    resourceGroupCollection='azure_app_gateways'
                    resourceGroupSubscriptionField='subscription_id'
                    appGFilter
                    isAppGFilterMultiselect
                />
            </div>
        </div>
    )
}

