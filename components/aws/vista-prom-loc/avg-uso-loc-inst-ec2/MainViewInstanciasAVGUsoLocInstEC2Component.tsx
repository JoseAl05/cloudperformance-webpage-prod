// components/aws/vista-facturacion/tendencia-facturacion/MainViewTendenciaFacturacionComponent.tsx
import { FiltersComponent } from '@/components/general/filters/FiltersComponent'
import { AVGUsoLocInstEC2ChartComponent } from './AVGUsoLocInstEC2ChartComponent'
import { Download, Filter, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const MainViewInstanciasAVGUsoLocInstEC2Component = () => {
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
                                    Promedio Uso por Localización Instancias EC2
                                </h1>
                                <p className='text-gray-500 dark:text-gray-400'>
                                    Análisis Promedio Uso por Localización Instancias EC2
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full min-w-0'>
                <FiltersComponent
                    Component={AVGUsoLocInstEC2ChartComponent}
                    dateFilter
                    regionFilter

                    instancesFilter
                    instancesService='ec2'
                    isInstanceMultiSelect
                    tagsFilter
                    tagColumnName='Tags'
                    collection='aws_ec2_instances'

                    isRegionMultiSelect
                    metricsFilter
                />
            </div>
        </div>
    )
}