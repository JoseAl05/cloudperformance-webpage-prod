import { FiltersComponent } from '@/components/general/filters/FiltersComponent'
import { InstanciasRdsPgChartComponent } from '@/components/aws/vista-rds/instancias-rds-pg/InstanciasRdsPgChartComponent'
import { Database } from 'lucide-react'

export const MainViewInstanciasRdsPgComponent = () => {
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
                                    Instancias RDS PostgreSQL
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full min-w-0'>
                <FiltersComponent
                    Component={InstanciasRdsPgChartComponent}
                    dateFilter
                    regionFilter
                    instancesFilter
                    instancesService='rds-pg'
                    tagsFilter
                    serviceType="rds"
                    collection='aws_rds_postgresql'
                    tagColumnName='TagList'
                />
            </div>
        </div>
    )
}