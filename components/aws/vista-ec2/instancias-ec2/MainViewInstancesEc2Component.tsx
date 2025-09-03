import { FiltersComponent } from '@/components/general/FiltersComponent'
import { InstanceEc2CpuMetricsComponent } from './InstanceEc2CpuMetricsComponent'
import { Download, Filter, Server } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const MainViewInstancesEc2Component = () => {
    return (
        <div className='w-full min-w-0 space-y-4'>
            <div className='mb-8'>
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                    <div>
                        <div className='flex items-center gap-3 mb-2'>
                            <div className='h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                                <Server className='h-6 w-6 text-blue-600' />
                            </div>
                            <div>
                                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                                    Instancias EC2
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full min-w-0'>
                <FiltersComponent
                    Component={InstanceEc2CpuMetricsComponent}
                    dateFilter
                    regionFilter
                    instancesFilter
                    instancesService='ec2'
                    tagsFilter
                    collection='aws_ec2_instances'
                    tagColumnName='Tags'
                />
            </div>
        </div>
    )
}