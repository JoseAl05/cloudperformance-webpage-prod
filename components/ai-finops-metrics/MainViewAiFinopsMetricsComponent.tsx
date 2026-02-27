import { AiFinopsMetricsComponent } from '@/components/ai-finops-metrics/AiFinopsMetricsComponent'
import { UnusedCeComponent } from '@/components/gcp/vista-recursos/sin-uso/compute-engine/UnusedCeComponent'
import { FiltersComponent as GcpFiltersComponent } from '@/components/general_gcp/filters/FiltersComponent'
import { FiltersComponent as AwsFiltersComponent} from '@/components/general_aws/filters/FiltersComponent'
import { FiltersComponent as AzureFiltersComponent } from '@/components/general_azure/filters/FiltersComponent'
import { DollarSign, PieChart} from 'lucide-react'

interface MainViewAiFinopsMetricsComponentProps {
    cloud: string;
}

export const MainViewAiFinopsMetricsComponent = ({cloud}: MainViewAiFinopsMetricsComponentProps) => {
    return (
        <div className='w-full min-w-0 space-y-4'>
            <div className='mb-8'>
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                    <div>
                        <div className='flex items-center gap-3 mb-2'>
                            <div className='h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center'>
                                <DollarSign className='h-6 w-6 text-emerald-600' />
                            </div>
                            <div>
                                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                                    Análisis métricas Finops IA
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full min-w-0'>
                {
                    cloud === 'aws' && (
                        <AwsFiltersComponent
                            Component={AiFinopsMetricsComponent}
                            dateFilter
                        />
                    )
                }
                {
                    cloud === 'azure' && (
                        <AzureFiltersComponent
                            Component={AiFinopsMetricsComponent}
                            dateFilter
                        />
                    )
                }
                {
                    cloud === 'gcp' && (
                        <GcpFiltersComponent
                            Component={AiFinopsMetricsComponent}
                            dateFilter
                            cloud={cloud}
                        />
                    )
                }
            </div>
        </div>
    )
}