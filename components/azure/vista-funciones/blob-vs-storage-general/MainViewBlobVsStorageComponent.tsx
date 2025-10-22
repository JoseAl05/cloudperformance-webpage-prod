import { FiltersComponent } from '@/components/general_azure/filters/FiltersComponent'
import { Container } from 'lucide-react'
import { BlobVsStorageGeneralComponent } from '@/components/azure/vista-funciones/blob-vs-storage-general/BlobVsStorageGeneralComponent'

export const MainViewBlobVsStorageComponent = () => {
    return (
        <div className='w-full min-w-0 space-y-4'>
            <div className='mb-8'>
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                    <div>
                        <div className='flex items-center gap-3 mb-2'>
                            <div className='h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center'>
                                <Container className='h-6 w-6 text-emerald-600' />
                            </div>
                            <div>
                                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                                    Blob Storage vs Storage General
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full min-w-0'>
                <FiltersComponent
                    Component={BlobVsStorageGeneralComponent}
                    regionFilter
                    isRegionMultiSelect
                    subscriptionIdFilter
                    strgAccountFilter
                    isStrgAccountMultiselect
                    tagsFilter
                    tagsCollection='azure_storage_accounts'
                    tagsColumnName='tags'
                    tagsRegionField='location'
                    tagsSubscriptionField='subscription_id'
                />
            </div>
        </div>
    )
}