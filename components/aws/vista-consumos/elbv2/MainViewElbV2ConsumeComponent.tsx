import { ElbV2ConsumeComponent } from '@/components/aws/vista-consumos/elbv2/ElbV2ConsumeComponent'
import { NatGatewaysConsumeComponent } from '@/components/aws/vista-consumos/nat-gateways/NatGatewaysConsumeComponent'
import { FiltersComponent } from '@/components/general_aws/filters/FiltersComponent'
import { Workflow } from 'lucide-react'

export const MainViewElbV2ConsumeComponent = () => {
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
                                    Consumo/No Consumo Loadbalancers V2
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full min-w-0'>
                <FiltersComponent
                    Component={ElbV2ConsumeComponent}
                    dateFilter
                    regionFilter
                    elbV2Filter
                    isElbV2Multiselect
                />
            </div>
        </div>
    )
}