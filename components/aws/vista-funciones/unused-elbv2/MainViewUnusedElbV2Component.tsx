import { FiltersComponent } from '@/components/general_aws/filters/FiltersComponent'
import { Workflow } from 'lucide-react'
import { UnusedNatGatewaysComponent } from '@/components/aws/vista-funciones/unused-nat-gateways/UnusedNatGatewaysComponent'
import { UnusedElbV2Component } from '@/components/aws/vista-funciones/unused-elbv2/UnusedElbV2Component'

export const MainViewUnusedElbV2Component = () => {
    return (
        <div className='w-full min-w-0 space-y-4'>
            <div className='mb-8'>
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                    <div>
                        <div className='flex items-center gap-3 mb-2'>
                            <div className='h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                                <Workflow className='h-6 w-6 text-blue-600' />
                            </div>
                            <div>
                                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                                    Loadbalancers Infrautilizados
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full min-w-0'>
                <FiltersComponent
                    Component={UnusedElbV2Component}
                    dateFilter
                    regionFilter
                    unusedElbV2Filter
                    isUnusedElbV2Multiselect
                />
            </div>
        </div>
    )
}