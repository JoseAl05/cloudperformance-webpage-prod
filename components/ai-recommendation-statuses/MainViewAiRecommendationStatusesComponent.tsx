import { FiltersComponent as GcpFiltersComponent } from '@/components/general_gcp/filters/FiltersComponent'
import { FiltersComponent as AwsFiltersComponent} from '@/components/general_aws/filters/FiltersComponent'
import { FiltersComponent as AzureFiltersComponent } from '@/components/general_azure/filters/FiltersComponent'
import { Pyramid} from 'lucide-react'
import { AiRecommendationStatusesComponent } from '@/components/ai-recommendation-statuses/AiRecommendationStatusesComponent'

interface MainViewAiRecommendationStatusesComponentProps {
    cloud: string;
}

export const MainViewAiRecommendationStatusesComponent = ({cloud}: MainViewAiRecommendationStatusesComponentProps) => {
    return (
        <div className='w-full min-w-0 space-y-4'>
            <div className='mb-8'>
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                    <div>
                        <div className='flex items-center gap-3 mb-2'>
                            <div className='h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center'>
                                <Pyramid className='h-6 w-6 text-emerald-600' />
                            </div>
                            <div>
                                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                                    Historial de ejecución de recomendaciones
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
                            Component={AiRecommendationStatusesComponent}
                            dateFilter
                            cloud={cloud}
                        />
                    )
                }
                {
                    cloud === 'azure' && (
                        <AzureFiltersComponent
                            Component={AiRecommendationStatusesComponent}
                            dateFilter
                            cloud={cloud}
                        />
                    )
                }
                {
                    cloud === 'gcp' && (
                        <GcpFiltersComponent
                            Component={AiRecommendationStatusesComponent}
                            dateFilter
                            cloud={cloud}
                        />
                    )
                }
            </div>
        </div>
    )
}