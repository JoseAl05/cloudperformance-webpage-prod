// components/aws/vista-facturacion/tendencia-facturacion/MainViewTendenciaFacturacionComponent.tsx
import { FiltersComponent } from '@/components/general_azure/filters/FiltersComponent'
import { TendenciaFacturacionAzureChartComponent } from '@/components/azure/vista-facturacion/tendencia-pago-por-uso/TendenciaFacturacionPagoPorUsoChartComponent'
import { Download, Filter, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const MainViewTendenciaPagoPorUsoComponent = () => {
    return (
        <div className='w-full min-w-0 space-y-4'>
            <div className='mb-8'>
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                    <div>
                        <div className='flex items-center gap-3 mb-2'>
                            <div className='h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                                <TrendingUp className='h-6 w-6 text-blue-600' />
                            </div>
                            <div>
                                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                                    Tendencia Pago Por Uso
                                </h1>
                                <p className='text-gray-500 dark:text-gray-400'>
                                    Análisis de Facturacion Tendencia Pago Por Uso
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full min-w-0'>
                <FiltersComponent
                    Component={TendenciaFacturacionAzureChartComponent}
                    dateFilter
                    regionFilter
                    isRegionMultiSelect
                    subscriptionFilter
                    tagsFilter
                    tagsCollection='azure_consumption_billing_account_modern_usage_details'
                    tagsColumnName='tags'
                    tagsRegionField = 'resource_location'
                    tagsSubscriptionField = 'subscription_name'
                    //metricsFilter
                    //metricsCollection='custom_db_metrics_logs'
                    instancesFilter
                />
            </div>
        </div>
    )
}

