// components/aws/vista-rds/avg-uso-loc-inst-rds-pg/MainViewInstanciasAVGUsoLocInstRdsPgComponent.tsx
import { FiltersComponent } from '@/components/general/filters/FiltersComponent'
import { AVGUsoLocInstRdsPgChartComponent } from './AVGUsoLocInstRdsPgChartComponent'
import { Download, Filter, Database } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const MainViewInstanciasAVGUsoLocInstRdsPgComponent = () => {
    return (
        <div className='w-full min-w-0 space-y-4'>
            <div className='mb-8'>
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                    <div>
                        <div className='flex items-center gap-3 mb-2'>
                            <div className='h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center'>
                                <Database className='h-6 w-6 text-purple-600' />
                            </div>
                            <div>
                                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                                    Promedio Uso por Localización Instancias RDS PostgreSQL
                                </h1>
                                <p className='text-gray-500 dark:text-gray-400'>
                                    Análisis Promedio Uso por Localización Instancias RDS PostgreSQL
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full min-w-0'>
                <FiltersComponent
                    Component={AVGUsoLocInstRdsPgChartComponent}
                    dateFilter
                    regionFilter

                    instancesFilter
                    instancesService='rds-pg'
                    isInstanceMultiSelect
                    tagsFilter
                    tagColumnName='TagList'
                    collection='aws_rds_postgresql'

                    isRegionMultiSelect
                    metricsRDSFilter
                />
            </div>
        </div>
    )
}