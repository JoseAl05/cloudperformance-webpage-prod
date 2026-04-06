'use client'
import { FiltersComponent } from '@/components/general_aws/filters/FiltersComponent'
import { ChartLine } from 'lucide-react'
import { AsgConsumeComponent } from '@/components/aws/vista-consumos/ec2/asg/AsgConsumeComponent'

export const MainViewConsumeAsgComponent = () => {
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
                                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>Consumo/No Consumo Instancias de Autoscaling Groups</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='w-full min-w-0'>
                <FiltersComponent
                    Component={AsgConsumeComponent}
                    dateFilter
                    regionFilter
                    asgFilter
                    isAsgMultiSelect
                    isAsgInstanceMultiSelect
                    tagsFilter
                    collection='aws_auto_scaling_groups'
                    tagColumnName='Tags'
                    localService='Amazon Elastic Compute Cloud - Compute'
                />
            </div>
        </div>
    )
}
