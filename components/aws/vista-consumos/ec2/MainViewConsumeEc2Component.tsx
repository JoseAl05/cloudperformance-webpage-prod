'use client'
import { FiltersComponent } from '@/components/general/FiltersComponent'
import { ChartLine } from 'lucide-react'
import { Ec2InstancesConsumeComponent } from './Ec2InstancesConsumeComponent'

export const MainViewConsumeEc2Component = () => {

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
                                    Instancias EC2
                                </h1>
                                <p className='text-gray-500 dark:text-gray-400'>
                                    Monitoreo y gestión de instancias Amazon EC2
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full min-w-0'>
                <FiltersComponent
                    Component={Ec2InstancesConsumeComponent}
                    dateFilter
                    regionFilter
                    instancesFilter
                    instancesService='ec2'
                    isInstanceMultiSelect
                    tagsFilter
                    collection='aws_ec2_instances'
                    tagColumnName='Tags'
                />
            </div>
        </div>
    )
}
